import { GlyphLines } from "@/components/copy/GlyphLines";
import { Canvas } from "@/components/layout/Canvas";
import { start } from "@/content/site";

/**
 * 11_CTA — 시안 CTA-BANNER
 *
 * .CTA-BANNER           1380 × 650 · radius 10 · 좌 30 · 우 30 · 하 30
 * .BOTTOM-BANNER-TITLE  Noto 40/600 · lh 1.375 · #FAF8F5
 * .BOTTOM-BANNER-DESC   Noto 17/400 · lh 1.588 · tracking -0.01em · rgba(250,248,245,0.8)
 *                       타이틀 글리프 ↔ 본문 글리프 36
 * .BOTTOM-BANNER-BTN    238 × 55 · #FAF8F5 · radius 4 · Noto 16/500 · #2C3A2E
 *                       본문 글리프 ↔ 버튼 55
 *                       hover bg #212D23 · color #FAF8F5
 *
 * 배경: 컨테이너 1380×650 과 1:1 인 1× / 2× PNG 원본 (scripts/build-cta-banner.mjs)
 * srcset 으로 DPR 에 맞는 장을 그대로 받아 브라우저 재샘플링을 없앰
 */
const BANNER_W = 1380;
const BANNER_H = 650;
const EDGE = 30;
const HEIGHT = BANNER_H + EDGE;
/** cache-bust — 배포 CDN이 옛 JPG 붙잡는 것 방지 */
const BG_VER = "20260831";

export function Start() {
  return (
    <Canvas id="start" height={HEIGHT} background="bg-porcelain">
      <div className="CTA-BANNER">
        <img
          src={`/images/cta-banner-bg-1x.png?v=${BG_VER}`}
          srcSet={`/images/cta-banner-bg-1x.png?v=${BG_VER} 1x, /images/cta-banner-bg-2x.png?v=${BG_VER} 2x`}
          alt=""
          width={BANNER_W}
          height={BANNER_H}
          decoding="async"
          fetchPriority="high"
          draggable={false}
          className="CTA-BANNER-BG"
        />
        <h2 className="BOTTOM-BANNER-TITLE text-kr">
          <GlyphLines lines={start.headline} />
        </h2>
        <p className="BOTTOM-BANNER-DESC text-kr">
          <GlyphLines lines={start.body} />
        </p>
        <a
          href={start.cta.href}
          target="_blank"
          rel="noopener noreferrer"
          className="BOTTOM-BANNER-BTN text-kr"
        >
          {start.cta.label}
        </a>
      </div>
    </Canvas>
  );
}
