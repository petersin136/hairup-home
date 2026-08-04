import { Canvas } from "@/components/layout/Canvas";
import { RainInLines } from "@/components/motion/RainInLines";
import { DemoChat } from "@/components/sections/DemoChat";
import { experience } from "@/content/site";

/**
 * 03_The Experience — 시안 05-D 지시사항
 *
 * .CARD-BOX         600 × 768 · radius 6 · left 120 — 데모 채팅 UI
 * .TITLE-EXPERIENCE Playfair 25/500 · #2C3A2E · uppercase · inline-flex
 *   .SUB.02/        Inter 14/500 · margin-right 6
 * .SECTION-TITLE    Noto 70/700 · #1C1A19 · line-height 1.37 · left · gap 45
 * .SECTION-DESC     Noto 22/400 · #6C6864 · line-height 1.64 · left · gap 65
 *
 * 그리드: 120 거터 + 600 패널 + 120 간격 + 텍스트 + 120 거터
 * 상·하단 여백 동일 → 높이 148+768+148 = 1064
 */
const GUTTER = 120;
const PANEL = { left: GUTTER, top: 148, width: 600, height: 768 };
const HEIGHT = PANEL.top + PANEL.height + PANEL.top;

/** 텍스트 열 시작: 패널 오른쪽 + 120 간격 */
const TEXT_LEFT = PANEL.left + PANEL.width + GUTTER;

const TITLE = { top: 159, size: 25 };
const SECTION_TITLE = {
  top: TITLE.top + TITLE.size + 45,
  size: 70,
  leading: 1.37,
  lines: 3,
};
const SECTION_DESC = {
  top:
    SECTION_TITLE.top +
    SECTION_TITLE.size * SECTION_TITLE.leading * SECTION_TITLE.lines +
    65,
  size: 22,
  leading: 1.64,
};

export function Experience() {
  return (
    <Canvas id="experience" height={HEIGHT} background="bg-paper">
      {/* .CARD-BOX — 카카오톡 느낌의 데모 채팅 */}
      <div
        className="rounded-ui absolute overflow-hidden bg-ink"
        style={{
          left: `${PANEL.left}px`,
          top: `${PANEL.top}px`,
          width: `${PANEL.width}px`,
          height: `${PANEL.height}px`,
        }}
      >
        <DemoChat />
      </div>

      {/* .TITLE-EXPERIENCE */}
      <p
        className="absolute inline-flex items-start font-display text-[25px] font-medium uppercase leading-none text-forest"
        style={{ left: `${TEXT_LEFT}px`, top: `${TITLE.top}px` }}
      >
        {/* .TITLE-EXPERIENCE .SUB.02/ */}
        <span className="mr-[6px] font-latin text-[14px] font-medium tracking-normal">
          {experience.eyebrow.index}
        </span>
        {experience.eyebrow.label}
      </p>

      {/* .SECTION-TITLE */}
      <h2
        className="text-kr absolute text-left text-[70px] font-bold tracking-[-0.01em] text-ink"
        style={{
          left: `${TEXT_LEFT}px`,
          top: `${SECTION_TITLE.top}px`,
          lineHeight: SECTION_TITLE.leading,
        }}
      >
        {experience.headline.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h2>

      {/* .SECTION-DESC */}
      <RainInLines
        lines={experience.body}
        className="text-kr absolute text-left text-[22px] font-normal tracking-[-0.01em] text-body"
        style={{
          left: `${TEXT_LEFT}px`,
          top: `${SECTION_DESC.top}px`,
          lineHeight: SECTION_DESC.leading,
        }}
      />
    </Canvas>
  );
}
