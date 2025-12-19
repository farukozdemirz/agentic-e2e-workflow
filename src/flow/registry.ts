import { FlowDefinition } from "./types";
import { addToCartFlow } from "./examples/add-to-cart.flow";

const flows: Record<string, FlowDefinition> = {
  [addToCartFlow.name]: addToCartFlow,
};

export function getFlow(name: string): FlowDefinition {
  const flow = flows[name];
  console.log({ getFlow: name });
  if (!flow) {
    throw new Error(`Flow not found: ${name}`);
  }
  return flow;
}
