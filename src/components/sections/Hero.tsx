import { Canvas } from "@/components/layout/Canvas";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { hero } from "@/content/site";

/**
 * 01_Hero — 아트보드 1440 × 836, 배경 #f6ecdf
 *
 * 시안에서 잰 잉크(글자 실제 픽셀) 기준 좌표
 *   아이브로우  x 119, y 390 → 410
 *   H1          x 119, 1행 y 455 / 2행 y 551 (베이스라인 간격 96px)
 *   본문        x 120, 1행 y 676 (행간 36px)
 *
 * left/top 은 위 잉크 좌표가 정확히 나오도록 스크린샷 대조로 맞춘 박스 좌표입니다.
 * 시안 폰트(Noto Sans CJK KR)와 웹폰트의 사이드베어링 차이만큼 120px 에서 어긋납니다.
 */
const EYEBROW = { left: 118, top: 386 };
const HEADLINE = { left: 117, top: 436 };
const BODY = { left: 119, top: 666 };

export function Hero() {
  return (
    <Canvas id="hero" height={836} background="bg-cream">
      <SiteHeader />

      <p
        className="absolute whitespace-pre font-display text-[27px] font-medium leading-none tracking-[-0.75px] text-forest"
        style={{ left: `${EYEBROW.left}px`, top: `${EYEBROW.top}px` }}
      >
        {hero.eyebrow}
      </p>

      <h1
        className="text-kr absolute text-[70px] font-bold leading-[96px] tracking-[-0.01em] text-ink"
        style={{ left: `${HEADLINE.left}px`, top: `${HEADLINE.top}px` }}
      >
        {hero.headline.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h1>

      <p
        className="text-kr absolute text-[22px] font-normal leading-[36px] tracking-[-0.01em] text-body"
        style={{ left: `${BODY.left}px`, top: `${BODY.top}px` }}
      >
        {hero.body.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </p>
    </Canvas>
  );
}
