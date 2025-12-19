import { LLMProvider } from "../ai/providers/LLMProvider";
import { FlowDefinition } from "../flow/types";
import { Observation } from "../observation/types";
import { buildReasoningPrompt } from "./promptBuilder";
import { ReasoningResult } from "./types";

export class ReasoningAgent {
  constructor(private llm: LLMProvider) {}

  async evaluate(input: {
    flow: FlowDefinition;
    observations: Observation[];
    runId: string;
  }): Promise<ReasoningResult> {
    const prompt = buildReasoningPrompt({
      flow: input.flow,
      observations: input.observations,
      runMeta: { runId: input.runId },
    });

    const res = await this.llm.sendPrompt({
      system: "You analyze E2E flow health and produce structured judgments.",
      prompt,
      temperature: 0.1,
    });

    const parsed = JSON.parse(res.content) as ReasoningResult;
    return parsed;
  }
}
