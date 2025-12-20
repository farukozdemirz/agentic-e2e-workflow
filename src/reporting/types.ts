import { Environment } from "../config/environment";
import { ExecutionSummary } from "../flow/executionTypes";
import { FlowDefinition } from "../flow/types";
import { Observation } from "../observation/types";
import { ReasoningResult } from "../reasoning/types";
import { FinalVerdict } from "./finalVerdict";

export type RunSummary = {
  runId: string;
  flow: {
    name: string;
    version: string;
    criticality: string;
  };
  status: "completed" | "failed";
  reasoning: ReasoningResult;
  finalVerdict: FinalVerdict;
  execution: ExecutionSummary;
  signals: {
    consoleErrors: number;
    consoleWarnings: number;
    network4xx: number;
    network5xx: number;
    domSnapshots: number;
  };
  createdAt: string;
  environment?: Environment;
};

export type ReportingInput = {
  runId: string;
  flow: FlowDefinition;
  status: "completed" | "failed";
  reasoning: ReasoningResult;
  execution: ExecutionSummary;
  observations: Observation[];
  environment?: Environment;
};
