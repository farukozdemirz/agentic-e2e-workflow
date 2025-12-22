import { buildEscalationPrompt } from "./buildEscalationPrompt";
import { FlowDefinition } from "../../flow/types";
import { LLMProvider } from "../../ai/providers/LLMProvider";
import { Assertion } from "../../observation/types";

export class EscalationAgent {
  constructor(private llm: LLMProvider) {}

  async evaluate(input: { flow: FlowDefinition; assertions: Assertion[] }) {
    const prompt = buildEscalationPrompt(input);

    const res = await this.llm.sendPrompt({
      system: "You resolve ambiguous E2E test failures conservatively.",
      prompt,
      temperature: 0.1,
    });

    return JSON.parse(res.content);
  }
}
