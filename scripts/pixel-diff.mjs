/**
 * 구현 결과를 1440px 로 스크린샷 찍어 시안 PNG 와 픽셀 단위로 비교합니다.
 *
 *   node scripts/pixel-diff.mjs            # 전부
 *   node scripts/pixel-diff.mjs 01-hero    # 특정 섹션만
 *
 * 결과물은 design/diff/ 에 <name>-actual.png / <name>-diff.png 로 떨어집니다.
 * dev 서버(http://localhost:3000)가 떠 있어야 합니다.
 */
import { chromium } from "playwright";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";
import fs from "node:fs";
import path from "node:path";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";
const ROOT = process.cwd();
const REF_DIR = path.join(ROOT, "design", "refs");
const OUT_DIR = path.join(ROOT, "design", "diff");

/** 시안 한 장 = 타깃 하나. clip 은 페이지에서 잘라낼 영역. */
const TARGETS = [
  {
    name: "00-splash",
    url: "/",
    ref: "00-splash.png",
    clip: { x: 0, y: 0, width: 1440, height: 900 },
    viewport: { width: 1440, height: 900 },
    /** 스플래시 애니메이션을 등장 완료 시점에 고정 */
    freezeAt: 400,
  },
  {
    name: "01-hero",
    url: "/",
    ref: "01-hero.png",
    clip: { x: 0, y: 0, width: 1440, height: 836 },
    viewport: { width: 1440, height: 900 },
    skipSplash: true,
  },
];

const only = process.argv[2];
const targets = only ? TARGETS.filter((t) => t.name === only) : TARGETS;
if (targets.length === 0) {
  console.error(`알 수 없는 타깃: ${only}`);
  process.exit(1);
}

fs.mkdirSync(OUT_DIR, { recursive: true });

const browser = await chromium.launch();
let worstRatio = 0;

for (const target of targets) {
  const context = await browser.newContext({
    viewport: target.viewport,
    deviceScaleFactor: 1,
    reducedMotion: "no-preference",
  });

  if (target.skipSplash) {
    await context.addInitScript(() => {
      try {
        sessionStorage.setItem("hairup:splash-played", "1");
      } catch {}
    });
  }

  const page = await context.newPage();
  await page.goto(`${BASE_URL}${target.url}`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);

  if (target.freezeAt !== undefined) {
    await page.evaluate((at) => {
      document.getAnimations().forEach((animation) => {
        animation.pause();
        animation.currentTime = at;
      });
    }, target.freezeAt);
  } else {
    await page.evaluate(() =>
      document.getAnimations().forEach((a) => a.finish()),
    );
  }
  await page.waitForTimeout(150);

  const shot = await page.screenshot({ clip: target.clip });
  await context.close();

  const actual = PNG.sync.read(shot);
  const expected = PNG.sync.read(
    fs.readFileSync(path.join(REF_DIR, target.ref)),
  );

  const width = Math.min(actual.width, expected.width);
  const height = Math.min(actual.height, expected.height);
  const diff = new PNG({ width, height });

  const crop = (png) => {
    if (png.width === width && png.height === height) return png;
    const out = new PNG({ width, height });
    PNG.bitblt(png, out, 0, 0, width, height, 0, 0);
    return out;
  };

  const mismatched = pixelmatch(
    crop(actual).data,
    crop(expected).data,
    diff.data,
    width,
    height,
    { threshold: 0.12, includeAA: false, diffMask: false },
  );

  fs.writeFileSync(path.join(OUT_DIR, `${target.name}-actual.png`), shot);
  fs.writeFileSync(
    path.join(OUT_DIR, `${target.name}-diff.png`),
    PNG.sync.write(diff),
  );

  const ratio = (mismatched / (width * height)) * 100;
  worstRatio = Math.max(worstRatio, ratio);
  console.log(
    `${target.name.padEnd(10)} ${String(mismatched).padStart(8)} px 불일치  (${ratio.toFixed(3)}%)  ${width}×${height}`,
  );
}

await browser.close();
process.exit(worstRatio > 0.5 ? 1 : 0);
