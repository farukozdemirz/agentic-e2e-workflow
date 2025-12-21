import { Page } from "playwright";
import { AssertionResult } from "../resolvers/AssertionResult";

export type StateAssertionHandler = (page: Page) => Promise<AssertionResult>;

const registry: Record<string, StateAssertionHandler> = {};

export function registerState(state: string, handler: StateAssertionHandler) {
  if (registry[state]) {
    throw new Error(`Assertion state already registered: ${state}`);
  }
  registry[state] = handler;
}

export function resolveState(state: string): StateAssertionHandler | undefined {
  return registry[state];
}
