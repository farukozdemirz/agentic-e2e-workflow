import { Page } from "playwright";

export async function simpleRetry(page: Page) {
  await page.reload({ waitUntil: "networkidle" });
}
