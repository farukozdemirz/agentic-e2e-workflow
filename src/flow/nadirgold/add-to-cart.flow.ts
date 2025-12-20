import { FlowDefinition } from "../types";

export const nadirgoldAddToCartFlow: FlowDefinition = {
  name: "nadirgold-add-to-cart",
  version: "1.0.0",
  criticality: "blocking",
  intent: "Verify product can be added to cart",
  steps: [
    {
      type: "goto",
      path: "/nadirgold-1-gr-kulce-altin",
    },
    {
      type: "click",
      selector: "button",
      text: "Sepete Ekle",
    },
    {
      type: "assertVisible",
      selector: "button",
      text: "Sepete Git",
    },
  ],
};
