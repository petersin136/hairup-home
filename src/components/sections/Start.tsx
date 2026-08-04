import { Canvas } from "@/components/layout/Canvas";
import { RainInLines } from "@/components/motion/RainInLines";
import { start } from "@/content/site";

/**
 * 11_CTA — 시안 10-D · 11-D 지시사항
 *
 * 패딩 상·하 150 · 좌·우 120
 *
 * .BANNER-TEXT-ITEM  Playfair 22/400 · #FAF8F5 · uppercase · lh 1.3 · tracking 0.01em
 *   BESPOKE          좌측정렬 · left 120 · top 150
 *   1:1 SETUP        가운데정렬
 *   SMART ASSISTANT  가운데정렬
 *   HAIR UP AI       우측정렬 · right 120
 *
 * .SECTION-TITLE Noto 70/700 · #FAF8F5 · lh 1.37 · left · gap 65
 * .SECTION-DESC  Noto 22/400 · #6C6864 · lh 1.64 · left · gap 70
 * .BTN-CONSULT   230 × 55 · Noto 17/500 · border #FAF8F5 · radius 2
 *                하단 여백 150
 */
const HEIGHT = 1297;
const GUTTER = 120;
const PAD_Y = 150;

const CTA = {
  left: GUTTER,
  top: HEIGHT - PAD_Y - 55,
  width: 230,
  height: 55,
};

const SECTION_DESC = {
  left: GUTTER,
  size: 22,
  leading: 1.64,
  lines: start.body.length,
  top:
    CTA.top -
    70 -
    22 * 1.64 * start.body.length,
};

const SECTION_TITLE = {
  left: GUTTER,
  size: 70,
  leading: 1.37,
  lines: 2,
  top:
    SECTION_DESC.top -
    65 -
    70 * 1.37 * 2,
};

export function Start() {
  return (
    <Canvas id="start" height={HEIGHT} background="bg-black">
      {start.floats.map((item) => {
        const isRight = item.align === "right";
        return (
          <p
            key={item.text}
            className="absolute whitespace-pre font-display text-[22px] font-normal uppercase text-porcelain"
            style={{
              top: `${item.top}px`,
              left: isRight ? undefined : `${item.left}px`,
              right: isRight ? `${item.right}px` : undefined,
              textAlign: item.align,
              lineHeight: 1.3,
              letterSpacing: "0.01em",
            }}
          >
            {item.text}
          </p>
        );
      })}

      {/* .SECTION-TITLE */}
      <h2
        className="text-kr absolute text-left text-[70px] font-bold tracking-[-0.01em] text-porcelain"
        style={{
          left: `${SECTION_TITLE.left}px`,
          top: `${SECTION_TITLE.top}px`,
          lineHeight: SECTION_TITLE.leading,
        }}
      >
        {start.headline.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h2>

      {/* .SECTION-DESC */}
      <RainInLines
        lines={start.body}
        className="text-kr absolute text-left text-[22px] font-normal tracking-[-0.01em] text-body"
        style={{
          left: `${SECTION_DESC.left}px`,
          top: `${SECTION_DESC.top}px`,
          lineHeight: SECTION_DESC.leading,
        }}
      />

      {/* .BTN-CONSULT */}
      <a
        href={start.cta.href}
        data-cta-btn
        className="rounded-btn text-kr absolute inline-flex items-center justify-center border border-porcelain bg-transparent text-[17px] font-medium tracking-[-0.01em] text-porcelain transition-all duration-200 ease-in-out hover:bg-porcelain hover:text-ink"
        style={{
          left: `${CTA.left}px`,
          top: `${CTA.top}px`,
          width: `${CTA.width}px`,
          height: `${CTA.height}px`,
        }}
      >
        {start.cta.label}
      </a>
    </Canvas>
  );
}
