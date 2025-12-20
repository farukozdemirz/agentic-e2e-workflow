import { FlowDefinition } from "./types";
import { addToCartFlow } from "./examples/add-to-cart.flow";
import { nadirgoldProductFlow } from "./nadirgold/product.flow";
import { nadirgoldAddToCartFlow } from "./nadirgold/add-to-cart.flow";
import { nadirgoldSmokeFlow } from "./nadirgold/smoke.flow";

const flows: Record<string, FlowDefinition> = {
  [addToCartFlow.name]: addToCartFlow,
  [nadirgoldSmokeFlow.name]: nadirgoldSmokeFlow,
  [nadirgoldProductFlow.name]: nadirgoldProductFlow,
  [nadirgoldAddToCartFlow.name]: nadirgoldAddToCartFlow,
};

export function getFlow(name: string): FlowDefinition {
  const flow = flows[name];

  if (!flow) {
    throw new Error(`Flow not found: ${name}`);
  }
  return flow;
}
