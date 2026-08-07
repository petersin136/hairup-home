"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

type CountUpProps = {
  /** 애니메이션 목표값 · continuous 면 상한 */
  to: number;
  /** 완료 후 고정 표시(있으면 to 대신 이걸 보여 줌) */
  finalDisplay?: string;
  /** 숫자 포맷. 기본은 천단위 콤마 */
  format?: (n: number) => string;
  durationMs?: number;
  /**
   * true 면 영역에 보이는 동안 숫자가 `to` 까지 계속 올라감.
   * 플랫폼 수수료처럼 "빠져나가는" 연출용.
   */
  continuous?: boolean;
  /** continuous 시 초당 증가량 */
  perSecond?: number;
  /** continuous 시 숫자 뒤에 붙일 접미사 (예: +α) */
  suffix?: string;
  className?: string;
  style?: CSSProperties;
};

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

/** 화면 중앙대에 들어왔을 때만 시작 (상·하단 가장자리 조기 트리거 방지) */
const IO_OPTIONS: IntersectionObserverInit = {
  threshold: 0.65,
  rootMargin: "-18% 0px -18% 0px",
};

/**
 * 스크롤로 이 숫자가 화면 중앙에 들어왔을 때 0부터 카운트업.
 * continuous 면 to 까지 계속 증가 후 정지.
 */
export function CountUp({
  to,
  finalDisplay,
  format = (n) => n.toLocaleString("en-US"),
  durationMs = 1400,
  continuous = false,
  perSecond = 4200,
  suffix = "",
  className,
  style,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [text, setText] = useState(
    continuous ? `${format(0)}${suffix}` : format(0),
  );
  const played = useRef(false);
  const valueRef = useRef(0);
  const rafRef = useRef(0);
  const visibleRef = useRef(false);
  const lastTsRef = useRef(0);
  const doneRef = useRef(false);
  const startedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setText(
        continuous ? `${format(to)}${suffix}` : (finalDisplay ?? format(to)),
      );
      return;
    }

    if (continuous) {
      const tick = (now: number) => {
        if (!visibleRef.current || doneRef.current) {
          rafRef.current = 0;
          return;
        }
        const last = lastTsRef.current || now;
        const dt = Math.min(0.05, (now - last) / 1000);
        lastTsRef.current = now;
        const boost = 1 + Math.min(1.8, valueRef.current / 120_000);
        valueRef.current = Math.min(to, valueRef.current + perSecond * boost * dt);
        setText(`${format(Math.floor(valueRef.current))}${suffix}`);
        if (valueRef.current >= to) {
          doneRef.current = true;
          setText(`${format(to)}${suffix}`);
          rafRef.current = 0;
          return;
        }
        rafRef.current = requestAnimationFrame(tick);
      };

      const io = new IntersectionObserver(([entry]) => {
        const on = Boolean(entry?.isIntersecting);
        visibleRef.current = on;

        if (on && !doneRef.current) {
          // 화면에 처음(또는 다시) 들어올 때 0부터
          if (!startedRef.current) {
            startedRef.current = true;
            valueRef.current = 0;
            setText(`${format(0)}${suffix}`);
          }
          lastTsRef.current = 0;
          if (!rafRef.current) {
            rafRef.current = requestAnimationFrame(tick);
          }
          return;
        }

        if (!on && rafRef.current) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = 0;
          // 아직 끝나기 전에 화면 밖으로 나가면 다음에 다시 0부터
          if (!doneRef.current) {
            startedRef.current = false;
            valueRef.current = 0;
            setText(`${format(0)}${suffix}`);
          }
        }
      }, IO_OPTIONS);

      io.observe(el);
      return () => {
        io.disconnect();
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    }

    const io = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting || played.current) return;
      played.current = true;

      valueRef.current = 0;
      setText(format(0));
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / durationMs);
        const value = Math.round(to * easeOutCubic(t));
        if (t >= 1) {
          setText(finalDisplay ?? format(to));
          return;
        }
        setText(format(value));
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, IO_OPTIONS);

    io.observe(el);
    return () => io.disconnect();
  }, [to, finalDisplay, format, durationMs, continuous, perSecond, suffix]);

  return (
    <span ref={ref} className={className} style={style}>
      {text}
    </span>
  );
}
