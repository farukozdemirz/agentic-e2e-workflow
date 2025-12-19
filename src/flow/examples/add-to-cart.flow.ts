import { FlowDefinition } from "../types";

export const addToCartFlow: FlowDefinition = {
  name: "example-smoke",
  version: "1.0.0",
  criticality: "info",
  intent: "Verify that a static example page loads correctly for smoke testing",
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
