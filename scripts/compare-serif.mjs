/**
 * 시안 크롭 위에 후보 조판을 겹쳐 그린 비교 시트를 만듭니다.
 * 측정 전용 도구입니다.  node scripts/compare-serif.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const CASES = [
  { tag: "THE", ref: "06-1-process.png", x: 120, y: 70, w: 126, h: 51 },
  { tag: "PROCESS", ref: "06-1-process.png", x: 120, y: 149, w: 281, h: 53 },
  { tag: "DISCOVERY", ref: "06-1-process.png", x: 212, y: 907, w: 364, h: 53 },
];
const CANDIDATES = [
  { label: "66px / ls 0", size: 66, ls: 0 },
  { label: "70px / ls -3", size: 70, ls: -3 },
  { label: "72px / ls -4.4", size: 72, ls: -4.4 },
];

const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 2 });
await page.goto(process.env.BASE_URL ?? "http://localhost:3000", {
  waitUntil: "networkidle",
});
const stack = await page.evaluate(
  () =>
    `${getComputedStyle(document.documentElement)
      .getPropertyValue("--font-playfair")
      .trim()}, serif`,
);
const fontCss = await page.evaluate(() =>
  [...document.querySelectorAll('link[rel="stylesheet"],style')]
    .map((n) => n.outerHTML)
    .join(""),
);

const rows = CASES.map((c) => {
  const b64 = fs
    .readFileSync(path.join("design", "refs", c.ref))
    .toString("base64");
  const crops = CANDIDATES.map(
    (k) => `<div class="cell">
      <span class="tag">${k.label}</span>
      <div class="stage" style="width:${c.w + 20}px;height:${c.h + 20}px">
        <img src="data:image/png;base64,${b64}"
             style="left:${-(c.x - 10)}px;top:${-(c.y - 10)}px">
        <span class="ov" style="font-size:${k.size}px;letter-spacing:${k.ls}px">${c.tag}</span>
      </div></div>`,
  ).join("");
  return `<div class="row"><h3>${c.tag} — 시안 ${c.w} × ${c.h}</h3>
    <div class="cell"><span class="tag">시안</span>
      <div class="stage" style="width:${c.w + 20}px;height:${c.h + 20}px">
        <img src="data:image/png;base64,${b64}"
             style="left:${-(c.x - 10)}px;top:${-(c.y - 10)}px"></div></div>
    ${crops}</div>`;
}).join("");

await page.setContent(`<!doctype html><meta charset="utf-8">${fontCss}
<style>
 body{margin:0;padding:20px;background:#fff;font:12px system-ui}
 .row{margin-bottom:18px}
 h3{margin:0 0 6px;font-size:12px}
 .cell{display:inline-block;vertical-align:top;margin-right:16px}
 .tag{display:block;margin-bottom:2px;color:#888}
 .stage{position:relative;overflow:hidden}
 .stage img{position:absolute;image-rendering:pixelated}
 .ov{position:absolute;left:10px;top:10px;line-height:1;white-space:pre;
     font-family:${stack};font-weight:400;color:#0a4;mix-blend-mode:multiply;opacity:.75}
</style><body>${rows}</body>`);
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: "/tmp/serif-compare.png", fullPage: true });
console.log("→ /tmp/serif-compare.png");
await browser.close();
