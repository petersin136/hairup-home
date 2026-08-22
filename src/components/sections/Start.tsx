import { Canvas } from "@/components/layout/Canvas";
import { RainInLines } from "@/components/motion/RainInLines";
import { start } from "@/content/site";

/**
 * 11_CTA — 시안 10-D · 11-D · 1-D(CTA_BG_IMG)
 *
 * .SECTION-BG    1440 × 1297 · 배경 이미지 cover
 * 패딩 상 150 · 하 ≈ CTA 아래 여백
 *
 * .BANNER-TEXT-ITEM  Playfair 22/400 · #FAF8F5 · lh 1.3 · tracking 0.01em
 *   BESPOKE          left 120 · top 150 · opacity 50%
 *   1:1 setup        left 422 · top 418 · opacity 80%
 *   SMART ASSISTANT  left 721 · top 512 · opacity 60%
 *   HAIR UP AI       right 120 · top 726 · opacity 100%
 *
 * .SECTION-TITLE Noto 70/700 · #FAF8F5 · lh 1.37 · left 120 · top 726
 * .SECTION-DESC  Noto 22/400 · rgba(250,248,245,0.7) · lh 1.64 · gap 65
 * .BTN-CONSULT   230 × 55 · Noto 17/500 · border #FAF8F5 · radius 2 · gap 70
 */
const HEIGHT = 1297;
const GUTTER = 120;

const BG = "/images/cta-bg.jpg";

const SECTION_TITLE = {
  left: GUTTER,
  top: 726,
  size: 70,
  leading: 1.37,
  lines: 2,
};

const SECTION_DESC = {
  left: GUTTER,
  top:
    SECTION_TITLE.top +
    SECTION_TITLE.size * SECTION_TITLE.leading * SECTION_TITLE.lines +
    65,
  size: 22,
  leading: 1.64,
  lines: start.body.length,
};

const CTA = {
  left: GUTTER,
  top:
    SECTION_DESC.top +
    SECTION_DESC.size * SECTION_DESC.leading * SECTION_DESC.lines +
    70,
  width: 230,
  height: 55,
};

export function Start() {
  return (
    <Canvas
      id="start"
      height={HEIGHT}
      background="bg-black"
      backgroundImage={BG}
    >
      {start.floats.map((item) => {
        const isRight = item.align === "right";
        return (
          <p
            key={item.text}
            className={`absolute whitespace-pre font-display text-[22px] font-normal text-porcelain${"lowercase" in item && item.lowercase ? "" : " uppercase"}`}
            style={{
              top: `${item.top}px`,
              left: isRight ? undefined : `${item.left}px`,
              right: isRight ? `${item.right}px` : undefined,
              textAlign: item.align,
              lineHeight: 1.3,
              letterSpacing: "0.01em",
              opacity: item.opacity,
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

      {/* .SECTION-DESC — rgba(250,248,245,0.7) */}
      <RainInLines
        lines={start.body}
        className="text-kr absolute text-left text-[22px] font-normal tracking-[-0.01em]"
        style={{
          left: `${SECTION_DESC.left}px`,
          top: `${SECTION_DESC.top}px`,
          lineHeight: SECTION_DESC.leading,
          color: "rgba(250, 248, 245, 0.7)",
        }}
      />

      {/* .BTN-CONSULT */}
      <a
        href={start.cta.href}
        target="_blank"
        rel="noopener noreferrer"
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
