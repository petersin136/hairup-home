/**
 * 06 의 큰 세리프가 현재 Playfair 정적 인스턴스보다 '높고 좁습니다'.
 * 가변 폰트의 optical size 축으로 그 차이를 설명할 수 있는지 확인합니다.
 * 측정 전용 도구입니다.  node scripts/probe-opsz.mjs
 */
import { chromium } from "playwright";

/** 시안 잉크: [글자, 폭, 높이] */
const WORDS = [
  ["THE", 126, 51],
  ["PROCESS", 281, 53],
  ["DISCOVERY", 364, 53],
];

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent(`<!doctype html><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:opsz,wght@5..1200,400..900&display=block">
<body style="margin:0"></body>`);
await page.waitForLoadState("networkidle");
await page.evaluate(() => document.fonts.ready);

const rows = await page.evaluate((words) => {
  const ctx = document.createElement("canvas").getContext("2d");
  const out = [];
  for (const opsz of [5, 20, 40, 70, 200, 600, 1200]) {
    for (const size of [64, 66, 68, 70, 72]) {
      const line = [];
      for (const [text, tw, th] of words) {
        ctx.font = `400 ${size}px "Playfair Display"`;
        ctx.fontVariantSettings = `"opsz" ${opsz}`;
        /* canvas 는 variation 을 못 받으므로 DOM 으로 잽니다. */
        const el = document.createElement("span");
        el.textContent = text;
        el.style.cssText =
          `position:absolute;white-space:pre;font-family:"Playfair Display";` +
          `font-size:${size}px;font-weight:400;line-height:1;` +
          `font-variation-settings:"opsz" ${opsz};`;
        document.body.appendChild(el);
        const r = el.getBoundingClientRect();
        el.remove();
        line.push({ text, w: Math.round(r.width * 10) / 10, tw, th });
      }
      out.push({ opsz, size, line });
    }
  }
  return out;
}, WORDS);

/* 폭이 맞는 크기에서 높이가 맞는지 보려고, 폭 기준 최적 크기만 추립니다. */
for (const opsz of [...new Set(rows.map((r) => r.opsz))]) {
  const cand = rows.filter((r) => r.opsz === opsz);
  const best = cand
    .map((r) => ({
      ...r,
      err:
        r.line.reduce((a, c) => a + Math.abs(c.w - c.tw) / c.tw, 0) /
        r.line.length,
    }))
    .sort((a, b) => a.err - b.err)[0];
  console.log(
    `opsz ${String(opsz).padStart(4)}  최적 ${best.size}px  평균 폭오차 ` +
      `${(best.err * 100).toFixed(2)}%   ` +
      best.line.map((c) => `${c.text} ${c.w}/${c.tw}`).join("  "),
  );
}

/* 실제 잉크 높이는 렌더해서 확인합니다. */
const heights = await page.evaluate(() => {
  const cv = document.createElement("canvas");
  cv.width = 500;
  cv.height = 140;
  const ctx = cv.getContext("2d");
  const out = [];
  for (const opsz of [5, 70, 1200]) {
    for (const size of [66, 70]) {
      ctx.clearRect(0, 0, 500, 140);
      ctx.fillStyle = "#000";
      ctx.font = `400 ${size}px "Playfair Display"`;
      ctx.fillText("THE", 10, 110);
      const d = ctx.getImageData(0, 0, 500, 140).data;
      let y0 = 1e9,
        y1 = -1,
        x0 = 1e9,
        x1 = -1;
      for (let y = 0; y < 140; y++)
        for (let x = 0; x < 500; x++)
          if (d[((500 * y + x) << 2) + 3] > 40) {
            if (y < y0) y0 = y;
            if (y > y1) y1 = y;
            if (x < x0) x0 = x;
            if (x > x1) x1 = x;
          }
      out.push(`opsz ${opsz} ${size}px  THE 잉크 ${x1 - x0 + 1} × ${y1 - y0 + 1}`);
    }
  }
  return out;
});
console.log("\n(캔버스는 opsz 를 못 바꿉니다 — 참고값)");
for (const h of heights) console.log("  " + h);

await browser.close();
