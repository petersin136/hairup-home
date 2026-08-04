import { Canvas } from "@/components/layout/Canvas";
import { RainInLines } from "@/components/motion/RainInLines";
import { DemoChat } from "@/components/sections/DemoChat";
import { experience } from "@/content/site";

/**
 * 03_The Experience — 시안 05-D 텍스트 좌표 유지
 *
 * .TITLE-EXPERIENCE / .SECTION-TITLE / .SECTION-DESC 는 기존 위치 고정
 * 왼쪽 600 폭 슬롯 안에 아이폰 목업을 세로·가로 가운데 배치
 *
 * 그리드: 120 거터 + 600 패널 + 120 간격 + 텍스트 + 120 거터
 * 상·하단 여백 동일 → 높이 148+768+148 = 1064
 */
const GUTTER = 120;
const PANEL = { left: GUTTER, top: 148, width: 600, height: 768 };
const HEIGHT = PANEL.top + PANEL.height + PANEL.top;

/** 아이폰 목업 외곽 (베젤 포함) — DemoChat 과 동일 */
const PHONE = { width: 302, height: 620 };

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

/** 왼쪽 패널 슬롯 한가운데 */
const PHONE_LEFT = PANEL.left + (PANEL.width - PHONE.width) / 2;
const PHONE_TOP = PANEL.top + (PANEL.height - PHONE.height) / 2;

export function Experience() {
  return (
    <Canvas id="experience" height={HEIGHT} background="bg-porcelain">
      {/* 아이폰 목업 — 왼쪽 600 슬롯 중앙 */}
      <div
        className="absolute"
        style={{
          left: `${PHONE_LEFT}px`,
          top: `${PHONE_TOP}px`,
        }}
      >
        <DemoChat />
      </div>

      {/* .TITLE-EXPERIENCE */}
      <p
        className="absolute inline-flex items-start font-display text-[25px] font-medium uppercase leading-none text-forest"
        style={{ left: `${TEXT_LEFT}px`, top: `${TITLE.top}px` }}
      >
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
