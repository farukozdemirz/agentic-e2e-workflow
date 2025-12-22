import { FlowDefinition } from "../../flow/types";
import { Assertion } from "../../observation/types";

export function buildEscalationPrompt(input: {
  flow: FlowDefinition;
  assertions: Assertion[];
}) {
  return `
You are an expert QA engineer reviewing ambiguous E2E test results.

FLOW:
${input.flow.name} (criticality: ${input.flow.criticality})

ASSERTION RESULTS:
${JSON.stringify(input.assertions, null, 2)}

TASK:
Decide whether the flow should be considered:
- ok
- degraded
- broken

RULES:
- Treat "soft" assertion failures as potentially acceptable
- Consider UI timing, async rendering, feature flags
- Do NOT invent missing behavior
- Be conservative

Return STRICT JSON:
{
  "status": "ok | degraded | broken",
  "confidence": number between 0 and 1,
  "summary": string,
  "rootCauseHypotheses": string[],
  "suggestedActions": string[]
}
`;
}
