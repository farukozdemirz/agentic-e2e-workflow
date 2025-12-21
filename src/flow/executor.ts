import { Page } from "playwright";
import { ConfirmAfterClickStep, FlowStep, WaitStep } from "./types";
import { writeStepArtifacts } from "./artifacts";
import { ObservationAgent } from "../observation/ObservationAgent";
import { getBaseUrl } from "../config/environment";
import { StepExecutionError } from "./errors";
import { resolveSemanticClick } from "../interaction/resolveSemanticClick";
import { logger } from "../infra/logger";
import { resolveState } from "../assertions/states/StateRegistry";
import { scoreAssertionConfidence } from "../assertions/scoring/scoreAssertionConfidence";

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
        if (step.intent) {
          const resolution = await resolveSemanticClick(page, step.intent);

          logger.debug("Semantic click resolution", {
            intent: step.intent,
            selected: resolution.selected.text,
            confidence: resolution.confidence,
            reasons: resolution.selected.reasons,
          });

          await resolution.selected.locator.click();
          break;
        }

        if (step.selector && step.text) {
          await page
            .locator(step.selector)
            .filter({ hasText: step.text })
            .first()
            .click();
          break;
        }

      case "confirmAfterClick": {
        const typedStep = step as ConfirmAfterClickStep;

        if (typedStep.expectApi) {
          await page.waitForResponse(
            (res) => {
              if (!res.url().includes(typedStep.expectApi!.urlContains)) {
                return false;
              }
              if (
                typedStep.expectApi!.status &&
                res.status() !== typedStep.expectApi!.status
              ) {
                return false;
              }
              return true;
            },
            {
              timeout: typedStep.expectApi.timeoutMs ?? 10000,
            }
          );
        }
        // if (typedStep.waitForStateReady) {
        //   const stateHandler = resolveState(typedStep.waitForStateReady);

        //   if (!stateHandler) {
        //     throw new StepExecutionError({
        //       stepIndex: index,
        //       stepType: step.type,
        //       message: `Unknown state: ${typedStep.waitForStateReady}`,
        //     });
        //   }

        //   const timeout = typedStep.expectApi?.timeoutMs ?? 8000;
        //   const start = Date.now();
        //   let lastResult: AssertionResult | null = null;

        //   while (Date.now() - start < timeout) {
        //     lastResult = await stateHandler(page);

        //     if (lastResult.ok) {
        //       break;
        //     }

        //     await page.waitForTimeout(200);
        //   }

        //   if (!lastResult?.ok) {
        //     throw new StepExecutionError({
        //       stepIndex: index,
        //       stepType: step.type,
        //       message: `State did not become ready: ${typedStep.waitForStateReady}`,
        //     });
        //   }
        // }

        break;
      }
      case "assertText": {
        const content = await page.content();
        if (!content.includes(step?.text ?? "")) {
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
      case "assertState": {
        const handler = resolveState(step.state);

        if (!handler) {
          throw new Error(`Unknown assertion state: ${step.state}`);
        }

        const result = await handler(page);
        if (!result.ok) {
          if (step.severity === "hard") {
            throw new StepExecutionError({
              stepIndex: index,
              stepType: step.type,
              message: `State assertion failed: ${step.state} (${result.details})`,
            });
          } else {
            observationAgent.recordWarning({
              code: "ASSERT_STATE_SOFT_FAIL",
              message: `State assertion failed (soft): ${step.state}`,
              meta: { state: step.state, details: result.details },
            });
          }
        }

        observationAgent.recordAssertion({
          state: step.state,
          confidence: scoreAssertionConfidence(result),
          ...result,
        });

        break;
      }
      case "wait":
        await page.waitForTimeout((step as WaitStep)?.ms ?? 1000);
        break;
    }

    await observationAgent.captureDom(page);
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
