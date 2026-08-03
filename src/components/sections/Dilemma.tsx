import { Canvas } from "@/components/layout/Canvas";
import { dilemma } from "@/content/site";

/**
 * 02_The Dilemma — 아트보드 1440 × 1423, 배경 #f9f8f4
 *
 * 시안이 550×1024 결합본(Dilemma+Experience)으로 와서 배율 2.618 로 역산했습니다.
 * ±수 px 오차가 남아 있습니다. Experience 는 네이티브 1440 시안으로 이미 맞춰
 * 두었고, 이 섹션만 새로 올립니다.
 *
 * 시안 상단 여백(박스 기준 149)이 히어로 하단(62)보다 넓어, 경계가 어색하다는
 * 피드백으로 전체를 87 올려 상단을 62 로 맞췄습니다. (HEIGHT 도 같이 87 줄임)
 *
 * 시안에서 잰 잉크 좌표(1440 역산, 보정 전)
 *   아이브로우  y 298, 중앙, 폭 ≈217
 *   H2          1행 y 363 (행간 96), 중앙
 *   본문        1행 y 586 (행간 36), 중앙 · 두 덩어리 사이 빈 줄 ≈50
 *   박스 우상   x 1107, y 149, 333 × 377
 *   박스 좌중   x 0,    y 626, 367 × 280 (왼쪽 끝에서 시작)
 *   박스 우하   x 848,  y 1005, 466 × 306
 *   hair up     x 120,  y ≈1034
 *   SMART AI    x 178,  y ≈1037
 *   24/7 …      x 269,  y 1325
 *   ZERO STRESS x 361,  y 1376
 *   SOLUTION    y 1473, 중앙
 */
/** 히어로 하단 여백(62)에 맞추려고 시안 상단(149)에서 덜어낸 값 */
const LIFT = 87;
const HEIGHT = 1510 - LIFT;

const EYEBROW_TOP = 294 - LIFT;
const HEADLINE_TOP = 344 - LIFT;
const BODY_TOP = 576 - LIFT;
const BODY_ASIDE_TOP = 755 - LIFT;
/** 작은 "01 /" 는 큰 글자보다 베이스라인이 7px 위에 있습니다. */
const INDEX_RISE = 7;

const BOXES = [
  { left: 1107, top: 149 - LIFT, width: 333, height: 377 },
  { left: 0, top: 626 - LIFT, width: 367, height: 280 },
  { left: 848, top: 1005 - LIFT, width: 466, height: 306 },
] as const;

/*
 * 장식 문구는 시안에서 옅은 회색 세리프. 크기·자리는 잉크 박스에 맞췄습니다.
 * brand 가 smart 보다 작고 살짝 위에 있습니다.
 */
const FLOATS = {
  brand: { left: 120, top: 1033 - LIFT, size: 18 },
  smart: { left: 178, top: 1035 - LIFT, size: 22 },
  realtime: { left: 279, top: 1320 - LIFT, size: 22, tracking: 0.4 },
  zero: { left: 362, top: 1370 - LIFT, size: 24, tracking: 0.8 },
  solution: { left: 612, top: 1468 - LIFT, size: 24, tracking: 0.6 },
} as const;

export function Dilemma() {
  return (
    <Canvas id="dilemma" height={HEIGHT} background="bg-paper">
      {BOXES.map((box) => (
        <div
          key={`${box.left}-${box.top}`}
          className="rounded-ui absolute bg-ink"
          style={{
            left: `${box.left}px`,
            top: `${box.top}px`,
            width: `${box.width}px`,
            height: `${box.height}px`,
          }}
        />
      ))}

      <p
        className="absolute inset-x-0 whitespace-pre text-center font-display text-[27px] font-semibold leading-none tracking-[-1.2px] text-forest"
        style={{ top: `${EYEBROW_TOP}px` }}
      >
        <span
          className="relative font-latin text-[16px] font-semibold tracking-[0.65px]"
          style={{ top: `-${INDEX_RISE}px` }}
        >
          {dilemma.eyebrow.index}{" "}
        </span>
        {dilemma.eyebrow.label}
      </p>

      <h2
        className="text-kr absolute inset-x-0 text-center text-[70px] font-bold leading-[96px] tracking-[-0.01em] text-ink"
        style={{ top: `${HEADLINE_TOP}px` }}
      >
        {dilemma.headline.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h2>

      <p
        className="text-kr absolute inset-x-0 text-center text-[22px] font-normal leading-[36px] tracking-[-0.01em] text-ash"
        style={{ top: `${BODY_TOP}px` }}
      >
        {dilemma.body.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </p>

      <p
        className="text-kr absolute inset-x-0 text-center text-[22px] font-normal leading-[36px] tracking-[-0.01em] text-ash"
        style={{ top: `${BODY_ASIDE_TOP}px` }}
      >
        {dilemma.bodyAside.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </p>

      <p
        className="absolute whitespace-pre font-display font-normal leading-none text-whisper"
        style={{
          left: `${FLOATS.brand.left}px`,
          top: `${FLOATS.brand.top}px`,
          fontSize: `${FLOATS.brand.size}px`,
        }}
      >
        {dilemma.floats.brand}
      </p>
      <p
        className="absolute whitespace-pre font-display font-normal leading-none text-whisper"
        style={{
          left: `${FLOATS.smart.left}px`,
          top: `${FLOATS.smart.top}px`,
          fontSize: `${FLOATS.smart.size}px`,
        }}
      >
        {dilemma.floats.smart}
      </p>
      <p
        className="absolute whitespace-pre font-display font-normal leading-none text-whisper"
        style={{
          left: `${FLOATS.realtime.left}px`,
          top: `${FLOATS.realtime.top}px`,
          fontSize: `${FLOATS.realtime.size}px`,
          letterSpacing: `${FLOATS.realtime.tracking}px`,
        }}
      >
        {dilemma.floats.realtime}
      </p>
      <p
        className="absolute whitespace-pre font-display font-normal leading-none text-whisper"
        style={{
          left: `${FLOATS.zero.left}px`,
          top: `${FLOATS.zero.top}px`,
          fontSize: `${FLOATS.zero.size}px`,
          letterSpacing: `${FLOATS.zero.tracking}px`,
        }}
      >
        {dilemma.floats.zero}
      </p>
      <p
        className="absolute whitespace-pre font-display font-normal leading-none text-whisper"
        style={{
          left: `${FLOATS.solution.left}px`,
          top: `${FLOATS.solution.top}px`,
          fontSize: `${FLOATS.solution.size}px`,
          letterSpacing: `${FLOATS.solution.tracking}px`,
        }}
      >
        {dilemma.floats.solution}
      </p>
    </Canvas>
  );
}
