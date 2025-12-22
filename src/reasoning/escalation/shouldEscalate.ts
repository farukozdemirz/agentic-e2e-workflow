import { Assertion } from "../../observation/types";

export function shouldEscalate(input: {
  assertions: Assertion[];
  retryCount: number;
}): boolean {
  if (input.retryCount === 0) return false;

  const hardFail = input.assertions.some((a) => !a.ok && a.severity === "hard");
  if (hardFail) return false;

  const softFails = input.assertions.filter(
    (a) => !a.ok && a.severity === "soft"
  );

  return softFails.length > 0;
}
