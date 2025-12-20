import "dotenv/config";
import { createLLMProvider } from "../ai";
import { runSmoke } from "../browser";
import { getFlow } from "../flow/registry";
import { BrowserManager } from "../browser/BrowserManager";
import { executeStepWithArtifacts } from "../flow/executor";
import { createRunContext } from "../flow/runContext";
import { writeFlowMeta } from "../flow/flowReporter";
import { ObservationAgent } from "../observation/ObservationAgent";
import { writeObservations } from "../flow/observationReporter";
import { ReasoningAgent } from "../reasoning/ReasoningAgent";
import { writeReasoning } from "../reasoning/reasoningReporter";
import { writeSummaryJson } from "../reporting/summaryReporter";
import { writeMarkdownReport } from "../reporting/markdownReporter";
import { simpleRetry } from "../retry/healing/simpleRetry";
import { decideRetry } from "../retry/retryPolicy";

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
  qg run --flow <name> Generates report.md and summary.json under artifacts.
`;

type ExecutionStatus = "completed" | "failed";

type FlowRunDeps = {
  browserManager: BrowserManager;
  observationAgent: ObservationAgent;
  reasoningAgent: ReasoningAgent;
};
const runFlowCommand = async (args: string[]) => {
  const flowName = parseFlowName(args);
  if (!flowName) return false;

  const debug = args.includes("--debug");
  const headless = !debug;

  const flow = getFlow(flowName);
  const { runId, baseDir, attempts, environment } = createRunContext();

  console.log(`▶️ Starting flow "${flow.name}" (runId: ${runId})`);

  const deps: FlowRunDeps = {
    browserManager: new BrowserManager(),
    observationAgent: new ObservationAgent(),
    reasoningAgent: new ReasoningAgent(createLLMProvider()),
  };

  const page = await deps.browserManager.launch({ headless });
  deps.observationAgent.attach(page);

  let executionStatus: ExecutionStatus = "completed";
  let reasoningResult: any = null;

  try {
    // Attempt #1
    const attempt1 = await runAttempt({
      page,
      flow,
      baseDir,
      deps,
      label: "attempt-1",
    });
    executionStatus = attempt1.executionStatus;
    reasoningResult = attempt1.reasoning;

    const retryDecision = decideRetry({
      reasoning: reasoningResult,
      observations: attempt1.observations,
    });

    if (!retryDecision.retry) {
      console.log(`🧾 No retry: ${retryDecision.reason}`);
      return true;
    }

    console.log(`🔁 Retry triggered: ${retryDecision.reason}`);
    (attempts as any) &&
      ((attempts as any).value = ((attempts as any).value ?? 1) + 1);

    await simpleRetry(page);

    const attempt2 = await runAttempt({
      page,
      flow,
      baseDir,
      deps,
      label: "attempt-2",
    });
    executionStatus = attempt2.executionStatus;
    reasoningResult = attempt2.reasoning;

    console.log(
      `🧠 Post-retry result: ${reasoningResult.status} (confidence: ${reasoningResult.confidence})`
    );

    return true;
  } finally {
    try {
      if (reasoningResult) {
        writeSummaryJson(baseDir, {
          runId,
          flow,
          status: executionStatus,
          reasoning: reasoningResult,
          observations: deps.observationAgent.getObservations(),
          environment,
        });

        writeMarkdownReport(baseDir, {
          runId,
          flow,
          environment,
          status: executionStatus,
          reasoning: reasoningResult,
          observations: deps.observationAgent.getObservations(),
        });

        console.log(`📄 Report generated: ${baseDir}/report.md`);
      }
    } catch (reportErr) {
      console.error("⚠️ Reporting failed:", reportErr);
    } finally {
      await deps.browserManager.close();
      console.log(`✅ Flow "${flow.name}" finished`);
    }
  }
};

async function runAttempt(input: {
  page: any;
  flow: any;
  baseDir: string;
  deps: FlowRunDeps;
  label: string;
}): Promise<{
  executionStatus: ExecutionStatus;
  observations: any[];
  reasoning: any;
}> {
  const { page, flow, baseDir, deps, label } = input;

  deps.observationAgent.reset();

  console.log(`🧪 Running ${label}`);

  let executionStatus: ExecutionStatus = "completed";

  try {
    for (let i = 0; i < flow.steps.length; i++) {
      const step = flow.steps[i];
      console.log(
        `→ ${label} step ${i + 1}/${flow.steps.length}: ${step.type}`
      );
      await executeStepWithArtifacts(
        page,
        baseDir,
        step,
        i,
        deps.observationAgent
      );
    }
  } catch (err) {
    executionStatus = "failed";
    console.error(`❌ ${label} execution failed:`, err);
  }

  const observations = deps.observationAgent.getObservations();

  writeObservations(baseDir, observations);
  writeFlowMeta(baseDir, flow, executionStatus);

  const reasoning = await deps.reasoningAgent.evaluate({
    flow,
    observations,
    runId: extractRunIdFromBaseDir(baseDir),
  });

  writeReasoning(baseDir, reasoning);

  console.log(
    `🧠 ${label} result: ${reasoning.status} (confidence: ${reasoning.confidence})`
  );

  return { executionStatus, observations, reasoning };
}

function parseFlowName(args: string[]): string | null {
  const flowFlagIndex = args.indexOf("--flow");
  if (flowFlagIndex === -1) return null;

  const flowName = args[flowFlagIndex + 1];
  if (!flowName) {
    throw new Error(
      "Flow name is required. Usage: qg run --flow <flowName> [--debug]"
    );
  }
  return flowName;
}

function extractRunIdFromBaseDir(baseDir: string) {
  const parts = baseDir.split("/");
  return parts[parts.length - 1];
}

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
    await runFlowCommand(args);
  }

  console.log("Agentic E2E Workflow CLI started");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
