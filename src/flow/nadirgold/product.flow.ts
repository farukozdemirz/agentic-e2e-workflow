import { FlowDefinition } from "../types";

export const nadirgoldProductFlow: FlowDefinition = {
  name: "nadirgold-product",
  version: "1.0.0",
  criticality: "blocking",
  intent: "Verify product detail page renders correctly",
  steps: [
    {
      type: "goto",
      path: "/nadirgold-1-gr-kulce-altin",
    },
    {
      type: "assertVisible",
      selector: '[class*="product-price-box"]',
    },
    {
      type: "assertVisible",
      selector: "button",
      text: "Sepete Ekle",
    },
  ],
};
