import { Page } from "playwright";
import { AssertionStrategy } from "../types";
import { AssertionResult } from "./AssertionResult";

export class AssertionResolver {
  constructor(private strategies: AssertionStrategy[]) {}

  async resolve(page: Page): Promise<AssertionResult> {
    const total = this.strategies.length;

    for (let i = 0; i < total; i++) {
      const strategy = this.strategies[i];
      const ok = await strategy.check(page);

      if (ok) {
        return {
          ok: true,
          strategy: strategy.name,
          strategyIndex: i,
          totalStrategies: total,
          ...(strategy?.getMeta && { meta: strategy.getMeta?.() }),
        };
      }
    }

    return {
      ok: false,
      strategy: "none",
      strategyIndex: total,
      totalStrategies: total,
      details: `Failed strategies: ${this.strategies.map((strategy) => strategy.name).join(", ")}`,
    };
  }
}
