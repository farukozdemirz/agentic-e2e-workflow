import { writeFileSync } from "fs";
import { join } from "path";
import { ReportingInput } from "./types";
import { computeFinalVerdict } from "./finalVerdict";

function emoji(status: string) {
  if (status === "ok") return "✅";
  if (status === "degraded") return "⚠️";
  return "❌";
}

function fmtConfidence(c: number) {
  const safe = Number.isFinite(c) ? c : 0;
  return safe.toFixed(2);
}

export function writeMarkdownReport(baseDir: string, input: ReportingInput) {
  const { flow, reasoning, status, runId, environment, execution } = input;
  const finalVerdict = computeFinalVerdict({ execution, reasoning });

  // prettier-ignore
  const executionLine = input.execution.ok ? "✅ ok" : `❌ failed${input.execution.failedStep ? ` (step ${input.execution.failedStep.stepIndex + 1}: ${input.execution.failedStep.stepType})`: ""}`;
  const md = `# Agentic E2E Quality Guardian Report

## Run
- **Run ID:** \`${input.runId}\`
- **Environment:** \`${input.environment}\`
- **Flow:** \`${input.flow.name}\` (v${input.flow.version})
- **Criticality:** \`${input.flow.criticality}\`

## Result
- **Execution:** ${executionLine}
- **AI Assessment:** \`${input.reasoning.status}\` (confidence: ${input.reasoning.confidence})
- **Final Verdict:** \`${finalVerdict.finalStatus}\` — ${finalVerdict.reason}

## Summary
${input.reasoning.summary}

## Verdict
- **Status:** ${emoji(reasoning.status)} \`${reasoning.status}\`
- **Confidence:** \`${fmtConfidence(reasoning.confidence)}\`

## Summary
${reasoning.summary}

## Root Cause Hypotheses
${(input.reasoning.rootCauseHypotheses?.length
  ? input.reasoning.rootCauseHypotheses
  : ["(none)"]
)
  .map((x: string) => `- ${x}`)
  .join("\n")}

## Suggested Next Actions
${(input.reasoning.suggestedActions?.length
  ? input.reasoning.suggestedActions
  : ["(none)"]
)
  .map((x: string) => `- ${x}`)
  .join("\n")}
  
## Artifacts
- \`flow.json\`
- \`observations.json\`
- \`reasoning.json\`
- \`summary.json\`
- \`steps/*/screenshot.png\`
`;

  writeFileSync(join(baseDir, "report.md"), md);
}
