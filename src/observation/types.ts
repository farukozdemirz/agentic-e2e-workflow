export type ConsoleError = {
  type: "console";
  level: "error" | "warning";
  message: string;
};

export type NetworkError = {
  type: "network";
  url: string;
  status: number;
};

export type ApiWait = {
  type: "api-wait";
  url: string;
  status: number;
  durationMs: number;
};

export type DomSnapshot = {
  type: "dom";
  snapshot: {
    header: string | null;
    footer: string | null;
    main: string | null;
    appRoot: string | null;
    title: string;
    url: string;
  };
};

export type RecordWarning = {
  type: "warning";
  code: string;
  message: string;
  meta?: Record<string, unknown>;
};

export type Observation =
  | ConsoleError
  | NetworkError
  | DomSnapshot
  | ApiWait
  | RecordWarning;
