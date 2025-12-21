import { Page } from "playwright";
import { AssertionStrategy } from "../types";
import { TEST_IDS } from "../../constants";
import { parsePriceText } from "../../utils/price";

export class NumericPriceStrategy implements AssertionStrategy {
  name = "numeric-price";

  async check(page: Page): Promise<boolean> {
    const el = page.locator(`[data-testid='${TEST_IDS.CART_TOTAL_AMOUNT}']`);
    const text = await el.textContent();

    if (!text) return false;

    const parsed = parsePriceText(text);
    if (!parsed) return false;

    return parsed.value > 0;
  }
}
