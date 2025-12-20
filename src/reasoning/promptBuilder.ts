import { ExecutionSummary } from "../flow/executionTypes";
import { FlowDefinition } from "../flow/types";
import { Observation } from "../observation/types";

export function buildReasoningPrompt(input: {
  flow: FlowDefinition;
  observations: Observation[];
  execution: ExecutionSummary;
  runMeta: { runId: string };
}) {
  return `
You are an AI quality guardian agent tasked with analyzing the execution of a web application flow and producing a structured, evidence-based judgment.

RUN
- runId: ${input.runMeta.runId}

EXECUTION (deterministic):
${JSON.stringify(input.execution, null, 2)}

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

Rules:
- status MUST be one of: ok | degraded | broken
- If execution.ok is false → status MUST be "broken" and focus on root cause and next actions.
- "broken": flow cannot complete or critical step failed
- "degraded": flow completes but UX or technical warnings exist
- "ok": no meaningful issues

Return STRICT JSON ONLY with:
{
  "status": "ok | degraded | broken",
  "confidence": number,
  "summary": string,
  "rootCauseHypotheses": string[],
  "suggestedActions": string[]
}
`;
}
