import { Page } from "playwright";
import { FlowStep } from "./types";
import { writeStepArtifacts } from "./artifacts";
import { ObservationAgent } from "../observation/ObservationAgent";

export async function executeStepWithArtifacts(
  page: Page,
  baseDir: string,
  step: FlowStep,
  index: number,
  observationAgent: ObservationAgent
) {
  // Step execute
  switch (step.type) {
    case "goto":
      await page.goto(step.url, { waitUntil: "networkidle" });
      break;
    case "click":
      await page.click(step.selector);
      break;
    case "assertText": {
      const content = await page.content();
      if (!content.includes(step.text)) {
        throw new Error(`Assertion failed: "${step.text}" not found`);
      }
      break;
    }
    case "wait":
      await page.waitForTimeout(step.ms);
      break;
  }

  // DOM snapshot
  await observationAgent.captureDom(page);
  // Artifact write
  await writeStepArtifacts(page, baseDir, step, index);
}
