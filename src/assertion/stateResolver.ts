import { Locator, Page } from "playwright";
import { AssertStateStep } from "../flow/types";
import { parsePriceText } from "../utils/price";

async function parseAmount(el: Locator) {
  const text = (await el.textContent())?.trim() ?? "";
  const parsed = parsePriceText(text);

  if (!parsed) {
    return { ok: false, details: `Price parse failed: "${text}"` };
  }

  if (parsed.value <= 0) {
    return {
      ok: false,
      details: `Amount must be positive (${parsed.value})`,
    };
  }

  return {
    ok: true,
    value: parsed.value,
    unit: parsed.unit,
  };
}

const resolveTotalAmountPositive = async (page: Page) => {
  const testIdEl = page.locator('[data-testid="cart-total-amount"]');

  if (await testIdEl.count()) {
    return parseAmount(testIdEl);
  }

  const label = page.locator("span", { hasText: "Toplam" });

  if (!(await label.count())) {
    return { ok: false, details: "Total label not found" };
  }
};

export async function resolveState(
  page: Page,
  state: AssertStateStep["state"]
): Promise<{ ok: boolean; details?: string }> {
  switch (state) {
    case "quickcart-open": {
      const drawer = page.locator(".quick-cart-container");

      const count = await drawer.count();

      if (count === 0) {
        return { ok: false, details: "QuickCart container not found in DOM" };
      }

      const isOpen = await drawer.evaluate((el) => {
        return el.classList.contains("translate-x-0");
      });

      return isOpen
        ? { ok: true }
        : { ok: false, details: "QuickCart drawer exists but is not open" };
    }

    case "cart-not-empty": {
      const emptyText = page.getByText("SEPETİNİZDE ÜRÜN");
      const isEmptyVisible = await emptyText.isVisible().catch(() => false);
      return !isEmptyVisible
        ? { ok: true }
        : { ok: false, details: "Cart appears empty" };
    }

    case "total-amount-positive": {
      const result = await resolveTotalAmountPositive(page);
      if (result === undefined) {
        return {
          ok: false,
          details: "Unable to resolve total amount positivity",
        };
      }
      return result;
    }

    default:
      return { ok: false, details: `Unknown state: ${state}` };
  }
}
