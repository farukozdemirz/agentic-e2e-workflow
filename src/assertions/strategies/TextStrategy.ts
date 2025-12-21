import { AssertionStrategy } from "../types";
import { Page } from "playwright";

export class TextStrategy implements AssertionStrategy {
  name = "text";

  constructor(private text: string) {}

  async check(page: Page): Promise<boolean> {
    const el = page.getByText(this.text, { exact: false });
    return await el.first().isVisible();
  }
}
