import { Page } from "playwright";
import { Observation } from "./types";

export class ObservationAgent {
  private observations: Observation[] = [];

  attach(page: Page) {
    page.on("console", (msg) => {
      if (msg.type() === "error" || msg.type() === "warning") {
        this.observations.push({
          type: "console",
          level: msg.type() as "error" | "warning",
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
    const html = await page.content();
    this.observations.push({
      type: "dom",
      html: html.slice(0, 5000),
    });
  }

  getObservations() {
    return this.observations;
  }
}
