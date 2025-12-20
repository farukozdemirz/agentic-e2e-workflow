import { ExecutionSummary } from "../flow/executionTypes";
import { ReasoningStatus } from "../reasoning/types";


export type FinalVerdictStatus = "ok" | "degraded" | "failed";
export type FinalVerdict = {
  finalStatus: FinalVerdictStatus;
  reason: string;
};

export function computeFinalVerdict(input: {
  execution: ExecutionSummary;
  reasoning: { status: ReasoningStatus, confidence: number };
}): FinalVerdict {
  if (!input.execution.ok) {
    return { finalStatus: "failed", reason: "Execution failed" };
  }

  if (input.reasoning.status === "broken") {
    return {
      finalStatus: "failed",
      reason: "Reasoning indicates broken state",
    };
  }

  if (input.reasoning.status === "degraded") {
    return {
      finalStatus: "degraded",
      reason: "Reasoning indicates degraded state",
    };
  }

  return { finalStatus: "ok", reason: "Execution succeeded and reasoning ok" };
}
