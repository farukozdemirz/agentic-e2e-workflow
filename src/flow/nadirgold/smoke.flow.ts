import { FlowDefinition } from "../types";

export const nadirgoldSmokeFlow: FlowDefinition = {
  name: "nadirgold-smoke",
  version: "1.0.0",
  criticality: "blocking",
  intent: "Verify NadirGold homepage loads correctly",
  steps: [
    {
      type: "goto",
      path: "/",
    },
    {
      type: "assertVisible",
      selector: "header",
    },
    {
      type: "assertVisible",
      selector: "footer",
    },
  ],
};
