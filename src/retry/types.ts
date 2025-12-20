export type RetryDecision =
  | { retry: false; reason: string }
  | {
      retry: true;
      strategy: "simple" | "selector-heal";
      reason: string;
    };
