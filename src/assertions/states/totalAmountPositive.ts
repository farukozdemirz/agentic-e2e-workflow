import { Page } from "playwright";
import { AssertionResolver } from "../resolvers/AssertionResolver";
import { TestIdStrategy } from "../strategies/TestIdStrategy";
import { NumericPriceStrategy } from "../strategies/NumericPriceStrategy";
import { TEST_IDS } from "../../constants";

export async function assertTotalAmountPositive(page: Page) {
  const resolver = new AssertionResolver([
    new TestIdStrategy(TEST_IDS.CART_TOTAL_AMOUNT, { visible: true }),
    new NumericPriceStrategy(),
  ]);

  return resolver.resolve(page);
}
