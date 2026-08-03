import { Wordmark } from "@/components/brand/Wordmark";
import { Canvas } from "@/components/layout/Canvas";
import { banner } from "@/content/site";

/**
 * 04_Banner — 아트보드 1440 × 675, 배경 순수 검정 #000000
 *
 * 시안에서 잰 잉크(글자 실제 픽셀) 기준 좌표
 *   24/7              x 121, y 120
 *   Intelligent AI    x 319, y 239
 *   Pre - Consultant  x 616, y 362
 *   워드마크          x 952, y 535, 367 × 138.8 (오른쪽 끝이 콘텐츠 우측선 1320 과 일치)
 *
 * 세 줄 모두 Playfair Display 27px / 600 인데 자간은 줄마다 다릅니다.
 * 시안에서 잰 줄별 잉크 폭(52 / 151 / 189px)에 맞춘 값이라 통일하면 어긋납니다.
 * 계단식 배치는 시안 그대로 고정이며 모션은 없습니다.
 */
const LINES = [
  { left: 120, top: 117, tracking: 1.4 },
  { left: 317, top: 236, tracking: -0.5 },
  { left: 614, top: 359, tracking: -1.1 },
] as const;

const WORDMARK = { left: 952, top: 535, width: 367 };

export function Banner() {
  return (
    <Canvas id="banner" height={675} background="bg-black">
      {banner.lines.map((line, i) => (
        <p
          key={line}
          className="absolute whitespace-pre font-display text-[27px] font-semibold leading-none text-porcelain"
          style={{
            left: `${LINES[i].left}px`,
            top: `${LINES[i].top}px`,
            letterSpacing: `${LINES[i].tracking}px`,
          }}
        >
          {line}
        </p>
      ))}

      <div
        className="absolute text-porcelain"
        style={{ left: `${WORDMARK.left}px`, top: `${WORDMARK.top}px` }}
      >
        <Wordmark width={WORDMARK.width} />
      </div>
    </Canvas>
  );
}
