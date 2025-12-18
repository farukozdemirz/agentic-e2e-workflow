import OpenAI from "openai";
import { LLMProvider } from "./LLMProvider";

export class OpenAIProvider implements LLMProvider {
  readonly name = "openai";
  private client: OpenAI;
  private model: string;

  constructor(options: { apiKey: string; model?: string }) {
    this.client = new OpenAI({
      apiKey: options.apiKey,
    });
    this.model = options.model ?? "gpt-4.1-mini";
  }

  async sendPrompt(input: {
    system?: string;
    prompt: string;
    temperature?: number;
  }) {
    const response = await this.client.chat.completions.create({
      model: this.model,
      temperature: input.temperature ?? 0.2,
      messages: [
        ...(input.system ? [{ role: "system" as const, content: input.system }] : []),
        { role: "user", content: input.prompt },
      ],
    });

    const choice = response.choices[0];

    return {
      content: choice.message?.content ?? "",
      usage: {
        inputTokens: response.usage?.prompt_tokens,
        outputTokens: response.usage?.completion_tokens,
        totalTokens: response.usage?.total_tokens,
      },
    };
  }

  estimateCost(usage: { inputTokens: number; outputTokens: number }) {
    // approx, değiştirilebilir
    const inputCost = usage.inputTokens * 0.0000005;
    const outputCost = usage.outputTokens * 0.0000015;
    return inputCost + outputCost;
  }
}
