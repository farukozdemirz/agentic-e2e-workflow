import { Locator } from "playwright";

export type SemanticCandidate = {
  locator: Locator;
  text: string;
  score: number;
  reasons: string[];
};

export type SemanticResolutionResult = {
  selected: SemanticCandidate;
  candidates: SemanticCandidate[];
  confidence: number;
};
