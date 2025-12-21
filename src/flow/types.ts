import { STATES } from "../constants";

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

export type SemanticIntent =
  | "add-to-cart"
  | "go-to-cart"
  | "checkout"
  | "login"
  | "submit";

export type ClickStep = {
  type: "click";
  selector?: string;
  text?: string;
  intent?: SemanticIntent;
  fallbackSelectors?: string[];
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

export type WaitForApiStep = BaseStep & {
  type: "waitForApi";
  urlContains: string;
  status?: number;
  timeoutMs?: number;
};

export type WaitForVisibleStep = BaseStep & {
  type: "waitForVisible";
  selector: string;
  text?: string;
  timeoutMs?: number;
};

export type ConfirmAfterClickStep = {
  type: "confirmAfterClick";
  waitForStateReady?: string;
  expectApi?: {
    urlContains: string;
    status?: number;
    timeoutMs?: number;
  };
};

export type AssertionSeverity = "hard" | "soft";

export type AssertStateStep = {
  type: "assertState";
  state:
    | typeof STATES.CART_NOT_EMPTY
    | typeof STATES.QUICKCART_OPEN
    | typeof STATES.TOTAL_AMOUNT_POSITIVE;
  severity?: AssertionSeverity;
};

export type FlowStep =
  | GotoStep
  | ClickStep
  | AssertTextStep
  | AssertVisibleStep
  | WaitStep
  | WaitForApiStep
  | WaitForVisibleStep
  | ConfirmAfterClickStep
  | AssertStateStep;

export type FlowDefinition = {
  name: string;
  version: string;
  criticality: FlowCriticality;
  intent?: string;
  steps: FlowStep[];
};
