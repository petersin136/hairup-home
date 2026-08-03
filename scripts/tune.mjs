/**
 * 특정 요소의 CSS 후보값을 바꿔가며 시안과의 불일치 픽셀이 가장 적은 조합을 찾습니다.
 * 픽셀 퍼펙트 보정 전용 도구라 제품 코드에는 영향이 없습니다.
 *
 *   node scripts/tune.mjs            # 전부
 *   node scripts/tune.mjs 카드        # 이름에 '카드' 가 든 실험만
 *
 * region 은 시안 아트보드 좌표(1440 기준)입니다. selector 로 섹션을 통째로 찍은 뒤
 * 같은 좌표를 양쪽에서 잘라 비교하므로, 첫 화면 밖 섹션도 그대로 다룰 수 있습니다.
 */
import fs from "node:fs";
import path from "node:path";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";
import { chromium } from "playwright";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";
const REF_DIR = path.join(process.cwd(), "design", "refs");

/** [이름, 시안, 섹션 셀렉터, 비교할 영역, 시험할 CSS 후보들] */
const EXPERIMENTS = [
  {
    name: "05 카드 본문",
    ref: "05-key-benefits.png",
    selector: "#key-benefits > div",
    viewport: { width: 1440, height: 1800 },
    region: { x: 110, y: 1335, width: 1330, height: 95 },
    target: "#key-benefits article p",
    candidates: [
      ["20 ls-1 (현재)", ""],
      ["19 ls-.01em", "font-size:19px;letter-spacing:-0.01em"],
      ["19 ls-.01em left8", "font-size:19px;letter-spacing:-0.01em;left:8px"],
      ["19 ls-.01em left8 lh30", "font-size:19px;letter-spacing:-0.01em;left:8px;line-height:30px"],
      ["19 ls0 left8", "font-size:19px;letter-spacing:0;left:8px"],
      ["19 ls+.2 left8", "font-size:19px;letter-spacing:0.2px;left:8px"],
      ["19.5 ls-.5 left8", "font-size:19.5px;letter-spacing:-0.5px;left:8px"],
      ["20 ls-1 left8 lh30", "left:8px;line-height:30px"],
    ],
  },
  {
    name: "05 카드 제목",
    ref: "05-key-benefits.png",
    selector: "#key-benefits > div",
    viewport: { width: 1440, height: 1800 },
    region: { x: 110, y: 1222, width: 1330, height: 95 },
    target: "#key-benefits article h3",
    candidates: [
      ["31/700 ls0.5", ""],
      ["32/700 ls-0.4", "font-size:32px;letter-spacing:-0.4px"],
      ["32/700 ls-0.4 left6", "font-size:32px;letter-spacing:-0.4px;left:6px"],
      ["32/700 ls-0.4 left8", "font-size:32px;letter-spacing:-0.4px;left:8px"],
      ["32/700 ls-0.5 lh45", "font-size:32px;letter-spacing:-0.5px;line-height:45px"],
      ["32/500 ls-0.4", "font-size:32px;font-weight:500;letter-spacing:-0.4px"],
    ],
  },
  {
    name: "05 헤더 본문",
    ref: "05-key-benefits.png",
    selector: "#key-benefits > div",
    viewport: { width: 1440, height: 1800 },
    region: { x: 380, y: 578, width: 680, height: 106 },
    target: "#key-benefits > div > p:nth-of-type(2)",
    candidates: [
      ["기준", ""],
      ["translateX 0.5", "transform:translateX(0.5px)"],
      ["translateX 1", "transform:translateX(1px)"],
      ["translateX -0.5", "transform:translateX(-0.5px)"],
      ["translateX 1 · ls-.008em", "transform:translateX(1px);letter-spacing:-0.008em"],
      ["translateX 0.5 · ls-.012em", "transform:translateX(0.5px);letter-spacing:-0.012em"],
    ],
  },
  {
    name: "06 좌측 텍스트",
    ref: "06-1-process.png",
    selector: "#process",
    viewport: { width: 1440, height: 1100 },
    region: { x: 110, y: 460, width: 420, height: 190 },
    step: 0,
    target: '#process [data-step="0"] > div',
    candidates: [
      ["기준 (본문 22 ls-.01em)", ""],
      ["본문 22 · left121", "{left:121px}"],
      ["본문 22 ls-.01em left121", "> p:last-child{letter-spacing:-0.01em}{left:121px}"],
      ["본문 23 ls-1", "> p:last-child{font-size:23px;letter-spacing:-1px}"],
      ["본문 23 ls-1 left121", "> p:last-child{font-size:23px;letter-spacing:-1px}{left:121px}"],
      ["본문 23 ls-1.1 left121", "> p:last-child{font-size:23px;letter-spacing:-1.1px}{left:121px}"],
      ["본문 23 ls-1 · 라벨 28 left121", "> p:last-child{font-size:23px;letter-spacing:-1px}{left:121px}"],
      ["본문 23/300 ls-1 left121", "> p:last-child{font-size:23px;font-weight:300;letter-spacing:-1px}{left:121px}"],
    ],
  },
  {
    name: "06 THE PROCESS",
    ref: "06-1-process.png",
    selector: "#process",
    viewport: { width: 1440, height: 1100 },
    region: { x: 110, y: 50, width: 360, height: 165 },
    step: 0,
    target: "#process > div > p:first-of-type",
    candidates: [
      ["66 / ls0", ""],
      ["67 / ls-1.3 top48", "font-size:67px;letter-spacing:-1.3px;top:48px"],
      ["68 / ls-2.6 top46", "font-size:68px;letter-spacing:-2.6px;top:46px"],
      ["69 / ls-3.9 top44", "font-size:69px;letter-spacing:-3.9px;top:44px"],
      ["70 / ls-5.2 top42", "font-size:70px;letter-spacing:-5.2px;top:42px"],
    ],
  },
  {
    name: "06 캡션",
    ref: "06-1-process.png",
    selector: "#process",
    viewport: { width: 1440, height: 1100 },
    region: { x: 200, y: 890, width: 420, height: 90 },
    step: 0,
    target: '#process [data-step="0"] > p:last-of-type',
    candidates: [
      ["66 / ls0.7", ""],
      ["66 / ls1.0", "letter-spacing:1px"],
      ["66 / ls1.3", "letter-spacing:1.3px"],
      ["67 / ls0 left212", "font-size:67px;letter-spacing:0;top:893px"],
      ["68 / ls-1 left212", "font-size:68px;letter-spacing:-1px;top:892px"],
    ],
  },
];

