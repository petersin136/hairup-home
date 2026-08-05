"use client";

import { useRef } from "react";

import { Canvas } from "@/components/layout/Canvas";
import { RainInLines } from "@/components/motion/RainInLines";
import { keyBenefits } from "@/content/site";

/**
 * 05_Key Benefits — 시안 07-D · 08-D · 09-D
 * 카드는 시안(500×360)보다 약간 키우고, 트랙은 뷰포트 기준 가운데 정렬.
 */
const TITLE = { top: 300, size: 25 };
const SECTION_TITLE = {
  top: TITLE.top + TITLE.size + 45,
  size: 70,
  leading: 1.37,
  lines: 2,
};
const SECTION_DESC = {
  top:
    SECTION_TITLE.top +
    SECTION_TITLE.size * SECTION_TITLE.leading * SECTION_TITLE.lines +
    65,
  size: 22,
  leading: 1.64,
  lines: keyBenefits.body.length,
};

/** 시안 500×360 · gap 33 → 살짝 키움 */
const CARD = { width: 540, height: 390, gap: 36 };
const CARD_TITLE = { size: 32, leading: 1.44, lines: 2, gapAbove: 45 };
const CARD_DESC = {
  size: 19,
  leading: 1.63,
  lines: 3,
  gapAbove: 36,
  color: "#6C6B64",
};

const DESC_BOTTOM =
  SECTION_DESC.top +
  SECTION_DESC.size * SECTION_DESC.leading * SECTION_DESC.lines;

const TRACK_TOP = DESC_BOTTOM + 150;

const TRACK_HEIGHT =
  CARD.height +
  CARD_TITLE.gapAbove +
  CARD_TITLE.size * CARD_TITLE.leading * CARD_TITLE.lines +
  CARD_DESC.gapAbove +
  CARD_DESC.size * CARD_DESC.leading * CARD_DESC.lines;

const HEIGHT = Math.ceil(TRACK_TOP + TRACK_HEIGHT + 120);

/** 첫 화면에서 카드 2장이 가운데 오도록 하는 한쪽 패딩 */
const PAIR = CARD.width * 2 + CARD.gap;
const SIDE_PAD = `max(80px, calc(50% - ${PAIR / 2}px))`;

export function KeyBenefits() {
  const track = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; left: number } | null>(null);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = track.current;
    if (!el) return;
    drag.current = { x: e.clientX, left: el.scrollLeft };
    el.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = track.current;
    if (!el || !drag.current) return;
    el.scrollLeft = drag.current.left - (e.clientX - drag.current.x);
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    drag.current = null;
    track.current?.releasePointerCapture(e.pointerId);
  };

  return (
    <Canvas
      id="key-benefits"
      height={HEIGHT}
      background="bg-porcelain"
      bleed={
        <div
          ref={track}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className="absolute inset-x-0 flex cursor-grab overflow-x-auto overscroll-x-contain [scrollbar-width:none] active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
          style={{
            top: `${TRACK_TOP}px`,
            height: `${TRACK_HEIGHT}px`,
            gap: `${CARD.gap}px`,
            paddingLeft: SIDE_PAD,
            paddingRight: SIDE_PAD,
          }}
        >
          {keyBenefits.cards.map((card, i) => (
            <article
              key={card.title.join("-")}
              data-card={i}
              className="relative shrink-0 select-none"
              style={{ width: `${CARD.width}px` }}
            >
              <div
                className="rounded-ui bg-black"
                style={{ height: `${CARD.height}px` }}
              />
              <h3
                className="text-kr text-left text-[32px] font-semibold tracking-[-0.4px] text-forest"
                style={{
                  marginTop: `${CARD_TITLE.gapAbove}px`,
                  lineHeight: CARD_TITLE.leading,
                }}
              >
                {card.title.map((line) => (
                  <span key={line} className="block whitespace-pre">
                    {line}
                  </span>
                ))}
              </h3>
              <p
                className="text-kr text-left text-[19px] font-normal tracking-[-0.01em]"
                style={{
                  marginTop: `${CARD_DESC.gapAbove}px`,
                  lineHeight: CARD_DESC.leading,
                  color: CARD_DESC.color,
                }}
              >
                {card.body.map((line) => (
                  <span key={line} className="block whitespace-pre">
                    {line}
                  </span>
                ))}
              </p>
            </article>
          ))}
        </div>
      }
    >
      <p
        className="absolute inset-x-0 flex items-start justify-center font-display text-[25px] font-medium uppercase leading-none text-forest"
        style={{ top: `${TITLE.top}px` }}
      >
        <span className="mr-[6px] font-latin text-[14px] font-medium tracking-normal">
          {keyBenefits.eyebrow.index}
        </span>
        {keyBenefits.eyebrow.label}
      </p>

      <h2
        className="text-kr absolute inset-x-0 text-center text-[70px] font-bold tracking-[-0.01em] text-ink"
        style={{
          top: `${SECTION_TITLE.top}px`,
          lineHeight: SECTION_TITLE.leading,
        }}
      >
        {keyBenefits.headline.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h2>

      <RainInLines
        lines={keyBenefits.body}
        className="text-kr absolute inset-x-0 text-center text-[22px] font-normal tracking-[-0.01em] text-body"
        style={{
          top: `${SECTION_DESC.top}px`,
          lineHeight: SECTION_DESC.leading,
        }}
      />
    </Canvas>
  );
}
