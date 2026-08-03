"use client";

import { useEffect, useRef } from "react";

import { process } from "@/content/site";

/**
 * 06_The Process — 아트보드 1440 × 1030, 상태 3개가 끊김 없이 이어 흐릅니다.
 *
 * 세 시안의 구조가 완전히 같지만 배경까지 함께 움직여야 하므로 한 상태를 통째로
 * 한 장(panel)으로 만들고, 그 장들을 옆으로 이어 붙여 오른쪽 → 왼쪽으로 흘립니다.
 * 좌측 텍스트 블록은 본문이 3줄이든 4줄이든 y≈556 을 중심으로 세로 가운데
 * 정렬돼 있고, 이미지 박스 중심도 같은 높이입니다.
 *
 * 시안에서 잰 잉크 좌표
 *   THE / PROCESS  x 120, y 70 (행간 79)
 *   이미지 박스     x 538, y 322, 365 × 465
 *   좌측 라벨/본문  x 120, 블록 중심 y 556 (본문 행간 36)
 *   STEP N         우측 정렬 x 1320, y 528
 *   1/3            x 120, y 906
 *   DISCOVERY 등   x 210, y 907
 */
const HEIGHT = 1030;
const EYEBROW = { left: 118, top: 51 };
const BOX = { left: 538, top: 322, width: 365, height: 465 };
const TEXT = { left: 121, center: 556 };
const STEP = { right: 120, top: 515 };
const COUNTER = { left: 120, top: 903 };
const CAPTION = { left: 209, top: 894 };

/**
 * 시안 서체와 Playfair Display 는 낱글자 폭이 조금씩 달라서, 캡션은 시안에서 잰
 * 전체 폭에 맞도록 자간을 아주 조금 벌립니다.
 */
const CAPTION_TRACKING = 0.7;

/*
 * 한 장은 아트보드 1440 에서 좌우 여백을 CROP 만큼씩 덜어낸 폭입니다. 여백을
 * 줄인 만큼 화면 끝에 다음 장이 걸쳐 보이고, 장과 장은 붙어 있어 배경색이
 * 바뀌는 자리가 곧 경계입니다. 안쪽 좌표는 시안 그대로라 이 값만 바꾸면 됩니다.
 * (시안 여백은 좌 118 · 우 120 이고, CROP 60 이면 좌 58 · 우 60 이 남습니다.)
 */
const CROP = 60;
const PANEL = 1440 - CROP * 2;

/** 한 장이 지나가는 데 걸리는 시간. 07 하단 문구 띠와 비슷한 속도입니다. */
const PANEL_MS = 14000;

const THEMES = [
  { background: "var(--color-clay)", dim: "var(--color-clay-dim)" },
  { background: "var(--color-forest)", dim: "var(--color-forest-dim)" },
  { background: "var(--color-espresso)", dim: "var(--color-espresso-dim)" },
] as const;

const COUNT = process.steps.length;
/** 세 장이 한 바퀴. 여기까지 흐르면 그 앞과 그림이 똑같아 소리 없이 되감깁니다. */
const CYCLE = PANEL * COUNT;
/*
 * 되감는 순간에도 화면이 비지 않으려면 줄이 한 바퀴 + 화면 폭보다 길어야 합니다.
 * 세 벌(11880px)이면 7920px 폭까지 덮습니다.
 */
const SETS = 3;
const SEATS = Array.from({ length: COUNT * SETS }, (_, i) => i);

export function Process() {
  const track = useRef<HTMLDivElement>(null);
  /** 지금까지 흘러온 거리(px). 한 바퀴로 나눈 나머지만 화면에 씁니다. */
  const flowed = useRef(0);
  const dragFrom = useRef<number | null>(null);

  useEffect(() => {
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let prev = performance.now();

    const tick = (now: number) => {
      const dt = now - prev;
      prev = now;
      if (dragFrom.current === null && !still.matches) {
        flowed.current += (PANEL / PANEL_MS) * dt;
      }
      const wrapped = ((flowed.current % CYCLE) + CYCLE) % CYCLE;
      if (track.current) {
        track.current.style.transform = `translate3d(${-wrapped}px, 0, 0)`;
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  /* 끄는 동안은 흐름을 멈추고 손이 움직인 만큼 그대로 따라갑니다. */
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragFrom.current = e.clientX + flowed.current;
  };

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (dragFrom.current === null) return;
      flowed.current = dragFrom.current - e.clientX;
    };
    const onUp = () => {
      dragFrom.current = null;
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, []);

  return (
    <section
      id="process"
      className="relative w-full cursor-grab touch-pan-y select-none overflow-hidden active:cursor-grabbing"
      style={{ height: `${HEIGHT}px` }}
      onPointerDown={onPointerDown}
    >
      <div ref={track} className="absolute inset-y-0 left-0">
        {SEATS.map((seat) => {
          const i = seat % COUNT;
          const step = process.steps[i];

          return (
            <div
              key={seat}
              data-step={i}
              /* 같은 내용을 여러 벌 깔았으므로 첫 벌만 읽히게 둡니다. */
              aria-hidden={seat >= COUNT}
              className="absolute inset-y-0 overflow-hidden"
              style={{
                left: `${seat * PANEL}px`,
                width: `${PANEL}px`,
                background: THEMES[i].background,
              }}
            >
              <div
                className="absolute inset-y-0 w-[1440px]"
                style={{ left: `-${CROP}px` }}
              >
                <p
                  className="absolute whitespace-pre font-display text-[66px] font-normal leading-[79px]"
                  style={{
                    left: `${EYEBROW.left}px`,
                    top: `${EYEBROW.top}px`,
                    color: THEMES[i].dim,
                  }}
                >
                  {process.eyebrow.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </p>

                <div
                  className="rounded-ui absolute bg-cream"
                  style={{
                    left: `${BOX.left}px`,
                    top: `${BOX.top}px`,
                    width: `${BOX.width}px`,
                    height: `${BOX.height}px`,
                  }}
                />

                <div
                  className="absolute -translate-y-1/2"
                  style={{ left: `${TEXT.left}px`, top: `${TEXT.center}px` }}
                >
                  <p className="text-kr text-[28px] font-medium leading-none text-porcelain">
                    {step.label}
                  </p>
                  <p className="text-kr mt-[12px] text-[23px] font-normal leading-[36px] tracking-[-1px] text-porcelain">
                    {step.body.map((line) => (
                      <span key={line} className="block whitespace-pre">
                        {line}
                      </span>
                    ))}
                  </p>
                </div>

                <p
                  className="absolute whitespace-pre text-right font-display text-[66px] font-normal leading-none [font-variant-numeric:lining-nums]"
                  style={{
                    right: `${STEP.right}px`,
                    top: `${STEP.top}px`,
                    color: THEMES[i].dim,
                  }}
                >
                  {step.step}
                </p>

                <p
                  className="absolute font-latin text-[32px] font-normal leading-none tracking-[0.5px]"
                  style={{
                    left: `${COUNTER.left}px`,
                    top: `${COUNTER.top}px`,
                    color: THEMES[i].dim,
                  }}
                >
                  {step.counter}
                </p>

                <p
                  className="absolute whitespace-pre font-display text-[66px] font-normal leading-none"
                  style={{
                    left: `${CAPTION.left}px`,
                    top: `${CAPTION.top}px`,
                    letterSpacing: `${CAPTION_TRACKING}px`,
                    color: THEMES[i].dim,
                  }}
                >
                  {step.caption}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
