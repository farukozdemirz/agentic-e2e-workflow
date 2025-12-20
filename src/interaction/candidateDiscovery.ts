import { Page } from "playwright";

export async function discoverClickableCandidates(page: Page) {
  return page.locator("button, a, [role=button]").filter({
    hasNot: page.locator("[aria-hidden=true]"),
  });
}
