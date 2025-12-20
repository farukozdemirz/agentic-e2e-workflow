export type FlowCriticality = "blocking" | "warning" | "info";

export type FlowStep =
  | {
      type: "goto";
      url: string;
      path?: string;
    }
  | {
      type: "click";
      selector: string;
      intent?: string;
    }
  | {
      type: "assertText";
      text: string;
    }
  | {
      type: "wait";
      ms: number;
    };

export type FlowDefinition = {
  name: string;
  version: string;
  criticality: FlowCriticality;
  intent?: string;
  steps: FlowStep[];
};
