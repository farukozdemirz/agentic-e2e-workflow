import { writeFileSync } from "fs";
import { join } from "path";
import { FlowDefinition } from "./types";

export function writeFlowMeta(
  baseDir: string,
  flow: FlowDefinition,
  status: "completed" | "failed"
) {
  const meta = {
    flow: {
      name: flow.name,
      version: flow.version,
      criticality: flow.criticality,
    },
    status,
    finishedAt: new Date().toISOString(),
  };

  writeFileSync(join(baseDir, "flow.json"), JSON.stringify(meta, null, 2));
}
