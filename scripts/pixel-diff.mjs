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
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";
const ROOT = process.cwd();
const REF_DIR = path.join(ROOT, "design", "refs");
const OUT_DIR = path.join(ROOT, "design", "diff");

/**
 * 시안 한 장 = 타깃 하나.
 * clip 은 뷰포트 좌표로 잘라내고, selector 는 해당 요소만 찍습니다.
 * 첫 화면 밖에 있는 섹션은 selector 를 쓰세요.
 *
 * budget 은 허용 불일치 비율(%)입니다. 요소 좌표를 ±1px 안에 맞춘 뒤 남는 값은
 * 글자 안티에일리어싱 차이라, 작은 한글이 많은 섹션일수록 자연히 커집니다.
 * 그래서 전역 기준 하나로 두지 않고 섹션마다 현재값 + 약간의 여유로 잡습니다.
 */
const TARGETS = [
  {
    name: "00-splash",
    budget: 0.08,
    url: "/",
    ref: "00-splash.png",
    clip: { x: 0, y: 0, width: 1440, height: 900 },
    viewport: { width: 1440, height: 900 },
    /** 스플래시 애니메이션을 등장 완료 시점에 고정 */
    freezeAt: 400,
  },
  {
    name: "01-hero",
    budget: 0.45,
    url: "/",
    ref: "01-hero.png",
    clip: { x: 0, y: 0, width: 1440, height: 836 },
    viewport: { width: 1440, height: 900 },
    skipSplash: true,
  },
  {
    name: "03-test",
    budget: 0.08,
    url: "/",
    ref: "03-test.png",
    selector: "#experience > div",
    viewport: { width: 1440, height: 1300 },
    skipSplash: true,
  },
  {
    name: "04-banner",
    budget: 0.12,
    url: "/",
    ref: "04-banner.png",
    selector: "#banner > div",
    viewport: { width: 1440, height: 900 },
    skipSplash: true,
  },
  {
    name: "05-key-benefits",
    budget: 0.7,
    url: "/",
    ref: "05-key-benefits.png",
    selector: "#key-benefits > div",
    viewport: { width: 1440, height: 1800 },
    skipSplash: true,
  },
  ...[0, 1, 2].map((step) => ({
    name: `06-${step + 1}-process`,
    budget: 0.5,
    url: "/",
    ref: `06-${step + 1}-process.png`,
    selector: "#process",
    viewport: { width: 1440, height: 1100 },
    skipSplash: true,
    /** 자동 순환 섹션이라 해당 상태가 활성화될 때까지 기다립니다. */
    step,
  })),
  ...[
    { name: "07-1-template", ref: "07-1-template.png", budget: 0.55 },
    {
      name: "07-2-template-hover",
      ref: "07-2-template-hover.png",
      budget: 0.55,
      hover: '#template-collection [data-centered="true"]',
    },
    {
      name: "07-3-button-hover",
      ref: "07-3-button-hover.png",
      budget: 0.55,
      hover: '#template-collection [data-centered="true"] a',
    },
  ].map((t) => ({
    ...t,
    url: "/",
    selector: "#template-collection > div",
    viewport: { width: 1440, height: 1000 },
    skipSplash: true,
    /*
     * 이 시안만 843px 로 축소 저장돼 왔습니다. 시안을 1440 으로 늘리면 흐려져
     * 비교가 무의미해지므로, 반대로 스크린샷을 시안 폭으로 줄여서 맞춥니다.
     * 축소 과정에서 글자 안티에일리어싱이 뭉개지므로 좌표 검증용으로만 봅니다.
     */
    scaleToRef: true,
    /*
     * 시안의 카드는 대문 이미지가 없는 검정 플레이스홀더입니다. 이미지를 감춰야
     * 카드 안쪽까지 같은 조건으로 비교됩니다.
     */
    css: "#template-collection [data-cover] { visibility: hidden }",
  })),
];

const only = process.argv[2];
const targets = only ? TARGETS.filter((t) => t.name === only) : TARGETS;
if (targets.length === 0) {
  console.error(`알 수 없는 타깃: ${only}`);
  process.exit(1);
}

fs.mkdirSync(OUT_DIR, { recursive: true });

/** PNG 인코딩 종류를 타지 않도록 디코딩은 sharp 로 통일합니다. */
async function decode(buffer) {
  const { data, info } = await sharp(buffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const png = new PNG({ width: info.width, height: info.height });
  png.data = data;
  return png;
}

const browser = await chromium.launch();
let failed = false;

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
  /*
   * 스플래시는 fixed 라서 뷰포트보다 긴 섹션을 찍을 때 화면 위쪽을 덮습니다.
   * sessionStorage 만으로는 첫 페인트 타이밍을 못 잡을 때가 있어 직접 감춥니다.
   */
  if (target.skipSplash) {
    await page.evaluate(() =>
      document.documentElement.classList.add("splash-seen"),
    );
  }
  await page.evaluate(() => document.fonts.ready);

  if (target.css) await page.addStyleTag({ content: target.css });

  if (target.hover) {
    await page.locator(target.hover).hover();
    await page.waitForTimeout(700);
  }

  if (target.step !== undefined) {
    await page.waitForSelector(
      `[data-step="${target.step}"][data-active="true"]`,
      { timeout: 20000 },
    );
  }

  if (target.freezeAt !== undefined) {
    await page.evaluate((at) => {
      document.getAnimations().forEach((animation) => {
        animation.pause();
        animation.currentTime = at;
      });
    }, target.freezeAt);
  } else {
    await page.evaluate(() =>
      document.getAnimations().forEach((a) => {
        /* 마퀴처럼 끝이 없는 애니메이션은 finish() 가 통하지 않아 첫 프레임에 세웁니다. */
        if (a.effect?.getComputedTiming().iterations === Infinity) {
          a.pause();
          a.currentTime = 0;
        } else {
          a.finish();
        }
      }),
    );
  }
  await page.waitForTimeout(150);

  let shot = target.selector
    ? await page.locator(target.selector).screenshot()
    : await page.screenshot({ clip: target.clip });
  await context.close();

  if (target.scaleToRef) {
    const ref = sharp(path.join(REF_DIR, target.ref));
    const { width: rw } = await ref.metadata();
    shot = await sharp(shot).resize({ width: rw, kernel: "lanczos3" }).png().toBuffer();
  }

  const actual = await decode(shot);
  const expected = await decode(
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
  const over = ratio > target.budget;
  if (over) failed = true;
  console.log(
    `${target.name.padEnd(16)} ${String(mismatched).padStart(7)} px 불일치  ` +
      `${ratio.toFixed(3)}% / 허용 ${target.budget.toFixed(2)}%  ` +
      `${width}×${height}${over ? "   <-- 초과" : ""}`,
  );
}

await browser.close();
process.exit(failed ? 1 : 0);
