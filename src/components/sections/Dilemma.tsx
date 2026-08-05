import Image from "next/image";

import { Canvas } from "@/components/layout/Canvas";
import { RainInLines } from "@/components/motion/RainInLines";
import { dilemma } from "@/content/site";

/**
 * 02_The Dilemma — 시안 03-D 지시사항 (카드 좌표는 아트보드에서 재측정)
 *
 * .TITLE-DILEMMA  Playfair 25/500 · #2C3A2E · uppercase · flex center · top 300
 *   .SUB.01       Inter 14/500 · margin-right 6
 * .SECTION-TITLE  Noto 70/700 · #1C1A19 · lh 1.37 · center · gap 45
 * .SECTION-DESC   Noto 22/400 · #6C6864 · lh 1.64 · center · gap 65
 * .CARD-BOX       radius 6
 *   우상 332×378 · top 147 · 우측 끝(left 1108)
 *   좌중 369×282 · top 624 · left 0
 *   우하 468×307 · 본문 아래 184 · 우측 여백 120
 */
const RIGHT = 120;

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
  lines: dilemma.body.length,
};
/** 본문 두 덩어리 사이 (시안 빈 줄) */
const ASIDE_GAP = 50;
const SECTION_ASIDE = {
  top:
    SECTION_DESC.top +
    SECTION_DESC.size * SECTION_DESC.leading * SECTION_DESC.lines +
    ASIDE_GAP,
  lines: dilemma.bodyAside.length,
};
const DESC_BOTTOM =
  SECTION_ASIDE.top +
  SECTION_DESC.size * SECTION_DESC.leading * SECTION_ASIDE.lines;

const BOXES = [
  {
    /* 우상 — 가위 컷 · 아트보드 우측 끝 */
    left: 1108,
    top: 147,
    width: 332,
    height: 378,
  },
  {
    /* 좌중 — 작업대 클로즈업 · 본문 시작 높이 */
    left: 0,
    top: 624,
    width: 369,
    height: 282,
  },
  {
    /* 우하 — 살롱 · 시안 본문 아래 184 · 우측 120
       아트보드에서 잰 top 1005 (DESC_BOTTOM+184 체인과 ±1줄 차이) */
    left: 1440 - RIGHT - 468,
    top: 1005,
    width: 468,
    height: 307,
  },
] as const;

const FLOATS = {
  smart: { left: 120, top: 1033 },
  realtime: { left: 279, top: 1320 },
  zero: { left: 362, top: 1370 },
  /* 시안 잉크 박스 x≈612–719 · 대각선 캐스케이드 끝 (우측 끝 아님) */
  solution: { left: 612, top: 1468 },
} as const;

const FLOAT_COLOR = {
  smart: "rgba(44, 58, 46, 0.55)",
  realtime: "rgba(44, 58, 46, 0.25)",
  zero: "rgba(44, 58, 46, 0.35)",
  solution: "rgba(44, 58, 46, 0.55)",
} as const;

const HEIGHT = Math.max(
  BOXES[2].top + BOXES[2].height + 120,
  FLOATS.solution.top + 80,
);

export function Dilemma() {
  return (
    <Canvas id="dilemma" height={HEIGHT} background="bg-porcelain">
      {BOXES.map((box, i) => (
        <div
          key={`${box.left}-${box.top}`}
          className="rounded-ui absolute overflow-hidden bg-ink"
          style={{
            left: `${box.left}px`,
            top: `${box.top}px`,
            width: `${box.width}px`,
            height: `${box.height}px`,
          }}
        >
          <Image
            src={dilemma.images[i]}
            alt=""
            fill
            sizes={`${box.width}px`}
            className="object-cover"
            priority={i === 0}
          />
        </div>
      ))}

      {/* .TITLE-DILEMMA */}
      <p
        className="absolute inset-x-0 flex items-start justify-center font-display text-[25px] font-medium uppercase leading-none text-forest"
        style={{ top: `${TITLE.top}px` }}
      >
        <span className="mr-[6px] font-latin text-[14px] font-medium tracking-normal">
          {dilemma.eyebrow.index}
        </span>
        {dilemma.eyebrow.label}
      </p>

      {/* .SECTION-TITLE */}
      <h2
        className="text-kr absolute inset-x-0 text-center text-[70px] font-bold tracking-[-0.01em] text-ink"
        style={{
          top: `${SECTION_TITLE.top}px`,
          lineHeight: SECTION_TITLE.leading,
        }}
      >
        {dilemma.headline.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h2>

      {/* .SECTION-DESC */}
      <RainInLines
        lines={dilemma.body}
        className="text-kr absolute inset-x-0 text-center text-[22px] font-normal tracking-[-0.01em] text-body"
        style={{
          top: `${SECTION_DESC.top}px`,
          lineHeight: SECTION_DESC.leading,
        }}
      />

      <RainInLines
        lines={dilemma.bodyAside}
        className="text-kr absolute inset-x-0 text-center text-[22px] font-normal tracking-[-0.01em] text-body"
        style={{
          top: `${SECTION_ASIDE.top}px`,
          lineHeight: SECTION_DESC.leading,
        }}
      />

      <p
        className="absolute inline-flex items-start font-display text-[21px] font-normal uppercase leading-none"
        style={{
          left: `${FLOATS.smart.left}px`,
          top: `${FLOATS.smart.top}px`,
          color: FLOAT_COLOR.smart,
        }}
      >
        <span className="mr-[6px] font-latin text-[12px] font-normal normal-case">
          {dilemma.floats.smart.sub}
        </span>
        {dilemma.floats.smart.label}
      </p>

      <p
        className="absolute inline-flex items-start font-display text-[21px] font-normal uppercase leading-none"
        style={{
          left: `${FLOATS.realtime.left}px`,
          top: `${FLOATS.realtime.top}px`,
          color: FLOAT_COLOR.realtime,
        }}
      >
        <span className="mr-[6px] font-latin text-[12px] font-normal normal-case">
          {dilemma.floats.realtime.sub}
        </span>
        {dilemma.floats.realtime.label}
      </p>

      <p
        className="absolute inline-flex items-start font-display text-[21px] font-normal uppercase leading-none"
        style={{
          left: `${FLOATS.zero.left}px`,
          top: `${FLOATS.zero.top}px`,
          color: FLOAT_COLOR.zero,
        }}
      >
        <span className="mr-[6px] font-latin text-[12px] font-normal normal-case">
          {dilemma.floats.zero.sub}
        </span>
        {dilemma.floats.zero.label}
      </p>

      {/* .TITLE-SOLUTION — Playfair 21/400 · text-align right · 캐스케이드 left 612 */}
      <p
        className="absolute font-display text-[21px] font-normal uppercase leading-none"
        style={{
          left: `${FLOATS.solution.left}px`,
          top: `${FLOATS.solution.top}px`,
          color: FLOAT_COLOR.solution,
          textAlign: "right",
        }}
      >
        {dilemma.floats.solution}
      </p>
    </Canvas>
  );
}
