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

export type DomSnapshot = {
  type: "dom";
  html: string;
};

export type Observation = ConsoleError | NetworkError | DomSnapshot;
