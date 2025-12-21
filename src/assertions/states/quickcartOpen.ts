import { SemanticStrategy } from "../strategies/SemanticStrategy";
import { TextStrategy } from "../strategies/TextStrategy";
import { Page } from "playwright";
import { AssertionResolver } from "../resolvers/AssertionResolver";
import { TEST_IDS } from "../../constants";
import { AsyncTestIdStrategy } from "../strategies/AsyncTestIdStrategy";

export async function assertQuickcartOpen(page: Page) {
  const resolver = new AssertionResolver([
    new AsyncTestIdStrategy(TEST_IDS.QUICKCART_CONTAINER, {
      visible: true,
      timeoutMs: 8000,
    }),
    new SemanticStrategy("link", "Sepete Git"),
    new TextStrategy("Sepetim"),
  ]);

  return resolver.resolve(page);
}
