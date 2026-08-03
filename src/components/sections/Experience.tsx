import { Canvas } from "@/components/layout/Canvas";
import { experience } from "@/content/site";

/**
 * 03_Test — 아트보드 1440 × 1216, 배경 #f6ecdf
 *
 * 그리드는 히어로와 같습니다. 120 거터 + 600 패널 + 120 간격 + 480 텍스트 + 120 거터.
 *
 * 시안에서 잰 잉크(글자 실제 픽셀) 기준 좌표
 *   패널        x 120, y 148, 600 × 768, radius 6
 *   아이브로우  x 844, 큰 글자 베이스라인 y 182 / 작은 글자 베이스라인 y 175
 *   H2          x 843, 1행 y 228 (행간 96px)
 *   본문        x 844, 1행 y 544 (행간 36px)
 *
 * 타입 스케일은 히어로와 완전히 동일합니다(잉크 높이 74/66/21px, 행간 96/36px).
 * left/top 은 위 잉크 좌표가 나오도록 스크린샷 대조로 맞춘 박스 좌표입니다.
 */
const PANEL = { left: 120, top: 148, width: 600, height: 768 };
const EYEBROW = { left: 843, top: 159 };
const HEADLINE = { left: 841, top: 209 };
const BODY = { left: 842, top: 535 };

/** 작은 "02 /" 는 큰 글자보다 베이스라인이 7px 위에 있습니다. */
const INDEX_RISE = 7;

export function Experience() {
  return (
    <Canvas id="experience" height={1216} background="bg-cream">
      <div
        className="absolute rounded-[6px] bg-ink"
        style={{
          left: `${PANEL.left}px`,
          top: `${PANEL.top}px`,
          width: `${PANEL.width}px`,
          height: `${PANEL.height}px`,
        }}
      />

      <p
        className="absolute whitespace-pre font-display text-[27px] font-semibold leading-none tracking-[-1.2px] text-forest"
        style={{ left: `${EYEBROW.left}px`, top: `${EYEBROW.top}px` }}
      >
        <span
          className="relative font-latin text-[16px] font-semibold tracking-[0.65px]"
          style={{ top: `-${INDEX_RISE}px` }}
        >
          {experience.eyebrow.index}{" "}
        </span>
        {experience.eyebrow.label}
      </p>

      <h2
        className="text-kr absolute text-[70px] font-bold leading-[96px] tracking-[-0.01em] text-ink"
        style={{ left: `${HEADLINE.left}px`, top: `${HEADLINE.top}px` }}
      >
        {experience.headline.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h2>

      <p
        className="text-kr absolute text-[22px] font-normal leading-[36px] tracking-[-0.01em] text-body"
        style={{ left: `${BODY.left}px`, top: `${BODY.top}px` }}
      >
        {experience.body.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </p>
    </Canvas>
  );
}
