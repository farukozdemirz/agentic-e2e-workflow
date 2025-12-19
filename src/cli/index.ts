import "dotenv/config";
import { createLLMProvider } from "../ai";
import { runSmoke } from "../browser";
import { getFlow } from "../flow/registry";
import { BrowserManager } from "../browser/BrowserManager";
import { executeStepWithArtifacts } from "../flow/executor";
import { createRunContext } from "../flow/runContext";
import { writeFlowMeta } from "../flow/flowReporter";

const helpContent = `
agentic-e2e-workflow (qg)

Usage:
  qg <command> [options]

Commands:
  llm ping
      Check LLM provider connectivity

  run smoke --url <url> [--debug]
      Run a basic browser smoke test
      --url     Target URL (default: https://example.com)
      --debug   Run browser in non-headless mode

Examples:
  qg llm ping
  qg run smoke --url https://example.com
  qg run smoke --url https://example.com --debug
`;

async function main() {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.length === 0) {
    console.log(helpContent);
    return;
  }

  if (args[0] === "run" && args[1] === "smoke") {
    const urlIndex = args.indexOf("--url");
    const url = urlIndex !== -1 ? args[urlIndex + 1] : "https://example.com";
    const headless = !args.includes("--debug");

    await runSmoke(url, headless);
    console.log("Smoke run completed");
    return;
  }

  if (args[0] === "llm" && args[1] === "ping") {
    const provider = createLLMProvider();

    console.log(`Pinging LLM provider: ${provider.name}`);

    const result = await provider.sendPrompt({
      system: "You are a health check agent.",
      prompt: "Reply with: LLM_OK",
    });

    console.log("Response:", result.content.trim());
    return;
  }

  if (args[0] === "run" && args[1] === "--flow") {
    const flowName = args[2];
    if (!flowName) throw new Error("Flow name is required");

    const flow = getFlow(flowName);
    const { runId, baseDir } = createRunContext();

    const manager = new BrowserManager();
    const page = await manager.launch({ headless: true });

    try {
      for (let i = 0; i < flow.steps.length; i++) {
        await executeStepWithArtifacts(page, baseDir, flow.steps[i], i);
      }

      writeFlowMeta(baseDir, flow, "completed");
      console.log(`Flow "${flow.name}" completed (runId: ${runId})`);
    } catch (err) {
      writeFlowMeta(baseDir, flow, "failed");
      throw err;
    } finally {
      await manager.close();
    }

    return;
  }

  console.log("Agentic E2E Workflow CLI started");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
