import { writeFileSync } from "fs";
import { join } from "path";
import { ReasoningResult } from "./types";

export function writeReasoning(baseDir: string, result: ReasoningResult) {
  writeFileSync(
    join(baseDir, "reasoning.json"),
    JSON.stringify(result, null, 2)
  );
}
