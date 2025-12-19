import { writeFileSync } from "fs";
import { join } from "path";
import { Observation } from "../observation/types";

export function writeObservations(
  baseDir: string,
  observations: Observation[]
) {
  writeFileSync(
    join(baseDir, "observations.json"),
    JSON.stringify(observations, null, 2)
  );
}
