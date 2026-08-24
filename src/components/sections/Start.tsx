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
 */
const BANNER_H = 650;
const EDGE = 30;
const HEIGHT = BANNER_H + EDGE;

export function Start() {
  return (
    <Canvas id="start" height={HEIGHT} background="bg-porcelain">
      <div className="CTA-BANNER">
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
