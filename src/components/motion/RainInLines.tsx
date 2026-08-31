"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

import { SPLASH_REVEAL_EVENT } from "@/lib/splash-keys";

type RainInLinesProps = {
  lines: readonly string[];
  className?: string;
  style?: CSSProperties;
  /** 각 줄 span 에 추가 (예: whitespace-pre) */
  lineClassName?: string;
};

function splashReady(): boolean {
  if (document.documentElement.classList.contains("splash-seen")) return true;
  const splash = document.querySelector("[data-splash]");
  if (!splash) return true;
  const style = getComputedStyle(splash);
  return style.display === "none" || style.visibility === "hidden";
}

/**
 * 스플래시 커튼이 올라가기 시작하는 순간(1.2s)에 resolve.
 * 완전히 끝난 뒤(1.6s+)를 기다리면 히어로가 한 박자 늦게 떨어집니다.
 */
function whenSplashReveals(): Promise<void> {
  return new Promise((resolve) => {
    if (splashReady()) {
      resolve();
      return;
    }

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      window.removeEventListener(SPLASH_REVEAL_EVENT, finish);
      mo.disconnect();
      resolve();
    };

    window.addEventListener(SPLASH_REVEAL_EVENT, finish);

    const mo = new MutationObserver(() => {
      if (splashReady()) finish();
    });
    mo.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "style"],
    });

    window.setTimeout(finish, 2500);
  });
}

function inViewport(el: Element) {
  const r = el.getBoundingClientRect();
  const vh = window.innerHeight || 0;
  return r.bottom > vh * 0.1 && r.top < vh * 0.9;
}

/**
 * 화면에 들어오면 각 줄이 위에서 아래로 뿌려지듯 떨어집니다.
 * 스플래시 커튼이 열리기 시작할 때 맞춰 재생합니다.
 */
export function RainInLines({
  lines,
  className,
  style,
  lineClassName = "",
}: RainInLinesProps) {
  const root = useRef<HTMLParagraphElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let io: IntersectionObserver | null = null;

    const start = async () => {
      await whenSplashReveals();
      if (cancelled) return;

      const el = root.current;
      if (!el) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setInView(true);
        return;
      }

      const reveal = () => {
        if (cancelled) return;
        setInView(true);
        io?.disconnect();
      };

      if (inViewport(el)) {
        reveal();
        return;
      }

      io = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) reveal();
        },
        { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
      );
      io.observe(el);
    };

    void start();

    return () => {
      cancelled = true;
      io?.disconnect();
    };
  }, []);

  return (
    <p
      ref={root}
      data-rain={inView ? "in" : "pending"}
      className={className}
      style={style}
    >
      {lines.map((line, i) => (
        <span
          key={`${i}-${line}`}
          data-rain-line
          className={`rain-line block${inView ? " rain-line-in" : ""}${lineClassName ? ` ${lineClassName}` : ""}`}
          style={{ animationDelay: `${i * 140}ms` }}
        >
          {line}
        </span>
      ))}
    </p>
  );
}
