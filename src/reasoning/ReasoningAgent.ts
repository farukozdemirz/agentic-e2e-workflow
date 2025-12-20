import { LLMProvider } from "../ai/providers/LLMProvider";
import { ExecutionSummary } from "../flow/executionTypes";
import { FlowDefinition } from "../flow/types";
import { Observation } from "../observation/types";
import { buildReasoningPrompt } from "./promptBuilder";
import { ReasoningResult } from "./types";

export class ReasoningAgent {
  private readonly systemPrompt =
    "You analyze E2E flow health and produce structured, evidence-based judgments.";

  private readonly temperature = 0.1;

  constructor(private llm: LLMProvider) {}

  async evaluate(input: {
    flow: FlowDefinition;
    observations: Observation[];
    runId: string;
    execution: ExecutionSummary;
  }): Promise<ReasoningResult> {
    const prompt = buildReasoningPrompt({
      flow: input.flow,
      observations: input.observations,
      runMeta: { runId: input.runId },
      execution: input.execution,
    });

    const res = await this.llm.sendPrompt({
      system: this.systemPrompt,
      prompt,
      temperature: this.temperature,
    });

    try {
      return JSON.parse(res.content) as ReasoningResult;
    } catch {
      return {
        status: input.execution.ok ? "degraded" : "broken",
        confidence: 0.5,
        summary:
          "LLM output was not valid JSON. Treating as degraded/broken based on execution result.",
        rootCauseHypotheses: ["Invalid JSON returned by LLM."],
        suggestedActions: [
          "Inspect reasoning.json",
          "Tighten prompt JSON constraints",
        ],
      };
    }
  }
}
