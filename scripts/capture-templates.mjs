/**
 * 07_Template Collection 카드에 들어갈 템플릿 대문 이미지를 캡처합니다.
 *
 *   node scripts/capture-templates.mjs
 *
 * 카드가 800 × 500(=1.6)이고 데스크톱 뷰포트 1440 × 900 도 같은 비율이라
 * 잘라내지 않고 2배 해상도로 찍은 뒤 1600 × 1000 으로 줄여 저장합니다.
 */
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
    viewport: { width: 1440, height: 900 },
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
    clip: { x: 0, y: 0, width: 1440, height: 900 },
  });
  await context.close();

  const file = path.join(OUT_DIR, `${site.slug}.webp`);
  await sharp(shot)
    .resize(1600, 1000, { fit: "cover" })
    .webp({ quality: 88 })
    .toFile(file);
  console.log(`${site.slug.padEnd(20)} ← ${site.url}`);
}

await browser.close();
