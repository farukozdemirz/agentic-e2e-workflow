import { Page } from "playwright";
import { AssertionResolver } from "../resolvers/AssertionResolver";
import { TestIdStrategy } from "../strategies/TestIdStrategy";
import { TextStrategy } from "../strategies/TextStrategy";
import { TEST_IDS } from "../../constants";

export async function assertCartNotEmpty(page: Page) {
  const resolver = new AssertionResolver([
    new TestIdStrategy(TEST_IDS.CART_ITEM, { minCount: 1 }),
    new TextStrategy("Sil"),
  ]);

  return resolver.resolve(page);
}
