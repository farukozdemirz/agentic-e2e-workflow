"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function main() {
    const args = process.argv.slice(2);
    if (args.includes("--help")) {
        console.log(`
agentic-e2e-workflow

Commands:
  qg run        Run agentic workflows
  qg llm ping  Check LLM connectivity
`);
        return;
    }
    console.log("Agentic E2E Workflow CLI started");
}
main();
