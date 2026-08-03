/**
 * 06 의 대형 Playfair 텍스트를 단어별로 나눠, 크기를 고정했을 때 필요한 자간을 봅니다.
 * 측정 전용 도구입니다.  node scripts/measure-playfair.mjs
 */
import { chromium } from "playwright";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";
const WORDS = [
  ["THE", 126, 50],
  ["PROCESS", 281, 52],
  ["STEP", 150, 53],
  ["DISCOVERY", 364, 53],
  ["INQUIRY", 262, 62],
  ["BOOKING", 299, 53],
];

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 400 } });
await context.addInitScript(() => {
  try {
    sessionStorage.setItem("hairup:splash-played", "1");
  } catch {}
});
const page = await context.newPage();
await page.goto(BASE_URL, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);

const rows = await page.evaluate((words) => {
  const ctx = document.createElement("canvas").getContext("2d");
  const s = getComputedStyle(document.documentElement);
  const stack = `${s.getPropertyValue("--font-playfair").trim()}, 'Playfair Display', serif`;
  const out = [];
  for (const size of [68, 69, 70, 71, 72]) {
    const line = [];
    for (const [text, tw, th] of words) {
      ctx.font = `400 ${size}px ${stack}`;
      const m = ctx.measureText(text);
      const w = m.actualBoundingBoxRight + m.actualBoundingBoxLeft;
      const h = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
      line.push({
        text,
        w: Math.round(w * 10) / 10,
        dh: Math.round((h + 1 - th) * 10) / 10,
        ls: Math.round(((tw - w) / (text.length - 1)) * 100) / 100,
      });
    }
    out.push({ size, line });
  }
  return out;
}, WORDS);

for (const r of rows) {
  console.log(`\n== ${r.size}px / 400`);
  for (const c of r.line) {
    console.log(
      `   ${c.text.padEnd(11)} 캔버스 폭 ${String(c.w).padStart(6)}  ` +
        `필요 자간 ${String(c.ls).padStart(6)}px   높이차 ${String(c.dh).padStart(5)}px`,
    );
  }
}

await browser.close();
