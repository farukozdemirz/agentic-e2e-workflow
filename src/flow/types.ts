export type FlowCriticality = "blocking" | "warning" | "info";

type BaseStep = {
  type: string;
  intent?: string;
};

export type GotoStep = BaseStep & {
  type: "goto";
  url?: string;
  path?: string;
};

export type ClickStep = BaseStep & {
  type: "click";
  selector: string;
  text?: string;
};

export type AssertTextStep = BaseStep & {
  type: "assertText";
  text: string;
};

export type AssertVisibleStep = BaseStep & {
  type: "assertVisible";
  selector: string;
  text?: string;
};
export type WaitStep = BaseStep & {
  type: "wait";
  ms: number;
};

export type FlowStep =
  | GotoStep
  | ClickStep
  | AssertTextStep
  | AssertVisibleStep
  | WaitStep;

export type FlowDefinition = {
  name: string;
  version: string;
  criticality: FlowCriticality;
  intent?: string;
  steps: FlowStep[];
};
