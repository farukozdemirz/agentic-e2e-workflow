export type AssertionResult = {
  ok: boolean;
  strategy: string;
  strategyIndex: number;
  totalStrategies: number;
  details?: string;
  meta?: {
    attempts?: number;
    durationMs?: number;
  };
};
