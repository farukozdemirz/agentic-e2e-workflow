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
        let locator = page.locator(step.selector);

        if (step.text) {
          locator = locator.filter({ hasText: step.text });
        }

        await locator.first().click();
        break;
      case "assertText": {
        const content = await page.content();
        if (!content.includes(step.text)) {
          throw new Error(`Assertion failed: "${step.text}" not found`);
        }
        break;
      }
      case "waitForVisible":
        let waitedLocator = page.locator(step.selector);
        if (step.text) {
          waitedLocator = waitedLocator.filter({ hasText: step.text });
        }
        await waitedLocator
          .first()
          .waitFor({ state: "visible", timeout: step.timeoutMs ?? 10000 });
        break;
      case "waitForApi":
        const startedAt = Date.now();

        const response = await page.waitForResponse(
          (res) => {
            if (!res.url().includes(step.urlContains)) return false;
            if (step.status && res.status() !== step.status) return false;
            return true;
          },
          { timeout: step.timeoutMs ?? 10000 }
        );

        const elapsed = Date.now() - startedAt;

        observationAgent.recordApiWait({
          url: response.url(),
          status: response.status(),
          durationMs: elapsed,
        });
        break;
      case "wait":
        await page.waitForTimeout(step.ms);
        break;
    }

    // DOM snapshot
    await observationAgent.captureDom(page);
    // Artifact write

    // await page.waitForTimeout(500);
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
