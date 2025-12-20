import { mkdirSync } from "fs";
import { join } from "path";
import { randomUUID } from "crypto";
import { Environment, getEnvironment } from "../config/environment";

export type FlowRunContext = {
  runId: string;
  baseDir: string;
  attempts: number;
  environment: Environment;
};

export function createRunContext(): FlowRunContext {
  const runId = randomUUID();
  const baseDir = join(process.cwd(), "artifacts", "runs", runId);

  mkdirSync(join(baseDir, "steps"), { recursive: true });

  return {
    runId,
    baseDir,
    environment: getEnvironment(),
    attempts: 1,
  };
}
