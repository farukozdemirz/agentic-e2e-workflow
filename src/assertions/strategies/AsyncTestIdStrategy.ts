import { Page } from "playwright";
import { AssertionStrategy } from "../types";

type Options = {
  minCount?: number;
  visible?: boolean;
  timeoutMs?: number;
  intervalMs?: number;
};

export class AsyncTestIdStrategy implements AssertionStrategy {
  name = "test-id-async";

  private lastMeta?: {
    attempts: number;
    durationMs: number;
  };

  constructor(
    private testId: string,
    private options: Options = {}
  ) {}

  async check(page: Page): Promise<boolean> {
    const {
      minCount,
      visible = true,
      timeoutMs = 8000,
      intervalMs = 200,
    } = this.options;

    const locator = page.locator(`[data-testid="${this.testId}"]`);

    const startedAt = Date.now();
    let attempts = 0;

    while (Date.now() - startedAt < timeoutMs) {
      attempts++;

      if (minCount !== undefined) {
        const count = await locator.count();
        if (count >= minCount) {
          this.captureMeta(attempts, startedAt);
          return true;
        }
      } else if (visible !== false) {
        if (await locator.first().isVisible()) {
          this.captureMeta(attempts, startedAt);
          return true;
        }
      } else {
        if ((await locator.count()) > 0) {
          this.captureMeta(attempts, startedAt);
          return true;
        }
      }

      await page.waitForTimeout(intervalMs);
    }

    this.captureMeta(attempts, startedAt);
    return false;
  }

  getMeta(): { attempts?: number; durationMs?: number } {
    return this.lastMeta ?? {};
  }

  private captureMeta(attempts: number, startedAt: number) {
    this.lastMeta = {
      attempts,
      durationMs: Date.now() - startedAt,
    };
  }
}
