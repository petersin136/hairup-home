"use client";

import { useEffect, useRef, useState } from "react";

import { automatedCrm } from "@/content/site";

/**
 * 03 / AUTOMATED CRM
 *
 * 좌측 시작 x = Experience 폰 왼쪽(SIDE_L 183)과 동일.
 * 타이포는 Experience와 동일.
 * 우측 [검정 프레임 + SYSTEM 카피] 스택 · sticky 스크롤 슬라이드 · 하단 peek.
 * (스크롤 위치 강제 이동 / 높이 토글 없음 — 네이티브 스크롤만 사용)
 */
const STEPS = automatedCrm.systems.length;

/** Experience SIDE_L — 폰 왼쪽 끝과 맞춤 */
const LEFT = 183;
const BOX_LEFT = 742;
const BOX_TOP = 150;
const BOX_W = 698;
const BOX_H = 523;

const CAPTION_ZONE = 240;
const SLIDE_PITCH = BOX_H + CAPTION_ZONE;
const PEEK = 80;

const FRAME_H = BOX_TOP + BOX_H + CAPTION_ZONE + PEEK;

/** Experience와 같은 세로 리듬 */
const GAP_EYEBROW_TITLE = 36;
const GAP_TITLE_BODY = 52;

const LEFT_COL_W = BOX_LEFT - LEFT - 40;

/**
 * 스크롤 타임라인 (상대 가중치)
 * — 장면마다 HOLD로 머무른 뒤 MOVE로 다음으로 슬라이드
 * — 마지막은 END_HOLD로 더 오래 머문 뒤 다음 섹션으로 해제
 */
const HOLD = 0.88;
/** 전환에 쓰는 스크롤 — 클수록 더 천천히·부드럽게 올라감 */
const MOVE = 1.05;
const END_HOLD = 1.15;
/** 가중치 1당 뷰포트 높이 — 클수록 장면이 더 오래 유지 */
const VH_PER_UNIT = 0.78;

const SCROLL_UNITS = (STEPS - 1) * (HOLD + MOVE) + END_HOLD;
const SCROLL_VH = SCROLL_UNITS * VH_PER_UNIT;

type System = (typeof automatedCrm.systems)[number];

/** smootherstep — 시작·끝이 부드럽고 중간만 일정하게 흐름 */
function smoothMove(u: number): number {
  const x = Math.min(1, Math.max(0, u));
  return x * x * x * (x * (x * 6 - 15) + 10);
}

/** 0…1 진행률 → 슬라이드 위치 0…STEPS-1 (홀드 구간은 정수에 고정) */
function progressToSlide(progress: number): number {
  const segments: { hold: boolean; w: number }[] = [];
  for (let i = 0; i < STEPS; i++) {
    segments.push({ hold: true, w: i === STEPS - 1 ? END_HOLD : HOLD });
    if (i < STEPS - 1) segments.push({ hold: false, w: MOVE });
  }

  let t = Math.min(1, Math.max(0, progress)) * SCROLL_UNITS;
  let slide = 0;

  for (const seg of segments) {
    if (t <= seg.w) {
      if (seg.hold) return slide;
      const u = seg.w <= 0 ? 1 : t / seg.w;
      return slide + smoothMove(u);
    }
    t -= seg.w;
    if (!seg.hold) slide += 1;
  }

  return STEPS - 1;
}

function SystemCaption({
  system,
  active,
}: {
  system: System;
  active: boolean;
}) {
  return (
    <div
      className="w-full transition-opacity duration-500 ease-out"
      style={{ opacity: active ? 1 : 0.28 }}
    >
      <p
        className={`text-kr text-[22px] font-semibold leading-[1.45] tracking-[-0.01em] ${
          active ? "text-ink" : "text-ink/50"
        }`}
      >
        <span className="font-display mr-[6px] text-[22px] font-medium tracking-[0.02em]">
          {system.index}
        </span>
        {system.title}
      </p>
      <p
        className={`text-kr mt-[12px] text-[19px] font-normal leading-[1.64] tracking-[-0.01em] ${
          active ? "text-body" : "text-ink/40"
        }`}
      >
        {system.body.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </p>
    </div>
  );
}

export function AutomatedCrm() {
  const pinRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = pinRef.current;
    if (!el) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const total = el.offsetHeight - window.innerHeight;
      if (total <= 0) {
        setProgress(0);
        return;
      }
      const scrolled = Math.min(
        total,
        Math.max(0, -el.getBoundingClientRect().top),
      );
      setProgress(scrolled / total);
    };

    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  const raw = progressToSlide(progress);
  const slideY = raw * SLIDE_PITCH;

  return (
    <section
      id="automated-crm"
      ref={pinRef}
      className="relative bg-linen"
      style={{ height: `${SCROLL_VH * 100}vh` }}
    >
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        <div
          className="relative w-full max-w-[1440px] shrink-0"
          style={{ height: `${FRAME_H}px` }}
        >
          <div
            className="absolute"
            style={{
              left: `${LEFT}px`,
              top: `${BOX_TOP}px`,
              width: `${LEFT_COL_W}px`,
            }}
          >
            <p className="flex items-center leading-none text-forest">
              <span className="font-latin mr-[6px] text-[14px] font-medium tracking-normal uppercase">
                {automatedCrm.eyebrow.index}
              </span>
              <span className="font-display text-[25px] font-medium uppercase">
                {automatedCrm.eyebrow.label}
              </span>
            </p>

            <h2
              className="text-kr text-[70px] font-bold leading-[1.2] tracking-[-0.02em] text-ink"
              style={{ marginTop: `${GAP_EYEBROW_TITLE}px` }}
            >
              {automatedCrm.headline.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>

            <p
              className="text-kr text-[22px] font-normal leading-[1.64] text-body"
              style={{ marginTop: `${GAP_TITLE_BODY}px` }}
            >
              {automatedCrm.body.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
          </div>

          <div
            className="absolute overflow-hidden"
            style={{
              left: `${BOX_LEFT}px`,
              top: `${BOX_TOP}px`,
              width: `${BOX_W}px`,
              height: `${BOX_H + CAPTION_ZONE + PEEK}px`,
            }}
          >
            <div
              className="will-change-transform"
              style={{
                transform: `translate3d(0, ${-slideY}px, 0)`,
              }}
            >
              {automatedCrm.systems.map((system, i) => {
                const dist = Math.abs(raw - i);
                const active = dist < 0.45;
                return (
                  <article
                    key={system.index}
                    className="relative"
                    style={{ height: `${SLIDE_PITCH}px` }}
                  >
                    <div
                      className="bg-black"
                      style={{
                        width: `${BOX_W}px`,
                        height: `${BOX_H}px`,
                      }}
                      aria-hidden
                    />
                    <div
                      className="absolute inset-x-0"
                      style={{
                        top: `${BOX_H + 24}px`,
                        height: `${CAPTION_ZONE - 24}px`,
                      }}
                    >
                      <SystemCaption system={system} active={active} />
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
