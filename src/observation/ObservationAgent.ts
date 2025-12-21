import { Page } from "playwright";
import { Observation } from "./types";

export class ObservationAgent {
  private observations: Observation[] = [];

  attach(page: Page) {
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        this.observations.push({
          type: "console",
          level: msg.type() as "error",
          message: msg.text(),
        });
      }
    });

    page.on("response", (res) => {
      const status = res.status();
      if (status >= 400) {
        this.observations.push({
          type: "network",
          url: res.url(),
          status,
        });
      }
    });
  }

  async captureDom(page: Page) {
    const snapshot = await page.evaluate(() => {
      const pick = (el: Element | null, limit = 3000) =>
        el ? el.outerHTML.slice(0, limit) : null;

      const appRoot =
        document.querySelector("#root") ||
        document.querySelector("#__next") ||
        document.querySelector("main") ||
        document.body;

      return {
        header: pick(document.querySelector("header")),
        footer: pick(document.querySelector("footer")),
        main: pick(document.querySelector("main")),
        appRoot: pick(appRoot, 4000),
        title: document.title,
        url: location.href,
      };
    });

    this.observations.push({
      type: "dom",
      snapshot,
    });
  }

  recordApiWait(info: { url: string; status: number; durationMs: number }) {
    this.observations.push({
      type: "api-wait",
      url: info.url,
      status: info.status,
      durationMs: info.durationMs,
    });
  }

  recordWarning(input: {
    code: string;
    message: string;
    meta?: Record<string, unknown>;
  }) {
    this.observations.push({
      type: "warning",
      code: input.code,
      message: input.message,
      meta: input.meta,
    });
  }
  getObservations() {
    return this.observations;
  }
  reset() {
    this.observations = [];
  }
}
