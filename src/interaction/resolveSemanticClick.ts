import { Page } from "playwright";
import { SemanticIntent } from "../flow/types";
import {
  SemanticCandidate,
  SemanticResolutionResult,
} from "./semanticClickResolver";
import { discoverClickableCandidates } from "./candidateDiscovery";
import { scoreCandidate } from "./semanticScorer";

export async function resolveSemanticClick(
  page: Page,
  intent: SemanticIntent
): Promise<SemanticResolutionResult> {
  const locator = await discoverClickableCandidates(page);
  const count = await locator.count();

  const candidates: SemanticCandidate[] = [];

  for (let i = 0; i < count; i++) {
    const el = locator.nth(i);
    const text = (await el.innerText()).trim();
    if (!text) continue;

    const box = await el.boundingBox();
    if (!box) continue;

    const context = {
      isVisible: await el.isVisible(),
      isEnabled: await el.isEnabled(),
      inMainArea: box.x > 200,
    };

    const { score, reasons } = scoreCandidate(intent, text, context);

    if (score > 0) {
      candidates.push({ locator: el, text, score, reasons });
    }
  }

  candidates.sort((a, b) => b.score - a.score);

  if (!candidates.length) {
    throw new Error(`No semantic click candidate found for intent: ${intent}`);
  }

  return {
    selected: candidates[0],
    candidates,
    confidence: Math.min(1, candidates[0].score / 10),
  };
}
