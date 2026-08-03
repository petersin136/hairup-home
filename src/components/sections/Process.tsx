"use client";

import { useEffect, useRef, useState } from "react";

import { process } from "@/content/site";

/**
 * 06_The Process — 애플 공홈 TV+ 선반 (가운데 카드 + 양옆 peek).
 * 하단 에너지 바가 ~3초 차면 다음 장으로 넘어가며 무한 반복합니다.
 *
 * 카드만 잘라 쓰고, 글자 크기는 시안 그대로(축소·납작 scale 금지)입니다.
 * 좌표만 카드 폭·높이에 맞춰 옮깁니다.
 */
const SRC = { width: 1320, height: 1030 };
const CARD = { width: 1120, height: 820, gap: 22, radius: 22 };
const PITCH = CARD.width + CARD.gap;
const SX = CARD.width / SRC.width;
const SY = CARD.height / SRC.height;
const x = (v: number) => v * SX;
const y = (v: number) => v * SY;

const SECTION = {
  padTop: 64,
  padBottom: 72,
  dotsGap: 28,
  dot: 8,
  pillW: 40,
};
const HEIGHT =
  SECTION.padTop + CARD.height + SECTION.dotsGap + SECTION.dot + SECTION.padBottom;

/** 시안 잉크 좌표(1320 패널). 글자 크기와 행간은 아래 클래스에 고정. */
const EYEBROW = { left: 118, top: 51 };
const BOX = { left: 538, top: 322, width: 365, height: 465 };
const TEXT = { left: 121, center: 556 };
const STEP = { right: 120, top: 515 };
const COUNTER = { left: 120, top: 903 };
const CAPTION = { left: 209, top: 894 };
const CAPTION_TRACKING = 0.7;

const SNAP = 0.18;
const GLIDE_MS = 550;
/** 애플 선반 에너지 바가 차는 시간 */
const AUTO_MS = 5000;

const THEMES = [
  { background: "var(--color-clay)", dim: "var(--color-clay-dim)" },
  { background: "var(--color-forest)", dim: "var(--color-forest-dim)" },
  { background: "var(--color-espresso)", dim: "var(--color-espresso-dim)" },
] as const;

const COUNT = process.steps.length;
const REACH = 2;

const wrap = (i: number) => ((i % COUNT) + COUNT) % COUNT;

export function Process() {
  const [index, setIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const startX = useRef(0);
  const offset = useRef(0);
  const moved = useRef(false);
  const [barKey, setBarKey] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const go = (next: number, restartBar = true) => {
    setIndex(next);
    if (restartBar) setBarKey((k) => k + 1);
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    startX.current = e.clientX;
    offset.current = dragX;
    moved.current = false;
    setDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    const dx = e.clientX - startX.current;
    if (Math.abs(dx) > 6) moved.current = true;
    setDragX(offset.current + dx);
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    setDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }

    const dx = dragX;
    setDragX(0);
    if (dx <= -CARD.width * SNAP) go(index + 1);
    else if (dx >= CARD.width * SNAP) go(index - 1);
    else setBarKey((k) => k + 1);
  };

  const seats = Array.from({ length: REACH * 2 + 1 }, (_, k) => index - REACH + k);
  const trackShift = -index * PITCH + dragX;
  const active = wrap(index);

  return (
    <section
      id="process"
      className="relative w-full overflow-hidden bg-cream"
      style={{ height: `${HEIGHT}px` }}
      aria-roledescription="carousel"
      aria-label="The Process"
    >
      <div
        className="absolute inset-x-0 cursor-grab touch-pan-y select-none active:cursor-grabbing"
        style={{ top: `${SECTION.padTop}px`, height: `${CARD.height}px` }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div
          className="absolute inset-y-0 will-change-transform"
          style={{
            left: `calc(50% - ${CARD.width / 2}px)`,
            transform: `translate3d(${trackShift}px, 0, 0)`,
            transition: dragging
              ? "none"
              : `transform ${GLIDE_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`,
          }}
        >
          {seats.map((seat) => {
            const i = wrap(seat);
            const step = process.steps[i];
            const centered = seat === index;

            return (
              <article
                key={seat}
                data-step={i}
                data-centered={centered ? "true" : undefined}
                aria-hidden={!centered}
                className="absolute top-0 overflow-hidden"
                style={{
                  left: `${seat * PITCH}px`,
                  width: `${CARD.width}px`,
                  height: `${CARD.height}px`,
                  borderRadius: `${CARD.radius}px`,
                  background: THEMES[i].background,
                }}
                onClick={() => {
                  if (moved.current) return;
                  if (seat !== index) go(seat);
                }}
              >
                <p
                  className="absolute whitespace-pre font-display text-[66px] font-normal leading-[79px]"
                  style={{
                    left: `${x(EYEBROW.left)}px`,
                    top: `${y(EYEBROW.top)}px`,
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
                    left: `${x(BOX.left)}px`,
                    top: `${y(BOX.top)}px`,
                    width: `${x(BOX.width)}px`,
                    height: `${y(BOX.height)}px`,
                  }}
                />

                <div
                  className="absolute -translate-y-1/2"
                  style={{ left: `${x(TEXT.left)}px`, top: `${y(TEXT.center)}px` }}
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
                    right: `${x(STEP.right)}px`,
                    top: `${y(STEP.top)}px`,
                    color: THEMES[i].dim,
                  }}
                >
                  {step.step}
                </p>

                <p
                  className="absolute font-latin text-[32px] font-normal leading-none tracking-[0.5px]"
                  style={{
                    left: `${x(COUNTER.left)}px`,
                    top: `${y(COUNTER.top)}px`,
                    color: THEMES[i].dim,
                  }}
                >
                  {step.counter}
                </p>

                <p
                  className="absolute whitespace-pre font-display text-[66px] font-normal leading-none"
                  style={{
                    left: `${x(CAPTION.left)}px`,
                    top: `${y(CAPTION.top)}px`,
                    letterSpacing: `${CAPTION_TRACKING}px`,
                    color: THEMES[i].dim,
                  }}
                >
                  {step.caption}
                </p>
              </article>
            );
          })}
        </div>
      </div>

      <div
        className="absolute inset-x-0 flex items-center justify-center gap-[10px]"
        style={{ top: `${SECTION.padTop + CARD.height + SECTION.dotsGap}px` }}
        role="tablist"
        aria-label="Process steps"
      >
        {process.steps.map((step, i) => {
          const isActive = active === i;
          return (
            <button
              key={step.step}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`${step.step}: ${step.caption}`}
              className={`relative overflow-hidden rounded-full transition-[width] duration-300 ${
                isActive ? "bg-ink/25" : "bg-ink/30 hover:bg-ink/45"
              }`}
              style={{
                width: isActive ? `${SECTION.pillW}px` : `${SECTION.dot}px`,
                height: `${SECTION.dot}px`,
              }}
              onClick={() => go(index - active + i)}
            >
              {isActive && !reducedMotion && (
                <span
                  key={`${barKey}-${index}`}
                  data-process-energy
                  className="process-energy absolute inset-y-0 left-0 w-full rounded-full bg-ink"
                  style={{
                    animationDuration: `${AUTO_MS}ms`,
                    animationPlayState: dragging ? "paused" : "running",
                  }}
                  onAnimationEnd={() => {
                    if (!dragging) go(index + 1, false);
                  }}
                />
              )}
              {isActive && reducedMotion && (
                <span className="absolute inset-0 rounded-full bg-ink" />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