const only = process.argv[2];
const runs = only
  ? EXPERIMENTS.filter((e) => e.name.includes(only))
  : EXPERIMENTS;
if (runs.length === 0) {
  console.error(`알 수 없는 실험: ${only}`);
  process.exit(1);
}

const browser = await chromium.launch();

for (const experiment of runs) {
  console.log(`\n== ${experiment.name}`);
  const { x, y, width, height } = experiment.region;
  const expected = PNG.sync.read(
    fs.readFileSync(path.join(REF_DIR, experiment.ref)),
  );
  const slice = new PNG({ width, height });
  PNG.bitblt(expected, slice, x, y, width, height, 0, 0);

  const context = await browser.newContext({
    viewport: experiment.viewport,
    deviceScaleFactor: 1,
  });
  await context.addInitScript(() => {
    try {
      sessionStorage.setItem("hairup:splash-played", "1");
    } catch {}
  });

  const scored = [];
  for (const [label, css] of experiment.candidates) {
    const page = await context.newPage();
    await page.goto(BASE_URL, { waitUntil: "networkidle" });
    if (css) {
      /* 컴포넌트가 인라인 style 로 좌표를 주므로 모든 선언에 !important 를 붙입니다.
         '{' 가 들어 있으면 "자식셀렉터{선언}" 을 여러 개 이어 쓴 것으로 봅니다. */
      const bang = (decls) =>
        decls
          .split(";")
          .filter((d) => d.trim())
          .map((d) => `${d.trim()} !important`)
          .join(";");
      const rule = css.includes("{")
        ? css
            .split(/(?<=})\s*/)
            .filter(Boolean)
            .map((r) => {
              const [, child, decls] = r.match(/^(.*?)\{(.*)\}$/s);
              return `${experiment.target} ${child}{${bang(decls)}}`;
            })
            .join("")
        : `${experiment.target}{${bang(css)}}`;
      await page.addStyleTag({ content: rule });
    }
    await page.evaluate(() => document.fonts.ready);
    if (experiment.step !== undefined) {
      await page.waitForSelector(
        `[data-step="${experiment.step}"][data-active="true"]`,
        { timeout: 20000 },
      );
    }
    await page.evaluate(() => document.getAnimations().forEach((a) => a.finish()));
    await page.waitForTimeout(120);

    const full = PNG.sync.read(
      await page.locator(experiment.selector).screenshot(),
    );
    await page.close();

    const shot = new PNG({ width, height });
    PNG.bitblt(full, shot, x, y, width, height, 0, 0);

    const mismatched = pixelmatch(shot.data, slice.data, null, width, height, {
      threshold: 0.12,
      includeAA: false,
    });
    scored.push([label, mismatched]);
  }

  const best = Math.min(...scored.map(([, n]) => n));
  for (const [label, n] of scored) {
    console.log(
      `   ${label.padEnd(26)} ${String(n).padStart(6)} px${n === best ? "  <= 최소" : ""}`,
    );
  }
  await context.close();
}

await browser.close();
