/**
 * 특정 요소의 CSS 후보값을 바꿔가며 시안과의 불일치 픽셀이 가장 적은 조합을 찾습니다.
 * 픽셀 퍼펙트 보정 전용 도구라 제품 코드에는 영향이 없습니다.
 *
 *   node scripts/tune.mjs
 */
import { chromium } from "playwright";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";
import fs from "node:fs";
import path from "node:path";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";
const refs = {
  hero: PNG.sync.read(
    fs.readFileSync(path.join(process.cwd(), "design", "refs", "01-hero.png")),
  ),
  splash: PNG.sync.read(
    fs.readFileSync(path.join(process.cwd(), "design", "refs", "00-splash.png")),
  ),
};

/** [이름, 비교할 영역, 시험할 CSS 후보들] */
const EXPERIMENTS = [
  {
    name: "splash-eyebrow",
    ref: "splash",
    showSplash: true,
    region: { x: 610, y: 380, width: 220, height: 26 },
    candidates: [
      ["14 / 600 ls1.75", ""],
      ["15 / 500 ls0.90", ".splash-content p{font-size:15px;font-weight:500;letter-spacing:0.9px;text-indent:0.9px}"],
      ["15 / 600 ls0.90", ".splash-content p{font-size:15px;font-weight:600;letter-spacing:0.9px;text-indent:0.9px}"],
      ["15 / 500 ls1.00", ".splash-content p{font-size:15px;font-weight:500;letter-spacing:1px;text-indent:1px}"],
      ["14 / 700 ls1.92", ".splash-content p{font-weight:700;letter-spacing:1.92px;text-indent:1.92px}"],
      ["16 / 500 ls0.30", ".splash-content p{font-size:16px;font-weight:500;letter-spacing:0.3px;text-indent:0.3px}"],
    ],
  },
  {
    name: "nav",
    region: { x: 480, y: 45, width: 430, height: 35 },
    candidates: [
      ["17px / 400", "nav a{font-weight:400}"],
      ["17px / 500", "nav a{font-weight:500}"],
      ["16px / 500", "nav a{font-weight:500;font-size:16px}"],
      ["17px / 500 ls.02", "nav a{font-weight:500;letter-spacing:0.02em}"],
      ["17px / 500 ls-.01", "nav a{font-weight:500;letter-spacing:-0.01em}"],
    ],
  },
  {
    name: "cta",
    region: { x: 1150, y: 45, width: 140, height: 35 },
    candidates: [
      ["17 / 600", "header>a:last-of-type span{font-weight:600}"],
      ["17 / 700", "header>a:last-of-type span{font-weight:700}"],
      ["17 / 500", "header>a:last-of-type span{font-weight:500}"],
      ["17 / 800", "header>a:last-of-type span{font-weight:800}"],
    ],
  },
  {
    name: "body",
    region: { x: 110, y: 668, width: 520, height: 110 },
    candidates: [
      ["22 / 400", "main p:last-of-type{font-weight:400}"],
      ["22 / 500", "main p:last-of-type{font-weight:500}"],
      ["22 / 450", "main p:last-of-type{font-weight:450}"],
      ["22 / 400 #635f5a", "main p:last-of-type{font-weight:400;color:#635f5a}"],
      ["22 / 400 #66625e", "main p:last-of-type{font-weight:400;color:#66625e}"],
    ],
  },
  {
    name: "eyebrow",
    region: { x: 110, y: 382, width: 400, height: 36 },
    candidates: [
      ["27 / 500 ls-.75", ""],
      ["27 / 400 ls-.75", "main p:first-of-type{font-weight:400}"],
      ["27 / 600 ls-.75", "main p:first-of-type{font-weight:600}"],
      ["26 / 600 ls-.5", "main p:first-of-type{font-weight:600;font-size:26px;letter-spacing:-0.5px}"],
    ],
  },
];

const browser = await chromium.launch();

const makeContext = (showSplash) =>
  browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    ...(showSplash
      ? {}
      : {
          storageState: {
            cookies: [],
            origins: [
              {
                origin: BASE_URL,
                localStorage: [],
              },
            ],
          },
        }),
  });

for (const experiment of EXPERIMENTS) {
  console.log(`\n== ${experiment.name}`);
  const { x, y, width, height } = experiment.region;
  const expected = refs[experiment.ref ?? "hero"];

  const slice = new PNG({ width, height });
  PNG.bitblt(expected, slice, x, y, width, height, 0, 0);

  const context = await makeContext(experiment.showSplash);
  if (!experiment.showSplash) {
    await context.addInitScript(() => {
      try {
        sessionStorage.setItem("hairup:splash-played", "1");
      } catch {}
    });
  }

  for (const [label, css] of experiment.candidates) {
    const page = await context.newPage();
    await page.goto(BASE_URL, { waitUntil: "networkidle" });
    if (css) await page.addStyleTag({ content: css });
    await page.evaluate(() => document.fonts.ready);
    if (experiment.showSplash) {
      await page.evaluate(() =>
        document.getAnimations().forEach((a) => {
          a.pause();
          a.currentTime = 400;
        }),
      );
    }
    await page.waitForTimeout(120);

    const shot = PNG.sync.read(
      await page.screenshot({ clip: experiment.region }),
    );
    await page.close();

    const mismatched = pixelmatch(
      shot.data,
      slice.data,
      null,
      width,
      height,
      { threshold: 0.12, includeAA: false },
    );
    console.log(`   ${label.padEnd(20)} ${String(mismatched).padStart(6)} px`);
  }

  await context.close();
}

await browser.close();
