import { SiteHeader } from "@/components/layout/SiteHeader";
import { RainInLines } from "@/components/motion/RainInLines";
import { HeroVisualVideo } from "@/components/sections/HeroVisualVideo";
import { hero } from "@/content/site";

/**
 * 01_Hero — 시안 02-D 지시사항
 *
 * 텍스트 영역 배경 #FAF8F5
 *   .SUB-TITLE  Playfair 26/500 · #2C3A2E · uppercase · top 300
 *   .MAIN-TITLE Noto 70/700 · #1C1A19 · line-height 1.37 · gap 45
 *   .DESC       Noto 22/400 · #6C6864 · line-height 1.64 · gap 65
 * 비주얼 영역   width 100% · max-width 1440 · height 800 · gap 65
 */
const GUTTER = 120;

const SUB = { top: 300, size: 26 };
const MAIN = {
  top: SUB.top + SUB.size + 45,
  size: 70,
  leading: 1.37,
  lines: 2,
};
const DESC = {
  top: MAIN.top + MAIN.size * MAIN.leading * MAIN.lines + 65,
  size: 22,
  leading: 1.64,
  lines: 3,
};
const VISUAL = {
  top: DESC.top + DESC.size * DESC.leading * DESC.lines + 65,
  height: 800,
};

const TEXT_HEIGHT = VISUAL.top;

export function Hero() {
  return (
    <section id="hero" className="relative w-full bg-porcelain">
      <div
        className="relative mx-auto w-[1440px]"
        style={{ height: `${TEXT_HEIGHT}px` }}
      >
        <SiteHeader />

        {/* .SUB-TITLE */}
        <p
          className="absolute font-display text-[26px] font-medium uppercase leading-none text-forest"
          style={{ left: `${GUTTER}px`, top: `${SUB.top}px` }}
        >
          {hero.eyebrow}
        </p>

        {/* .MAIN-TITLE */}
        <h1
          className="text-kr absolute text-[70px] font-bold tracking-[-0.01em] text-ink"
          style={{
            left: `${GUTTER}px`,
            top: `${MAIN.top}px`,
            lineHeight: MAIN.leading,
          }}
        >
          {hero.headline.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>

        {/* .DESC */}
        <RainInLines
          lines={hero.body}
          className="text-kr absolute text-[22px] font-normal tracking-[-0.01em] text-body"
          style={{
            left: `${GUTTER}px`,
            top: `${DESC.top}px`,
            lineHeight: DESC.leading,
          }}
        />
      </div>

      {/* 4. 비주얼 영역 .VISUAL-IMG — 로컬 영상 테스트 */}
      <div
        className="relative mx-auto w-full max-w-[1440px] overflow-hidden bg-black"
        style={{ height: `${VISUAL.height}px` }}
        data-hero-visual
        aria-label="비주얼 영상 영역"
      >
        <HeroVisualVideo src="/videos/hero-visual.mp4" rate={0.5} />
        {/* 고급 톤 — 살짝 따뜻한 다크 오버레이 + 가장자리 비네트 */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(20,18,16,0.28) 0%, rgba(20,18,16,0.18) 45%, rgba(20,18,16,0.42) 100%), radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.45) 100%)",
          }}
          aria-hidden
        />
      </div>
    </section>
  );
}
