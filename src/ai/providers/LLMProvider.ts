export interface LLMProvider {
  readonly name: string;

  sendPrompt(input: {
    system?: string;
    prompt: string;
    temperature?: number;
  }): Promise<{
    content: string;
    usage?: {
      inputTokens?: number;
      outputTokens?: number;
      totalTokens?: number;
    };
  }>;

  estimateCost?(usage: { inputTokens: number; outputTokens: number }): number;
}
