"use client";

import { useRef } from "react";

import { Canvas } from "@/components/layout/Canvas";
import { RainInLines } from "@/components/motion/RainInLines";
import {
  DemoChat,
  type DemoChatHandle,
  IPHONE_MOCKUP,
} from "@/components/sections/DemoChat";
import { experience } from "@/content/site";

/**
 * 03_The Experience — 시안 05-D 텍스트 좌표 유지
 * 아이폰은 좌측 거터 · 세로 중앙보다 약간 아래
 */
const GUTTER = 120;
const PANEL = { left: GUTTER, top: 148, width: 600, height: 768 };
const HEIGHT = PANEL.top + PANEL.height + PANEL.top;

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
  lines: experience.body.length,
};

const DESC_BOTTOM =
  SECTION_DESC.top +
  SECTION_DESC.size * SECTION_DESC.leading * SECTION_DESC.lines;

const EXAMPLES_TOP = DESC_BOTTOM + 48;

const PHONE_LEFT = GUTTER;
/** 패널 중앙보다 36px 아래 */
const PHONE_TOP = PANEL.top + (PANEL.height - IPHONE_MOCKUP.height) / 2 + 36;

export function Experience() {
  const chatRef = useRef<DemoChatHandle>(null);

  return (
    <Canvas id="experience" height={HEIGHT} background="bg-porcelain">
      <div
        className="absolute"
        style={{
          left: `${PHONE_LEFT}px`,
          top: `${PHONE_TOP}px`,
        }}
      >
        <DemoChat ref={chatRef} />
      </div>

      <p
        className="absolute inline-flex items-start font-display text-[25px] font-medium uppercase leading-none text-forest"
        style={{ left: `${TEXT_LEFT}px`, top: `${TITLE.top}px` }}
      >
        <span className="mr-[6px] font-latin text-[14px] font-medium tracking-normal">
          {experience.eyebrow.index}
        </span>
        {experience.eyebrow.label}
      </p>

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

      <RainInLines
        lines={experience.body}
        className="text-kr absolute text-left text-[22px] font-normal tracking-[-0.01em] text-body"
        style={{
          left: `${TEXT_LEFT}px`,
          top: `${SECTION_DESC.top}px`,
          lineHeight: SECTION_DESC.leading,
        }}
      />

      {/* 예시 질문 — 본문 아래, 클릭 시 채팅으로 전송 */}
      <div
        className="absolute flex w-[440px] flex-col gap-3"
        style={{ left: `${TEXT_LEFT}px`, top: `${EXAMPLES_TOP}px` }}
      >
        <p className="font-display text-[13px] font-medium tracking-[0.08em] text-forest uppercase">
          Try asking
        </p>
        <ul className="flex flex-col gap-2.5">
          {experience.examples.map((q) => (
            <li key={q}>
              <button
                type="button"
                onClick={() => chatRef.current?.ask(q)}
                className="text-kr group text-left text-[16px] font-normal tracking-[-0.01em] text-body transition-colors hover:text-ink"
              >
                <span className="mr-2 text-forest/50">—</span>
                <span className="border-b border-transparent transition-[border-color] group-hover:border-ink/25">
                  {q}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </Canvas>
  );
}
