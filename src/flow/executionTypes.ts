import { StepExecutionError } from "./errors";

export type ExecutionSummary = {
  ok: boolean;
  failedStep?: StepExecutionError;
};
