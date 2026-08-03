/**
 * 아직 구현하지 않은 요소를, 빈 페이지에 그려 시안 영역과 직접 픽셀 비교합니다.
 * 크기·굵기·자간 후보 중 시안에 가장 가까운 조합을 고릅니다.
 * 측정 전용 도구입니다.  node scripts/fit-text.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";
import { chromium } from "playwright";

const REF_DIR = path.join(process.cwd(), "design", "refs");

/** 시안에서 잰 잉크 박스를 기준으로, 그 주변을 여유 있게 잘라 비교합니다. */
const CASES = [
  {
    tag: "05 카드제목",
    ref: "05-key-benefits.png",
    bg: "#f6ecdf",
    fg: "#2c3a2e",
    font: "kr",
    text: "맥락을 아는 디테일한 상담",
    ink: { x: 129, y: 1278, w: 339, h: 30 },
    sizes: [30, 31, 32, 33],
    weights: [500, 600, 700, 800],
  },
  {
    tag: "05 카드제목2",
    ref: "05-key-benefits.png",
    bg: "#f6ecdf",
    fg: "#2c3a2e",
    font: "kr",
    text: "대화를 통한 자동 예약",
    ink: { x: 662, y: 1278, w: 280, h: 30 },
    sizes: [30, 31, 32, 33],
    weights: [500, 600, 700, 800],
  },
  {
    tag: "06 좌측본문",
    ref: "06-1-process.png",
    bg: "#b88667",
    fg: "#faf8f5",
    font: "kr",
    text: "당신의 작업물을 발견합니다",
    ink: { x: 123, y: 603, w: 248, h: 21 },
    sizes: [21, 22, 23],
    weights: [300, 400, 500],
  },
  {
    tag: "05 카드본문",
    ref: "05-key-benefits.png",
    bg: "#f6ecdf",
    fg: "#6c6864",
    font: "kr",
    text: "AI가 자연스럽게 제안하고 추천합니다.",
    ink: { x: 128, y: 1406, w: 292, h: 18 },
    sizes: [18, 19, 20],
    weights: [300, 400, 500],
  },
  {
    tag: "06 좌측라벨",
    ref: "06-1-process.png",
    bg: "#b88667",
    fg: "#faf8f5",
    font: "kr",
    text: "발견",
    ink: { x: 123, y: 484, w: 47, h: 26 },
    sizes: [26, 27, 28, 29, 30],
    weights: [500, 600, 700, 800],
  },
  {
    tag: "06 진행표시",
    ref: "06-1-process.png",
    bg: "#b88667",
    fg: "#955c3f",
    font: "latin",
    text: "1/3",
    ink: { x: 122, y: 906, w: 42, h: 27 },
    sizes: [26, 28, 30, 32],
    weights: [400, 500, 600, 700],
  },
];

/* 위아래 줄이 크롭에 섞이면 비교가 망가지므로 여백을 좁게 잡습니다. */
const PAD = 8;
const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 900, height: 260 },
  deviceScaleFactor: 1,
});
/* 앱과 같은 폰트를 쓰려고 dev 서버 페이지의 폰트 변수를 그대로 가져옵니다. */
await page.goto(process.env.BASE_URL ?? "http://localhost:3000", {
  waitUntil: "networkidle",
});
await page.evaluate(() => document.fonts.ready);

