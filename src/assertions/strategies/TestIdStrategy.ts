import { Page } from "playwright";
import { AssertionStrategy } from "../types";

export class TestIdStrategy implements AssertionStrategy {
  name = "test-id";

  constructor(
    private testId: string,
    private options?: {
      minCount?: number;
      visible?: boolean;
    }
  ) {}

  async check(page: Page): Promise<boolean> {
    const locator = page.locator(`[data-testid="${this.testId}"]`);

    if (this.options?.minCount !== undefined) {
      const count = await locator.count();
      return count >= this.options.minCount;
    }

    if (this.options?.visible !== false) {
      return await locator.first().isVisible();
    }

    return true;
  }
}
