import { TestIdStrategy } from "../strategies/TestIdStrategy";
import { SemanticStrategy } from "../strategies/SemanticStrategy";
import { TextStrategy } from "../strategies/TextStrategy";
import { Page } from "playwright";
import { AssertionResolver } from "../resolvers/AssertionResolver";
import { TEST_IDS } from "../../constants";

export async function assertQuickcartOpen(page: Page) {
  const resolver = new AssertionResolver([
    new TestIdStrategy(TEST_IDS.QUICKCART_CONTAINER, { visible: true }),
    new SemanticStrategy("link", "Sepete Git"),
    new TextStrategy("Sepetim"),
  ]);

  return resolver.resolve(page);
}
