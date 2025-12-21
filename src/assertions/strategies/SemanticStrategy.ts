import { AssertionStrategy } from "../types";
import { Page } from "playwright";

export class SemanticStrategy implements AssertionStrategy {
  name = "semantic";

  constructor(
    private role: "button" | "link",
    private text: string
  ) {}

  async check(page: Page): Promise<boolean> {
    const el = page.getByRole(this.role, { name: this.text });
    return await el.isVisible();
  }
}
