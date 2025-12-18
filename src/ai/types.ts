export enum MessageRole {
  SYSTEM = "system",
  USER = "user",
  ASSISTANT = "assistant",
}

export enum ReasoningStatus {
  OK = "ok",
  DEGRADED = "degraded",
  BROKEN = "broken",
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
