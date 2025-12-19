import { FlowDefinition } from "../flow/types";
import { Observation } from "../observation/types";

export function buildReasoningPrompt(input: {
  flow: FlowDefinition;
  observations: Observation[];
  runMeta: {
    runId: string;
  };
}) {
  return `
You are an AI quality guardian for web applications.

FLOW
- name: ${input.flow.name}
- version: ${input.flow.version}
- criticality: ${input.flow.criticality}

OBSERVATIONS (JSON):
${JSON.stringify(input.observations, null, 2)}

TASK
Evaluate the flow execution and decide:
- status: ok | degraded | broken
- confidence: number between 0 and 1
- summary: short explanation
- rootCauseHypotheses: list
- suggestedActions: list

RULES
- "broken": critical flow cannot complete or severe errors (5xx, auth blocks, missing CTAs)
- "degraded": flow completes but with warnings (console errors, slow responses, UI anomalies)
- "ok": no meaningful issues

Return STRICT JSON with fields:
status, confidence, summary, rootCauseHypotheses, suggestedActions
`;
}
