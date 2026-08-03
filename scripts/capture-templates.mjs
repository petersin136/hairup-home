/**
 * 07_Template Collection 카드에 들어갈 템플릿 대문 이미지를 캡처합니다.
 *
 *   node scripts/capture-templates.mjs
 *
 * 카드가 800 × 500(=1.6)이라 데스크톱 뷰포트 1440 × 900 을 2배 해상도로 찍습니다.
 * 히어로가 화면보다 짧아 다음 섹션이 흰 띠처럼 걸치는 사이트는 heroHeight 로
 * 히어로까지만 잘라내고, 모자란 비율은 좌우를 깎아 1600 × 1000 에 맞춥니다.
 */
const VIEWPORT = { width: 1440, height: 900 };
import { chromium } from "playwright";
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const OUT_DIR = path.join(process.cwd(), "public", "templates");

const SITES = [
  {
    slug: "studio-signature",
    url: "https://maranathahomepage.vercel.app/",
    /* 히어로가 배경 영상이라 모션을 억제하면 검은 화면만 찍힙니다. */
    motion: true,
    wait: 9000,
    /* 히어로가 800px 에서 끝나고 그 아래는 흰 섹션이라, 경계를 살짝 안쪽에서 끊습니다. */
    heroHeight: 795,
  },
  { slug: "editorial-portrait", url: "https://hair-up-template-2.vercel.app/" },
  { slug: "elevate-studio", url: "https://hairup-template3.vercel.app/" },
];

fs.mkdirSync(OUT_DIR, { recursive: true });

/*
 * Playwright 기본 Chromium 은 H.264 코덱이 빠져 있어 배경 영상이 검게 찍힙니다.
 * 설치된 Chrome 이 있으면 그쪽을 씁니다.
 */
let browser;
try {
  browser = await chromium.launch({ channel: "chrome" });
} catch {
  console.warn("Chrome 을 못 찾아 기본 Chromium 으로 진행합니다.");
  browser = await chromium.launch();
}

for (const site of SITES) {
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 2,
    /* 진입 애니메이션이 끝난 정지 화면을 원하므로 기본은 모션을 줄여 요청합니다. */
    reducedMotion: site.motion ? "no-preference" : "reduce",
  });
  const page = await context.newPage();
  await page.goto(site.url, { waitUntil: "networkidle", timeout: 60000 });
  await page.evaluate(() => document.fonts.ready);
  /* 인트로/로더가 걷히고 히어로가 자리 잡을 시간을 줍니다. */
  await page.waitForTimeout(site.wait ?? 4000);
  if (!site.motion) {
    await page.evaluate(() =>
      document.getAnimations().forEach((a) => a.finish()),
    );
  }
  await page.waitForTimeout(500);

  const shot = await page.screenshot({
    clip: { x: 0, y: 0, ...VIEWPORT },
  });
  await context.close();

  const file = path.join(OUT_DIR, `${site.slug}.webp`);
  const { width, height } = await sharp(shot).metadata();
  await sharp(shot)
    .extract({
      left: 0,
      top: 0,
      width,
      height: Math.round(
        (height * (site.heroHeight ?? VIEWPORT.height)) / VIEWPORT.height,
      ),
    })
    .resize(1600, 1000, { fit: "cover" })
    .webp({ quality: 88 })
    .toFile(file);
  console.log(`${site.slug.padEnd(20)} ← ${site.url}`);
}

await browser.close();
