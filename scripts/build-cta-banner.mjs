/**
 * CTA-BANNER 배경 에셋 빌드
 *
 * 컨테이너 규격(.CTA-BANNER 1380 × 650)과 1:1 로 맞는 1× / 2× 를 만듭니다.
 * fit: cover — 균일 배율이므로 가로/세로 왜곡이 없습니다.
 * 인코딩은 무손실(WebP lossless / PNG)로만. 노이즈 텍스처가 양자화로 뭉치지 않게.
 *
 * 실행: node scripts/build-cta-banner.mjs
 */
import { statSync } from "node:fs";

import sharp from "sharp";

const SRC = "public/images/cta-banner-bg.jpg";
const OUT = "public/images/";

/** .CTA-BANNER 의 CSS 픽셀 규격 */
const BOX = { width: 1380, height: 650 };

const TARGETS = [
  { name: "cta-banner-bg-1x", scale: 1 },
  { name: "cta-banner-bg-2x", scale: 2 },
];

const src = sharp(SRC);
const meta = await src.metadata();
console.log(`source  ${meta.width}×${meta.height} ${meta.format}`);
console.log(`box     ${BOX.width}×${BOX.height} (ratio ${(BOX.width / BOX.height).toFixed(4)})`);

for (const { name, scale } of TARGETS) {
  const width = BOX.width * scale;
  const height = BOX.height * scale;

  const resized = sharp(SRC).resize(width, height, {
    kernel: "lanczos3",
    fit: "cover",
    position: "centre",
  });

  const webp = `${OUT}${name}.webp`;
  await resized.clone().webp({ lossless: true, effort: 6 }).toFile(webp);

  const png = `${OUT}${name}.png`;
  await resized.clone().png({ compressionLevel: 9 }).toFile(png);

  const kb = (p) => (statSync(p).size / 1024).toFixed(0);
  console.log(
    `${scale}×      ${width}×${height} webp lossless ${kb(webp)}KB · png ${kb(png)}KB`,
  );
}
