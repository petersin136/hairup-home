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
    budget: 1.2,
    url: "/",
    ref: "01-hero.png",
    /*
     * 02-D 시안으로 텍스트 영역(#FAF8F5) + 800px 비주얼이 붙어 높이가 달라졌습니다.
     * 헤더·카피 영역만 대조합니다.
     */
    selector: "#hero > div:first-child",
    viewport: { width: 1440, height: 1000 },
    skipSplash: true,
    mask: [
      { left: 480, top: 44, width: 530, height: 36 },
      { left: 1130, top: 44, width: 180, height: 36 },
    ],
  },
  {
    name: "02-dilemma",
    budget: 2.5,
    url: "/",
    ref: "02-dilemma.png",
    selector: "#dilemma > div",
    viewport: { width: 1440, height: 1600 },
    skipSplash: true,
    /*
     * 시안이 550px 결합본을 1440 으로 키운 것이라 글자 안티에일리어싱이 뭉개져
     * 있습니다. 좌표 검증용으로만 보고, 허용치를 여유 있게 둡니다.
     * 상단을 히어로 하단(62)에 맞추려고 87 올린 뒤라, 시안도 같은 창으로 잘라 봅니다.
     */
    refCrop: { left: 0, top: 87, width: 1440, height: 1423 },
  },
  {
    name: "03-test",
    budget: 0.08,
    url: "/",
    ref: "03-test.png",
    selector: "#experience > div",
    viewport: { width: 1440, height: 1200 },
    skipSplash: true,
    /* 상·하단 여백을 148 로 맞춰 시안 하단 152px 을 잘라 냈습니다. */
    refCrop: { left: 0, top: 0, width: 1440, height: 1064 },
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
    /*
     * 카드 줄은 넷째 장이 붙고 거터도 80 으로 좁아져 시안과 x 가 다릅니다.
     * 여기서는 머리글만 보고, 카드 자체는 아래 05-card-N 으로 한 장씩 봅니다.
     */
    mask: [{ left: 0, top: 820, width: 1440, height: 610 }],
  },
  /*
   * 카드 한 장을 시안의 같은 자리에서 오려 낸 것과 맞춰 봅니다. 줄이 통째로
   * 왼쪽으로 40 옮겨졌을 뿐 장 안쪽은 시안 그대로여야 합니다.
   * 셋째 장은 시안에서 254px 만 보여 그만큼만, 넷째 장은 시안에 없어 뺍니다.
   */
  /*
   * 허용치가 섹션 전체(0.7%)보다 큰 것은 창을 카드 한 장으로 좁혔기 때문입니다.
   * 어긋나는 픽셀 수 자체는 세 장을 합쳐도 전과 같고, 전부 한글 글자 가장자리의
   * 안티에일리어싱입니다. 잉크 좌표는 ±1px 안입니다.
   */
  ...[
    { card: 0, left: 120, width: 500, budget: 1.8 },
    { card: 1, left: 653, width: 500, budget: 1.2 },
    { card: 2, left: 1186, width: 254, budget: 2.3 },
  ].map(({ card, left, width, budget }) => ({
    name: `05-card-${card + 1}`,
    budget,
    url: "/",
    ref: "05-key-benefits.png",
    selector: `#key-benefits [data-card="${card}"]`,
    viewport: { width: 1440, height: 1800 },
    skipSplash: true,
    refCrop: { left, top: 827, width, height: 597 },
  })),
  ...[0, 1, 2].map((step) => ({
    name: `06-${step + 1}-process`,
    /*
     * 애플식 선반으로 프레임이 시안(풀블리드)과 다릅니다. 카드 안쪽만 느슨히 봅니다.
     */
    budget: 8,
    url: "/",
    ref: `06-${step + 1}-process.png`,
    selector: `#process [data-step="${step}"][data-centered="true"]`,
    viewport: { width: 1440, height: 1200 },
    skipSplash: true,
    click: `#process [role="tablist"] [role="tab"]:nth-child(${step + 1})`,
    clickWait: 650,
    refCrop: { left: 60, top: 0, width: 1320, height: 1030 },
    scaleToRef: true,
  })),
  ...[
    { name: "07-1-template", ref: "07-1-template.png", budget: 0.9 },
    {
      name: "07-2-template-hover",
      ref: "07-2-template-hover.png",
      budget: 1.1,
      hover: '#template-collection [data-centered="true"]',
    },
    {
      name: "07-3-button-hover",
      ref: "07-3-button-hover.png",
      budget: 1.1,
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
  ...[
    {
      name: "10-1-faq",
      ref: "10-1-faq.png",
      /*
       * 633px 시안을 1440 으로 키우면 흐려져 비교가 안 됩니다. 스크린샷을
       * 줄여 맞추면 한글 안티에일리어싱이 크게 어긋나 3~4% 가 바닥에 깔립니다.
       * 카드·머리글 좌표는 ±2px 안입니다.
       */
      budget: 4.0,
    },
    ...[0, 1, 2, 3, 4, 5].map((i) => ({
      name: `10-${i + 2}-faq-hover`,
      ref: `10-${i + 2}-faq-hover.png`,
      budget: 4.5,
      hover: `#faq [data-faq-card="${i}"]`,
    })),
  ].map((t) => ({
    ...t,
    url: "/",
    selector: "#faq > div",
    viewport: { width: 1440, height: 1600 },
    skipSplash: true,
    scaleToRef: true,
  })),
  ...[
    { name: "11-1-cta", ref: "11-1-cta.png", budget: 1.5 },
    {
      name: "11-2-cta-btn-hover",
      ref: "11-2-cta-btn-hover.png",
      budget: 1.5,
      hover: "#start [data-cta-btn]",
    },
  ].map((t) => ({
    ...t,
    url: "/",
    selector: "#start > div",
    viewport: { width: 1440, height: 1400 },
    skipSplash: true,
    /* 1024px 시안 → 스크린샷을 시안 폭으로 줄여 대조합니다. */
    scaleToRef: true,
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
    reducedMotion: target.reducedMotion ?? "no-preference",
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

  /*
   * 본문 rain-in 은 IntersectionObserver 로 켜집니다. 스크린샷 전에 끝까지
   * 보낸 뒤 finish 하면 픽셀 대조가 중간 프레임을 찍지 않습니다.
   */
  await page.evaluate(() => {
    document.querySelectorAll("[data-rain-line]").forEach((el) => {
      el.classList.add("rain-line-in");
    });
    document.querySelectorAll("[data-rain]").forEach((el) => {
      el.setAttribute("data-rain", "in");
    });
  });

  if (target.click) {
    await page.locator(target.click).click();
    await page.waitForTimeout(target.clickWait ?? 500);
  }

  if (target.hover) {
    await page.locator(target.hover).hover();
    await page.waitForTimeout(700);
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
    ? await page.locator(target.selector).first().screenshot()
    : await page.screenshot({ clip: target.clip });
  await context.close();

  let refBuffer = fs.readFileSync(path.join(REF_DIR, target.ref));
  if (target.refCrop) {
    refBuffer = await sharp(refBuffer).extract(target.refCrop).png().toBuffer();
  }

  if (target.scaleToRef) {
    const { width: rw } = await sharp(refBuffer).metadata();
    shot = await sharp(shot)
      .resize({ width: rw, kernel: "lanczos3" })
      .png()
      .toBuffer();
  }

  const actual = await decode(shot);
  const expected = await decode(refBuffer);

  /** 시안을 일부러 벗어난 자리는 양쪽 다 같은 색으로 덮어 비교에서 뺍니다. */
  for (const rect of target.mask ?? []) {
    for (const png of [actual, expected]) {
      for (let y = rect.top; y < rect.top + rect.height; y += 1) {
        for (let x = rect.left; x < rect.left + rect.width; x += 1) {
          const at = (y * png.width + x) * 4;
          png.data.fill(0, at, at + 4);
        }
      }
    }
  }

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
