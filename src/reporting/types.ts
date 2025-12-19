import { FlowDefinition } from "../flow/types";
import { Observation } from "../observation/types";
import { ReasoningResult } from "../reasoning/types";

export type RunSummary = {
  runId: string;
  flow: {
    name: string;
    version: string;
    criticality: string;
  };
  status: "completed" | "failed";
  reasoning: ReasoningResult;
  signals: {
    consoleErrors: number;
    consoleWarnings: number;
    network4xx: number;
    network5xx: number;
    domSnapshots: number;
  };
  createdAt: string;
};

export type ReportingInput = {
  runId: string;
  flow: FlowDefinition;
  status: "completed" | "failed";
  reasoning: ReasoningResult;
  observations: Observation[];
};
