import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { Page } from "playwright";
import { FlowStep } from "./types";

export async function writeStepArtifacts(
  page: Page,
  baseDir: string,
  step: FlowStep,
  index: number
) {
  const stepDir = join(
    baseDir,
    "steps",
    `${String(index + 1).padStart(2, "0")}-${step.type}`
  );

  mkdirSync(stepDir, { recursive: true });

  await page.screenshot({
    path: join(stepDir, "screenshot.png"),
    fullPage: true,
  });

  const meta = {
    step,
    url: page.url(),
    timestamp: new Date().toISOString(),
  };

  writeFileSync(join(stepDir, "meta.json"), JSON.stringify(meta, null, 2));
}
