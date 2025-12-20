export class StepExecutionError extends Error {
  readonly stepIndex: number;
  readonly stepType: string;
  readonly originalError?: Error;

  constructor(input: {
    stepIndex: number;
    stepType: string;
    message: string;
    originalError?: Error;
  }) {
    super(input.message);
    this.name = "StepExecutionError";
    this.stepIndex = input.stepIndex;
    this.stepType = input.stepType;
    this.originalError = input.originalError;
  }
}
