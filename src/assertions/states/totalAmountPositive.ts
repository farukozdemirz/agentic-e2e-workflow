import { Page } from "playwright";
import { parsePriceText } from "../../utils/price";
import { TEST_IDS } from "../../constants";

export async function assertTotalAmountPositive(page: Page) {
  const el = page.locator(`[data-testid='${TEST_IDS.CART_TOTAL_AMOUNT}']`);
  const text = await el.textContent();

  if (!text) {
    return { ok: false, strategy: "text", details: "Total amount not found" };
  }

  const parsed = parsePriceText(text);
  if (!parsed) {
    return { ok: false, strategy: "parser", details: "Price parse failed" };
  }

  return {
    ok: parsed.value > 0,
    strategy: "numeric",
    details: parsed.value <= 0 ? "Total amount is zero or negative" : undefined,
  };
}
