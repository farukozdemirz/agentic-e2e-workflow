import { FlowDefinition } from "../types";

export const nadirgoldAddToCartFlow: FlowDefinition = {
  name: "nadirgold-add-to-cart",
  version: "1.0.0",
  criticality: "blocking",
  intent: "Verify product can be added to cart",
  steps: [
    {
      type: "goto",
      path: "/nadirgold-100-gr-gumus-kulce",
    },
    {
      type: "click",
      intent: "add-to-cart",
    },
    {
      type: "waitForApi",
      urlContains: "/basket/add",
      status: 200,
    },
    {
      type: "waitForVisible",
      selector: "a",
      text: "Sepete Git",
    },
  ],
};
