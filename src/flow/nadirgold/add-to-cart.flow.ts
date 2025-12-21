import { FlowDefinition } from "../types";

export const nadirgoldAddToCartFlow: FlowDefinition = {
  name: "nadirgold-add-to-cart",
  version: "1.0.0",
  criticality: "blocking",
  intent: "Verify product can be added to cart",
  steps: [
    {
      type: "goto",
      path: "/nadirgold-20-gr-kulce-altin-2",
    },
    {
      type: "click",
      intent: "add-to-cart",
    },
    {
      type: "confirmAfterClick",
      expectApi: {
        urlContains: "/basket/add",
        status: 200,
      },
      expectVisible: {
        selector: "a",
        text: "Sepete Git",
      },
    },
    { type: "assertState", state: "quickcart-open", severity: "hard" },
    { type: "assertState", state: "cart-not-empty", severity: "hard" },
    { type: "assertState", state: "total-amount-positive", severity: "soft" },
  ],
};
