import { FlowDefinition } from "../types";

export const addToCartFlow: FlowDefinition = {
  name: "add-to-cart",
  version: "1.0.0",
  criticality: "blocking",
  steps: [
    {
      type: "goto",
      url: "https://example.com",
    },
    {
      type: "assertText",
      text: "Example Domain",
    },
  ],
};
