import { AssertionResult } from "../resolvers/AssertionResult";

export function scoreAssertionConfidence(result: AssertionResult): number {
  if (!result.ok) return 0;

  let confidence = 1.0;

  const fallbacks = result.strategyIndex;
  confidence -= fallbacks * 0.1;

  if (result.meta?.attempts && result.meta.attempts > 1) {
    confidence -= 0.05;
  }

  if (result.meta?.durationMs && result.meta.durationMs > 3000) {
    confidence -= 0.05;
  }

  return Math.max(0.5, Number(confidence.toFixed(2)));
}
