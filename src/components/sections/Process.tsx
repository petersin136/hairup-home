"use client";

import { useEffect, useState } from "react";

import { process } from "@/content/site";

/**
 * 06_The Process — 아트보드 1440 × 1030, 상태 3개가 자동으로 순환합니다.
 *
 * 세 시안의 구조가 완전히 같지만 배경까지 함께 밀려야 하므로 한 상태를 통째로
 * 한 장(panel)으로 만들어 오른쪽 → 왼쪽으로 흘려보냅니다. 좌측 텍스트 블록은
 * 본문이 3줄이든 4줄이든 y≈556 을 중심으로 세로 가운데 정렬돼 있고,
 * 이미지 박스 중심도 같은 높이입니다.
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

/** 시안에 모션 스펙이 없어 한 상태를 4.3초 세워 두고 0.7초 동안 밀어 넘깁니다. */
const CYCLE_MS = 5000;

const THEMES = [
  { background: "var(--color-clay)", dim: "var(--color-clay-dim)" },
  { background: "var(--color-forest)", dim: "var(--color-forest-dim)" },
  { background: "var(--color-espresso)", dim: "var(--color-espresso-dim)" },
] as const;

export function Process() {
  const [active, setActive] = useState(0);
  const count = process.steps.length;

  useEffect(() => {
    const id = setInterval(() => setActive((i) => (i + 1) % count), CYCLE_MS);
    return () => clearInterval(id);
  }, [count]);

  return (
    <section
      id="process"
      className="relative w-full overflow-hidden"
      style={{ height: `${HEIGHT}px` }}
    >
      {process.steps.map((step, i) => {
        /* 0 = 화면 안, 1 = 오른쪽 대기, 2 = 왼쪽으로 퇴장 */
        const slot = (i - active + count) % count;
        const waiting = slot === 1;

        return (
          <div
            key={step.step}
            data-step={i}
            data-active={slot === 0}
            data-waiting={waiting}
            aria-hidden={slot !== 0}
            className="process-slide absolute inset-0"
            style={{
              background: THEMES[i].background,
              transform: `translateX(${slot === 0 ? 0 : waiting ? 100 : -100}%)`,
            }}
          >
            <div className="relative mx-auto h-full w-[1440px]">
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
    </section>
  );
}
