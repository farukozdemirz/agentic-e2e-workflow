import { OpenAIProvider } from "./providers/OpenAIProvider";
import { LLMProvider } from "./providers/LLMProvider";

export function createLLMProvider(): LLMProvider {
  const provider = process.env.LLM_PROVIDER ?? "openai";

  if (provider === "openai") {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not set");
    }

    return new OpenAIProvider({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  throw new Error(`Unknown LLM provider: ${provider}`);
}
