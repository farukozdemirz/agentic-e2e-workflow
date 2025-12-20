export type StepExecutionError = {
  stepIndex: number;
  stepType: string;
  message: string;
  name?: string;
  stack?: string;
};

export type ExecutionSummary = {
  ok: boolean;
  failedStep?: StepExecutionError;
};
