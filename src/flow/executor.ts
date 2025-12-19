import { Page } from "playwright";
import { FlowStep } from "./types";

export async function executeStep(page: Page, step: FlowStep) {
  switch (step.type) {
    case "goto":
      await page.goto(step.url, { waitUntil: "networkidle" });
      break;

    case "click":
      await page.click(step.selector);
      break;

    case "assertText":
      const content = await page.content();
      if (!content.includes(step.text)) {
        throw new Error(`Assertion failed: "${step.text}" not found`);
      }
      break;

    case "wait":
      await page.waitForTimeout(step.ms);
      break;
  }
}
