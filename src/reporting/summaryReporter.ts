import { writeFileSync } from "fs";
import { join } from "path";
import { Observation } from "../observation/types";
import { ReportingInput, RunSummary } from "./types";
import { computeFinalVerdict } from "./finalVerdict";

function countSignals(observations: Observation[]) {
  let consoleErrors = 0;
  let consoleWarnings = 0;
  let network4xx = 0;
  let network5xx = 0;
  let domSnapshots = 0;

  for (const obs of observations) {
    if (obs.type === "console") {
      if (obs.level === "error") consoleErrors++;
      if (obs.level === "warning") consoleWarnings++;
    }
    if (obs.type === "network") {
      if (obs.status >= 500) network5xx++;
      else if (obs.status >= 400) network4xx++;
    }
    if (obs.type === "dom") domSnapshots++;
  }

  return {
    consoleErrors,
    consoleWarnings,
    network4xx,
    network5xx,
    domSnapshots,
  };
}

export function writeSummaryJson(baseDir: string, input: ReportingInput) {
  const finalVerdict = computeFinalVerdict({
    execution: input.execution,
    reasoning: input.reasoning,
  });

  const summary: RunSummary = {
    runId: input.runId,
    environment: input.environment,
    flow: {
      name: input.flow.name,
      version: input.flow.version,
      criticality: input.flow.criticality,
    },
    execution: input.execution,
    reasoning: input.reasoning,
    finalVerdict,
    status: input.status,
    signals: countSignals(input.observations),
    createdAt: new Date().toISOString(),
  };

  writeFileSync(
    join(baseDir, "summary.json"),
    JSON.stringify(summary, null, 2)
  );
}
