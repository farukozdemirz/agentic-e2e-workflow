import { Page } from "playwright";

export interface AssertionStrategy {
  name: string;
  check(page: Page): Promise<boolean>;
}
