/* 헤더를 기본(영문)·호버(한글) 상태로 찍어 둡니다. 잉크 줄은 probe-header.py 로 잽니다. */
import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await page.evaluate(() => document.documentElement.classList.add("splash-seen"));
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);

await page.screenshot({
  path: ".diff/header-en.png",
  clip: { x: 0, y: 0, width: 1440, height: 120 },
});

await page.locator('header a[href="#pricing"]').hover();
await page.waitForTimeout(800);
await page.screenshot({
  path: ".diff/header-ko.png",
  clip: { x: 0, y: 0, width: 1440, height: 120 },
});

await page.locator('header a[href="#start"]').hover();
await page.waitForTimeout(800);
await page.screenshot({
  path: ".diff/header-cta-ko.png",
  clip: { x: 0, y: 0, width: 1440, height: 120 },
});

await browser.close();
