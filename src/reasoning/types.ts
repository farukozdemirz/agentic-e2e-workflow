export type ReasoningStatus = "ok" | "degraded" | "broken";

export type ReasoningResult = {
  status: ReasoningStatus;
  confidence: number;
  summary: string;
  rootCauseHypotheses: string[];
  suggestedActions: string[];
};
