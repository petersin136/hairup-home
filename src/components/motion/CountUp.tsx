"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

type CountUpProps = {
  /** 애니메이션 중 올라갈 숫자 */
  to: number;
  /** 완료 후 고정 표시(있으면 to 대신 이걸 보여 줌) */
  finalDisplay?: string;
  /** 숫자 포맷. 기본은 천단위 콤마 */
  format?: (n: number) => string;
  durationMs?: number;
  className?: string;
  style?: CSSProperties;
};

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

/**
 * 스크롤로 영역이 보이면 숫자가 빠르게 올라가는 카운트업.
 * `finalDisplay` 가 있으면 연출 후 그 문자열로 착지(시안 00000+α 용).
 */
export function CountUp({
  to,
  finalDisplay,
  format = (n) => n.toLocaleString("en-US"),
  durationMs = 1400,
  className,
  style,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [text, setText] = useState(format(0));
  const played = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setText(finalDisplay ?? format(to));
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || played.current) return;
        played.current = true;

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
      },
      { threshold: 0.45 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [to, finalDisplay, format, durationMs]);

  return (
    <span ref={ref} className={className} style={style}>
      {text}
    </span>
  );
}
