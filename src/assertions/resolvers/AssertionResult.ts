export type AssertionResult = {
  ok: boolean;
  strategy: string;
  details?: string;
  meta?: {
    attempts?: number;
    durationMs?: number;
  };
};
