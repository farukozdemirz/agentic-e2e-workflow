import { chromium, Browser, Page } from "playwright";
import { BrowserOptions } from "./types";

export class BrowserManager {
  private browser?: Browser;

  async launch(options: BrowserOptions): Promise<Page> {
    this.browser = await chromium.launch({
      headless: options.headless,
      slowMo: options.slowMo,
    });

    const context = await this.browser.newContext({
      viewport: options.viewport ?? { width: 1280, height: 800 },
    });

    return context.newPage();
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}
