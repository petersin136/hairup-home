/**
 * 시안에서 잰 '단어/줄 단위' 잉크 폭·높이에 가장 잘 맞는 폰트 크기·굵기·자간을 역산합니다.
 * 이미 확정된 요소를 같은 그룹에 넣어 두면 방법 자체를 검증할 수 있습니다.
 * 측정 전용 도구라 제품 코드에는 영향이 없습니다.
 *
 *   node scripts/measure-text.mjs
 */
import { chromium } from "playwright";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";

/** [텍스트, 시안 잉크 폭, 시안 잉크 높이] */
const GROUPS = [
  {
    tag: "검증용 · 01 히어로 아이브로우 (확정: Playfair 27 / 500 / ls -0.75)",
    font: "display",
    sizes: [24, 32],
    words: [
      ["HAIR", 60, 20],
      ["UP", 32, 19],
      ["PROFESSIONALS", 198, 20],
    ],
  },
  {
    tag: "검증용 · 01 히어로 본문 (확정: Noto Sans KR 22 / 400)",
    font: "kr",
    sizes: [18, 26],
    words: [["헤어업 AI가 감각적으로 처리합니다.", 318, 21]],
  },
  {
    tag: "06 THE PROCESS / STEP / 하단 라벨 (Playfair)",
    font: "display",
    sizes: [60, 84],
    words: [
      ["THE", 126, 50],
      ["PROCESS", 281, 52],
      ["STEP", 150, 53],
      ["DISCOVERY", 364, 53],
      ["BOOKING", 299, 53],
    ],
  },
  {
    tag: "06 하단 진행표시 1/3 (산세리프)",
    font: "latin",
    sizes: [14, 30],
    words: [["1/3", 42, 27]],
  },
  {
    tag: "06 좌측 라벨 (한글 볼드)",
    font: "kr",
    sizes: [20, 34],
    words: [
      ["발견", 47, 26],
      ["상담", 50, 27],
      ["확정", 48, 27],
    ],
  },
  {
    tag: "06 좌측 본문 (한글)",
    font: "kr",
    sizes: [18, 26],
    words: [
      ["피드 속에서 마음에 드는", 213, 21],
      ["프로필의 24시간 예약·상담", 245, 21],
      ["당신의 작업물을 발견합니다", 248, 21],
    ],
  },
  {
    tag: "05 카드 제목 (한글 볼드)",
    font: "kr",
    sizes: [24, 40],
    words: [
      ["맥락을 아는 디테일한 상담", 339, 30],
      ["대화를 통한 자동 예약", 280, 30],
    ],
  },
  {
    tag: "05 카드 본문 (한글)",
    font: "kr",
    sizes: [14, 24],
    words: [
      ["AI가 자연스럽게 제안하고 추천합니다.", 292, 18],
      ["시술 소요 시간과 실시간 예약을 정교하게 계산해", 368, 18],
    ],
  },
];

const WEIGHTS = [300, 400, 500, 600, 700, 800];
const TRACKING = [-1.5, -1.2, -0.9, -0.6, -0.3, -0.15, 0, 0.3, 0.6];

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

const results = await page.evaluate(
  ({ groups, weights, tracking }) => {
    const ctx = document.createElement("canvas").getContext("2d");
    const s = getComputedStyle(document.documentElement);
    const stacks = {
      display: `${s.getPropertyValue("--font-playfair").trim()}, 'Playfair Display', serif`,
      latin: `${s.getPropertyValue("--font-inter").trim()}, Inter, sans-serif`,
      kr: `${s.getPropertyValue("--font-noto-sans-kr").trim()}, 'Noto Sans KR', sans-serif`,
    };

    return groups.map((g) => {
      const scored = [];
      for (let size = g.sizes[0]; size <= g.sizes[1]; size += 1) {
        for (const weight of weights) {
          for (const ls of tracking) {
            let we = 0;
            let he = 0;
            for (const [text, tw, th] of g.words) {
              ctx.font = `${weight} ${size}px ${stacks[g.font]}`;
              const m = ctx.measureText(text);
              const w =
                m.actualBoundingBoxRight +
                m.actualBoundingBoxLeft +
                ls * (text.length - 1);
              const h = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
              we += Math.abs(w - tw);
              /* 래스터라이즈 안티에일리어싱 때문에 시안 잉크가 캔버스 메트릭보다 ~1px 큽니다. */
              he += Math.abs(h + 1 - th);
            }
            const n = g.words.length;
            scored.push({ size, weight, ls, we: we / n, he: he / n });
          }
        }
      }
      scored.sort((a, b) => a.we + a.he * 3 - (b.we + b.he * 3));
      return { tag: g.tag, top: scored.slice(0, 5) };
    });
  },
  { groups: GROUPS, weights: WEIGHTS, tracking: TRACKING },
);

for (const r of results) {
  console.log(`\n== ${r.tag}`);
  for (const c of r.top) {
    console.log(
      `   ${String(c.size).padStart(2)}px / ${c.weight} / ls ${String(c.ls).padStart(5)}` +
        `   폭오차 ${c.we.toFixed(2)}px   높이오차 ${c.he.toFixed(2)}px`,
    );
  }
}

await browser.close();
