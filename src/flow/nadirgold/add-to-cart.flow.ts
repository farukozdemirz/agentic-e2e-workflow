import { STATES } from "../../constants";
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
      intent: "add-to-cart",
    },
    {
      type: "confirmAfterClick",
      expectApi: {
        urlContains: "/basket/add",
        status: 200,
      },
    },
    { type: "assertState", state: STATES.QUICKCART_OPEN, severity: "hard" },
    { type: "assertState", state: STATES.CART_NOT_EMPTY, severity: "hard" },
    {
      type: "assertState",
      state: STATES.TOTAL_AMOUNT_POSITIVE,
      severity: "soft",
    },
  ],
};
