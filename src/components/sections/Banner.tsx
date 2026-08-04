import { Wordmark } from "@/components/brand/Wordmark";
import { Canvas } from "@/components/layout/Canvas";
import { banner } from "@/content/site";

/**
 * 04_Banner — 시안 06-D 지시사항
 *
 * .SECTION-BG   1440 × 675 (시안 표기 1441) · bg #000
 * .BANNER-TEXT  Playfair 22/400 · #FAF8F5 · uppercase
 *   24/7              left 120 · top 125
 *   INTELLIGENT AI    left 301 · top 263
 *   PRE - CONSULTANT  left 609 · top 399
 * .BANNER-LOGO  width 369 · height auto · fill #FAF8F5
 *               right 120 → left 951 · top 535
 */
const LINES = [
  { left: 120, top: 125 },
  { left: 301, top: 263 },
  { left: 609, top: 399 },
] as const;

const WORDMARK = { left: 951, top: 535, width: 369 };

export function Banner() {
  return (
    <Canvas id="banner" height={675} background="bg-black">
      {banner.lines.map((line, i) => (
        <p
          key={line}
          className="absolute whitespace-pre font-display text-[22px] font-normal uppercase leading-none text-porcelain"
          style={{
            left: `${LINES[i].left}px`,
            top: `${LINES[i].top}px`,
          }}
        >
          {line}
        </p>
      ))}

      {/* .BANNER-LOGO */}
      <div
        className="absolute text-porcelain"
        style={{ left: `${WORDMARK.left}px`, top: `${WORDMARK.top}px` }}
      >
        <Wordmark width={WORDMARK.width} />
      </div>
    </Canvas>
  );
}
