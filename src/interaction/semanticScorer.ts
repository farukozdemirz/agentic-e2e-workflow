import { SemanticIntent } from "../flow/types";

export function scoreCandidate(
  intent: SemanticIntent,
  text: string,
  context: {
    isVisible: boolean;
    isEnabled: boolean;
    inMainArea: boolean;
  }
): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  if (context.isVisible) {
    score += 2;
    reasons.push("visible");
  }

  if (context.isEnabled) {
    score += 2;
    reasons.push("enabled");
  }

  if (context.inMainArea) {
    score += 1;
    reasons.push("main-area");
  }

  const intentKeywords: Record<SemanticIntent, string[]> = {
    "add-to-cart": ["sepete ekle", "add to cart"],
    "go-to-cart": ["sepete git", "view cart"],
    checkout: ["ödeme", "checkout"],
    login: ["giriş", "login"],
    submit: ["gönder", "submit"],
  };

  if (intentKeywords[intent]?.some((k) => text.toLowerCase().includes(k))) {
    score += 5;
    reasons.push("intent-text-match");
  }

  return { score, reasons };
}
