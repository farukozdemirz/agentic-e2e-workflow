import { ReasoningStatus } from "../reasoning/types";

export enum MessageRole {
  SYSTEM = "system",
  USER = "user",
  ASSISTANT = "assistant",
}

export type LLMMessage = {
  role: MessageRole;
  content: string;
};

export type LLMReasoningResult = {
  status: ReasoningStatus;
  reason: string;
  confidence: number;
};
