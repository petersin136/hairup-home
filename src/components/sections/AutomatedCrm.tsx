"use client";

import { useEffect, useRef, useState } from "react";

import { automatedCrm } from "@/content/site";

/**
 * 03 / AUTOMATED CRM
 *
 * 좌측 시작 x = Experience 폰 왼쪽(SIDE_L 183)과 동일.
 * 타이포는 Experience와 동일.
 * 우측 [검정 프레임 + SYSTEM 카피] 스택 · sticky.
 * 아래로: 단계 whoosh 슬라이드. 위로: 홀드 없이 섹션을 바로 이탈.
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
 * — HOLD에서 장면 유지, MOVE는 다음 단계 트리거 구간(짧을수록 중간에 머물기 어려움)
 */
const HOLD = 1.15;
const MOVE = 0.55;
const END_HOLD = 1.25;
const VH_PER_UNIT = 0.95;

/** 단계 전환 whoosh 길이 — 현재 체감 속도 유지 */
const WHOOSH_MS = 580;

const SCROLL_UNITS = (STEPS - 1) * (HOLD + MOVE) + END_HOLD;
const SCROLL_VH = SCROLL_UNITS * VH_PER_UNIT;

type System = (typeof automatedCrm.systems)[number];

/** ease-in-out cubic — 중간이 빠른 “사악” 슬라이드 */
function whooshEase(t: number): number {
  const x = Math.min(1, Math.max(0, t));
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

/**
 * 0…1 진행률 → 정수 단계 0…STEPS-1
 * MOVE 구간은 절반 지나면 다음 단계로 스냅 (중간에 머물러도 카드는 완성본만 표시)
 */
function progressToStep(progress: number): number {
  const segments: { hold: boolean; w: number }[] = [];
  for (let i = 0; i < STEPS; i++) {
    segments.push({ hold: true, w: i === STEPS - 1 ? END_HOLD : HOLD });
    if (i < STEPS - 1) segments.push({ hold: false, w: MOVE });
  }

  let t = Math.min(1, Math.max(0, progress)) * SCROLL_UNITS;
  let step = 0;

  for (const seg of segments) {
    if (t <= seg.w) {
      if (seg.hold) return step;
      return t / seg.w >= 0.5 ? step + 1 : step;
    }
    t -= seg.w;
    if (!seg.hold) step += 1;
  }

  return STEPS - 1;
}

function SystemCaption({
  system,
  emphasis,
}: {
  system: System;
  /** 0…1 — 활성에 가까울수록 1 */
  emphasis: number;
}) {
  const e = Math.min(1, Math.max(0, emphasis));
  const titleOpacity = 0.42 + e * 0.58;
  const bodyOpacity = 0.32 + e * 0.68;
  return (
    <div className="w-full" style={{ opacity: 0.28 + e * 0.72 }}>
      <p
        className="text-kr text-[22px] font-semibold leading-[1.45] tracking-[-0.01em] text-ink"
        style={{ opacity: titleOpacity }}
      >
        <span className="font-display mr-[6px] text-[22px] font-medium tracking-[0.02em]">
          {system.index}
        </span>
        {system.title}
      </p>
      <p
        className="text-kr mt-[12px] text-[19px] font-normal leading-[1.64] tracking-[-0.01em] text-body"
        style={{ opacity: bodyOpacity }}
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
  const stepRef = useRef(0);
  const displayRef = useRef(0);
  const animRef = useRef<{
    from: number;
    to: number;
    start: number;
  } | null>(null);
  const [raw, setRaw] = useState(0);

  useEffect(() => {
    const el = pinRef.current;
    if (!el) return;

    let rafScroll = 0;
    let rafAnim = 0;
    let running = true;
    let releasing = false;
    let lastY = window.scrollY;

    const setDisplay = (v: number) => {
      displayRef.current = v;
      setRaw(v);
    };

    const pinMetrics = () => {
      const rect = el.getBoundingClientRect();
      const total = Math.max(0, el.offsetHeight - window.innerHeight);
      const scrolled = Math.min(total, Math.max(0, -rect.top));
      const sectionTop = rect.top + window.scrollY;
      /**
       * sticky가 화면을 붙잡고 있는 동안만 true.
       * ※ bottom > 0 만으로 보면 CRM 박스 하단이 배너·KEY BENEFITS까지
       *   겹쳐 “engaged”로 남아 배너 스킵이 전부 막힘.
       */
      const pinned =
        rect.top <= 0 && rect.bottom >= window.innerHeight - 0.5;
      return { total, scrolled, sectionTop, pinned };
    };

    const tickAnim = (now: number) => {
      rafAnim = 0;
      if (!running) return;
      const anim = animRef.current;
      if (!anim) return;

      const u = whooshEase((now - anim.start) / WHOOSH_MS);
      if (u >= 1) {
        animRef.current = null;
        setDisplay(anim.to);
        return;
      }
      setDisplay(anim.from + (anim.to - anim.from) * u);
      rafAnim = window.requestAnimationFrame(tickAnim);
    };

    const goToStep = (step: number) => {
      const to = Math.min(STEPS - 1, Math.max(0, step));
      if (to === stepRef.current && !animRef.current) return;
      if (to === stepRef.current && animRef.current?.to === to) return;

      stepRef.current = to;
      const from = displayRef.current;
      if (Math.abs(from - to) < 0.001) {
        animRef.current = null;
        setDisplay(to);
        return;
      }

      animRef.current = { from, to, start: performance.now() };
      if (!rafAnim) rafAnim = window.requestAnimationFrame(tickAnim);
    };

    /** 역스크롤 — sticky pin 중에만, 이전 섹션으로 즉시 이탈 */
    const releaseUp = () => {
      if (releasing) return true;
      const { total, sectionTop, pinned } = pinMetrics();
      if (!pinned || total <= 0) return false;

      releasing = true;
      animRef.current = null;
      if (rafAnim) {
        window.cancelAnimationFrame(rafAnim);
        rafAnim = 0;
      }
      if (rafScroll) {
        window.cancelAnimationFrame(rafScroll);
        rafScroll = 0;
      }
      stepRef.current = 0;
      setDisplay(0);
      const target = Math.max(0, sectionTop - window.innerHeight);
      window.scrollTo({ top: target });
      lastY = target;
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          releasing = false;
          lastY = window.scrollY;
        });
      });
      return true;
    };

    const readStepDown = () => {
      rafScroll = 0;
      if (releasing) return;
      const { total, scrolled, pinned } = pinMetrics();
      if (total <= 0) {
        goToStep(0);
        return;
      }
      if (!pinned) {
        goToStep(scrolled <= 0 ? 0 : STEPS - 1);
        return;
      }
      goToStep(progressToStep(scrolled / total));
    };

    const onScroll = () => {
      const y = window.scrollY;
      const goingUp = y < lastY - 0.5;
      lastY = y;
      if (releasing) return;
      if (goingUp) {
        releaseUp();
        return;
      }
      if (!rafScroll) rafScroll = window.requestAnimationFrame(readStepDown);
    };

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY >= 0) return;
      if (!pinMetrics().pinned) return;
      e.preventDefault();
      releaseUp();
    };

    readStepDown();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("resize", onScroll);
    return () => {
      running = false;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", onScroll);
      if (rafScroll) window.cancelAnimationFrame(rafScroll);
      if (rafAnim) window.cancelAnimationFrame(rafAnim);
    };
  }, []);

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
                const emphasis = Math.max(0, 1 - dist);
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
                      <SystemCaption system={system} emphasis={emphasis} />
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
