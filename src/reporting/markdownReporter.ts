import { writeFileSync } from "fs";
import { join } from "path";
import { ReportingInput } from "./types";

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
  const { flow, reasoning, status, runId } = input;

  const md = `# Agentic E2E Quality Guardian Report

## Run
- **Run ID:** \`${runId}\`
- **Flow:** \`${flow.name}\` (v${flow.version})
- **Criticality:** \`${flow.criticality}\`
- **Execution:** \`${status}\`

## Verdict
- **Status:** ${emoji(reasoning.status)} \`${reasoning.status}\`
- **Confidence:** \`${fmtConfidence(reasoning.confidence)}\`

## Summary
${reasoning.summary}

## Root Cause Hypotheses
${(reasoning.rootCauseHypotheses?.length
  ? reasoning.rootCauseHypotheses
  : ["(none)"]
)
  .map((x) => `- ${x}`)
  .join("\n")}

## Suggested Next Actions
${(reasoning.suggestedActions?.length ? reasoning.suggestedActions : ["(none)"])
  .map((x) => `- ${x}`)
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