for (const c of CASES) {
  const ref = PNG.sync.read(fs.readFileSync(path.join(REF_DIR, c.ref)));
  const clip = {
    x: c.ink.x - PAD,
    y: c.ink.y - PAD,
    width: c.ink.w + PAD * 2,
    height: c.ink.h + PAD * 2,
  };
  const refSlice = new PNG({ width: clip.width, height: clip.height });
  PNG.bitblt(ref, refSlice, clip.x, clip.y, clip.width, clip.height, 0, 0);

  const scores = [];
  for (const size of c.sizes) {
    for (const weight of c.weights ?? [400, 500]) {
      for (const ls of [-2, -1.5, -1, -0.5, 0, 0.5]) {
        const shot = PNG.sync.read(
          await page.screenshot({
            clip: await page.evaluate(
              ({ c, size, weight, ls, clip, PAD }) => {
                document.getElementById("__fit")?.remove();
                const host = document.createElement("div");
                host.id = "__fit";
                host.style.cssText =
                  `position:fixed;left:0;top:0;width:${clip.width}px;` +
                  `height:${clip.height}px;background:${c.bg};z-index:99999;`;
                const s = getComputedStyle(document.documentElement);
                const stack = {
                  display: `${s.getPropertyValue("--font-playfair").trim()}, serif`,
                  latin: `${s.getPropertyValue("--font-inter").trim()}, sans-serif`,
                  kr: `${s.getPropertyValue("--font-noto-sans-kr").trim()}, sans-serif`,
                }[c.font ?? "display"];
                const el = document.createElement("span");
                el.textContent = c.text;
                el.style.cssText =
                  `position:absolute;white-space:pre;color:${c.fg};` +
                  `font-family:${stack};font-size:${size}px;font-weight:${weight};` +
                  `letter-spacing:${ls}px;line-height:1;left:0;top:0;` +
                  /* 시안은 Noto Sans CJK KR 기준이라 공백이 더 좁습니다(globals.css 와 동일 보정). */
                  (c.font === "kr" ? "word-spacing:-0.057em;" : "");
                host.appendChild(el);
                document.body.appendChild(host);
                /* 렌더된 잉크의 좌상단이 시안 잉크 좌상단과 맞도록 밀어 줍니다. */
                const r = el.getBoundingClientRect();
                el.style.left = `${PAD - (r.left - 0)}px`;
                return { x: 0, y: 0, width: clip.width, height: clip.height };
              },
              { c, size, weight, ls, clip, PAD },
            ),
          }),
        );
        /* 잉크 좌상단을 맞춘 뒤 남는 오차만 센다 */
        const d = align(shot, refSlice, c.bg);
        scores.push({ label: `${size}px / ${weight} / ls ${ls}`, ...d });
      }
    }
  }
  scores.sort((a, b) => a.diff - b.diff);
  console.log(`\n== ${c.tag}   시안 잉크 ${c.ink.w} × ${c.ink.h}`);
  for (const s of scores.slice(0, 5)) {
    console.log(
      `   ${s.label.padEnd(22)} 불일치 ${String(s.diff).padStart(5)}px  ` +
        `(렌더 잉크 ${s.w} × ${s.h}, 정렬 dx ${s.dx} dy ${s.dy})`,
    );
  }
}

/** 두 슬라이스의 잉크를 좌상단 기준으로 맞춘 뒤 불일치 픽셀을 셉니다. */
function align(shot, ref, bgHex) {
  const bg = [1, 3, 5].map((i) => parseInt(bgHex.slice(i, i + 2), 16));
  const mask = (png) => {
    const m = [];
    for (let y = 0; y < png.height; y++) {
      for (let x = 0; x < png.width; x++) {
        const i = (png.width * y + x) << 2;
        const d =
          Math.abs(png.data[i] - bg[0]) +
          Math.abs(png.data[i + 1] - bg[1]) +
          Math.abs(png.data[i + 2] - bg[2]);
        m.push(d > 40 ? 1 : 0);
      }
    }
    return m;
  };
  const a = mask(shot);
  const b = mask(ref);
  const box = (m, w, h) => {
    let x0 = 1e9,
      y0 = 1e9,
      x1 = -1,
      y1 = -1;
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++)
        if (m[w * y + x]) {
          if (x < x0) x0 = x;
          if (x > x1) x1 = x;
          if (y < y0) y0 = y;
          if (y > y1) y1 = y;
        }
    return { x0, y0, x1, y1 };
  };
  const W = shot.width;
  const H = shot.height;
  const ba = box(a, W, H);
  const bb = box(b, W, H);
  const dx = bb.x0 - ba.x0;
  const dy = bb.y0 - ba.y0;
  let diff = 0;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const sx = x - dx;
      const sy = y - dy;
      const av = sx >= 0 && sx < W && sy >= 0 && sy < H ? a[W * sy + sx] : 0;
      if (av !== b[W * y + x]) diff++;
    }
  }
  return {
    diff,
    dx,
    dy,
    w: ba.x1 - ba.x0 + 1,
    h: ba.y1 - ba.y0 + 1,
  };
}

await browser.close();
