import Image from "next/image";

import { Canvas } from "@/components/layout/Canvas";
import { RainInLines } from "@/components/motion/RainInLines";
import { dilemma } from "@/content/site";

/**
 * The Dilemma — PC 시안
 *
 * padding-top 200 · tag→title 42 · title→desc 36
 * desc→center card 93 · center→bottom 170 · padding-bottom 170
 * 좌우 카드 여백 60 · center↔right 간격 70
 *
 * .DILEMMA-TAG          Playfair 13/500 · #2C3A2E · tracking 0.025em
 * .DILEMMA-TITLE        Noto 40/600 · lh 1.375 · #1C1A19
 * .DILEMMA-DESC         Noto 17/400 · lh 1.588 · tracking -0.01em · rgba(28,26,25,0.8)
 * .DILEMMA-BOTTOM-TEXT  Noto 24/500 · lh 1.5 · #1C1A19
 *
 * .CARD-ITEM-LEFT    300×385 · r 10 · left 60
 * .CARD-ITEM-CENTER  330×260 · r 10 · left 680
 * .CARD-ITEM-RIGHT   300×385 · r 10 · left 1080
 */
const TAG_TOP = 200;
const TITLE_TOP = 250; /* 태그 시각 아웃라인 아래 42 */
const TITLE_LEADING = 1.375;
const DESC_TOP = 381; /* 타이틀 시각 아웃라인 아래 36 */
const DESC_LEADING = 1.588;
const CENTER_TOP = 541; /* 본문 시각 아웃라인 아래 93 */
const BOTTOM_GAP = 170;
const BOTTOM_SIZE = 24;
const BOTTOM_LEADING = 1.5;
const BOTTOM_LINES = 2;
const PAD_BOTTOM = 170;

const BOXES = [
  {
    /* .CARD-ITEM-LEFT */
    left: 60,
    top: 363,
    width: 300,
    height: 385,
    src: dilemma.images[1],
  },
  {
    /* .CARD-ITEM-CENTER — 우측 60 · 카드 사이 70 → left 680 */
    left: 680,
    top: CENTER_TOP,
    width: 330,
    height: 260,
    src: dilemma.images[2],
  },
  {
    /* .CARD-ITEM-RIGHT */
    left: 1080,
    top: 262,
    width: 300,
    height: 385,
    src: dilemma.images[0],
  },
] as const;

const BOTTOM_TOP = CENTER_TOP + BOXES[1].height + BOTTOM_GAP;
const HEIGHT =
  BOTTOM_TOP + BOTTOM_SIZE * BOTTOM_LEADING * BOTTOM_LINES + PAD_BOTTOM;

export function Dilemma() {
  return (
    <Canvas id="dilemma" height={HEIGHT} background="bg-porcelain">
      {BOXES.map((box) => (
        <div
          key={box.src}
          className="absolute overflow-hidden bg-ink"
          style={{
            left: `${box.left}px`,
            top: `${box.top}px`,
            width: `${box.width}px`,
            height: `${box.height}px`,
            borderRadius: 10,
          }}
        >
          <Image
            src={box.src}
            alt=""
            fill
            sizes={`${box.width}px`}
            className="object-cover"
            priority={box.src === dilemma.images[0]}
            unoptimized
          />
        </div>
      ))}

      {/* .DILEMMA-TAG */}
      <p
        className="SECTION-TAG absolute inset-x-0 text-center text-forest"
        style={{ top: `${TAG_TOP}px` }}
      >
        {dilemma.tag}
      </p>

      {/* .DILEMMA-TITLE */}
      <h2
        className="text-kr absolute inset-x-0 text-center text-[40px] font-semibold text-ink"
        style={{
          top: `${TITLE_TOP}px`,
          lineHeight: TITLE_LEADING,
        }}
      >
        {dilemma.headline.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h2>

      {/* .DILEMMA-DESC */}
      <RainInLines
        lines={dilemma.bodyPc}
        className="text-kr absolute inset-x-0 text-center text-[17px] font-normal tracking-[-0.01em]"
        style={{
          top: `${DESC_TOP}px`,
          lineHeight: DESC_LEADING,
          color: "rgba(28, 26, 25, 0.8)",
        }}
      />

      {/* .DILEMMA-BOTTOM-TEXT */}
      <RainInLines
        lines={dilemma.bodyAside}
        className="text-kr absolute inset-x-0 text-center text-[24px] font-medium text-ink"
        style={{
          top: `${BOTTOM_TOP}px`,
          lineHeight: BOTTOM_LEADING,
        }}
      />
    </Canvas>
  );
}
