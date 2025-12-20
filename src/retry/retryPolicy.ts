import { ReasoningResult } from "../reasoning/types";
import { Observation } from "../observation/types";
import { RetryDecision } from "./types";

export function decideRetry(input: {
  reasoning: ReasoningResult;
  observations: Observation[];
}): RetryDecision {
  const { reasoning, observations } = input;

  // ❌ Auth / permission
  if (
    observations.some(
      (o) => o.type === "network" && [401, 403].includes(o.status)
    )
  ) {
    return { retry: false, reason: "Auth or permission failure" };
  }

  // ❌ Hard broken
  if (reasoning.status === "broken" && reasoning.confidence > 0.9) {
    return { retry: false, reason: "High confidence broken state" };
  }

  // ⚠️ Degraded → retry
  if (reasoning.status === "degraded") {
    return {
      retry: true,
      strategy: "simple",
      reason: "Degraded state detected",
    };
  }

  return { retry: false, reason: "No retry needed" };
}
