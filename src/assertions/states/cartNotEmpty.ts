import { Page } from "playwright";
import { AssertionResolver } from "../resolvers/AssertionResolver";
import { TextStrategy } from "../strategies/TextStrategy";
import { TEST_IDS } from "../../constants";
import { AsyncTestIdStrategy } from "../strategies/AsyncTestIdStrategy";

export async function assertCartNotEmpty(page: Page) {
  const resolver = new AssertionResolver([
    new AsyncTestIdStrategy(TEST_IDS.CART_ITEM, {
      minCount: 1,
      timeoutMs: 8000,
    }),
    new TextStrategy("Sil"),
  ]);

  return resolver.resolve(page);
}
