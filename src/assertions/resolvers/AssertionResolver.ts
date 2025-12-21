import { Page } from "playwright";
import { AssertionStrategy } from "../types";
import { AssertionResult } from "./AssertionResult";

export class AssertionResolver {
  constructor(private strategies: AssertionStrategy[]) {}

  async resolve(page: Page): Promise<AssertionResult> {
    for (const strategy of this.strategies) {
      try {
        const ok = await strategy.check(page);
        if (ok) {
          return { ok: true, strategy: strategy.name };
        }
      } catch (err) {
        console.error(`Strategy ${strategy.name} failed`, err);
      }
    }

    return {
      ok: false,
      strategy: "none",
      details: "All assertion strategies failed",
    };
  }
}
