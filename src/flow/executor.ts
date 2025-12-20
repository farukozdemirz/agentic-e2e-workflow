import { Page } from "playwright";
import { FlowStep } from "./types";
import { writeStepArtifacts } from "./artifacts";
import { ObservationAgent } from "../observation/ObservationAgent";
import { getBaseUrl } from "../config/environment";
import { StepExecutionError } from "./errors";

export async function executeStepWithArtifacts(
  page: Page,
  baseDir: string,
  step: FlowStep,
  index: number,
  observationAgent: ObservationAgent
) {
  try {
    // Step execute
    switch (step.type) {
      case "goto":
        //prettier-ignore
        const targetUrl = step.url ?? (step.path ? `${getBaseUrl()}${step.path}` : null);

        if (!targetUrl) {
          throw new Error("Goto step requires either url or path");
        }

        await page.goto(targetUrl, { waitUntil: "networkidle" });
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
  } catch (error: any) {
    throw new StepExecutionError({
      stepIndex: index,
      stepType: step.type,
      message: error?.message ?? "Step execution failed",
      originalError: error instanceof Error ? error : undefined,
    });
  }
}
