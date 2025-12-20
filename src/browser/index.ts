import { BrowserManager } from "./BrowserManager";
import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";

export async function runSmoke(url: string, headless: boolean) {
  const artifactsDir = join(process.cwd(), "artifacts", "smoke");
  mkdirSync(artifactsDir, { recursive: true });

  const manager = new BrowserManager();
  const page = await manager.launch({ headless });

  await page.goto(url, { waitUntil: "networkidle" });

  const screenshotPath = join(artifactsDir, "screenshot.png");
  await page.screenshot({ path: screenshotPath, fullPage: false });

  const meta = {
    url,
    title: await page.title(),
    finalUrl: page.url(),
    timestamp: new Date().toISOString(),
  };

  writeFileSync(join(artifactsDir, "meta.json"), JSON.stringify(meta, null, 2));

  await manager.close();
}
