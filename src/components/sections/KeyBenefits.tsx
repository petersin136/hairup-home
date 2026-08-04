"use client";

import { useRef } from "react";

import { Canvas } from "@/components/layout/Canvas";
import { RainInLines } from "@/components/motion/RainInLines";
import { keyBenefits } from "@/content/site";

/**
 * 05_Key Benefits — 시안 07-D · 08-D · 09-D
 *
 * .TITLE-KEY-BENEFITS Playfair 25/500 · #2C3A2E · uppercase · flex center
 *   .SUB.03/          Inter 14/500 · margin-right 6
 * .SECTION-TITLE      Noto 70/700 · #1C1A19 · lh 1.37 · center · gap 45
 * .SECTION-DESC       Noto 22/400 · #6C6864 · lh 1.64 · center · gap 65
 *
 * .CARD-BOX    500 × 360 · radius 6 · left 120 · gap 33 · 본문 아래 150
 * .CARD-TITLE  Noto 32/600 · #2C3A2E · lh 1.44 · left · 박스 아래 45
 * .CARD-DESC   Noto 19/400 · #6C6B64 · lh 1.63 · left · 제목 아래 36
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

const GUTTER = 120;
const CARD = { width: 500, height: 360, gap: 33 };
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

const TRACK = {
  left: GUTTER,
  top: DESC_BOTTOM + 150,
  width: 1440 - GUTTER,
};

const TRACK_HEIGHT =
  CARD.height +
  CARD_TITLE.gapAbove +
  CARD_TITLE.size * CARD_TITLE.leading * CARD_TITLE.lines +
  CARD_DESC.gapAbove +
  CARD_DESC.size * CARD_DESC.leading * CARD_DESC.lines;

const HEIGHT = Math.ceil(TRACK.top + TRACK_HEIGHT + 120);

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
    <Canvas id="key-benefits" height={HEIGHT} background="bg-cream">
      {/* .TITLE-KEY-BENEFITS */}
      <p
        className="absolute inset-x-0 flex items-start justify-center font-display text-[25px] font-medium uppercase leading-none text-forest"
        style={{ top: `${TITLE.top}px` }}
      >
        {/* .TITLE-KEY-BENEFITS .SUB.03/ */}
        <span className="mr-[6px] font-latin text-[14px] font-medium tracking-normal">
          {keyBenefits.eyebrow.index}
        </span>
        {keyBenefits.eyebrow.label}
      </p>

      {/* .SECTION-TITLE */}
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

      {/* .SECTION-DESC */}
      <RainInLines
        lines={keyBenefits.body}
        className="text-kr absolute inset-x-0 text-center text-[22px] font-normal tracking-[-0.01em] text-body"
        style={{
          top: `${SECTION_DESC.top}px`,
          lineHeight: SECTION_DESC.leading,
        }}
      />

      <div
        ref={track}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className="absolute flex cursor-grab overflow-x-auto overscroll-x-contain [scrollbar-width:none] active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
        style={{
          left: `${TRACK.left}px`,
          top: `${TRACK.top}px`,
          width: `${TRACK.width}px`,
          height: `${TRACK_HEIGHT}px`,
          gap: `${CARD.gap}px`,
        }}
      >
        {keyBenefits.cards.map((card, i) => (
          <article
            key={card.title.join("-")}
            data-card={i}
            className="relative shrink-0 select-none"
            style={{ width: `${CARD.width}px` }}
          >
            {/* .CARD-BOX */}
            <div
              className="rounded-ui bg-black"
              style={{ height: `${CARD.height}px` }}
            />
            {/* .CARD-TITLE */}
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
            {/* .CARD-DESC */}
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
    </Canvas>
  );
}
