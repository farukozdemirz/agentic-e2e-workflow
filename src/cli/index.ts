import "dotenv/config";
import { createLLMProvider } from "../ai";

const helpContent = `
agentic-e2e-workflow

Commands:
  qg run        Run agentic workflows
  qg llm ping  Check LLM connectivity
`;

async function main() {
  const args = process.argv.slice(2);

  if (args.includes("--help")) {
    console.log(helpContent);
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

  console.log("Agentic E2E Workflow CLI started");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
