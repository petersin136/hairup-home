"use client";

import { useEffect, useRef } from "react";

import { Wordmark } from "@/components/brand/Wordmark";
import { Canvas } from "@/components/layout/Canvas";
import { banner } from "@/content/site";

/**
 * 04_Banner — 시안 06-D 지시사항
 *
 * .SECTION-BG   1440 × 675 (시안 표기 1441) · bg #000
 * .BANNER-TEXT  Playfair 22/400 · #FAF8F5 · uppercase
 *   24/7              left 120 · top 125
 *   INTELLIGENT AI    left 301 · top 263
 *   PRE - CONSULTANT  left 609 · top 399
 * .BANNER-LOGO  width 369 · height auto · fill #FAF8F5
 *               right 120 → left 951 · top 535
 *
 * 스크롤: 배너 한가운데에 “자석”처럼 붙지 않도록, 휠이면 거의 건너뛰듯 이탈.
 */
const LINES = [
  { left: 120, top: 125 },
  { left: 301, top: 263 },
  { left: 609, top: 399 },
] as const;

const WORDMARK = { left: 951, top: 535, width: 369 };

export function Banner() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = wrapRef.current;
    if (!root) return;

    let locking = false;
    let idle = 0;

    const bannerEl = () =>
      (root.querySelector("#banner") as HTMLElement | null) ?? root;

    const skipTo = (top: number) => {
      if (locking) return;
      locking = true;
      window.scrollTo({ top: Math.max(0, top) });
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          locking = false;
        });
      });
    };

    /** 배너 끝 = KEY BENEFITS 시작 */
    const afterBanner = () => {
      const rect = bannerEl().getBoundingClientRect();
      return window.scrollY + rect.bottom;
    };

    /** 배너 위를 한 화면분 올려 이전 섹션이 가득 차게 */
    const beforeBanner = () => {
      const rect = bannerEl().getBoundingClientRect();
      return window.scrollY + rect.top - window.innerHeight;
    };

    const onWheel = (e: WheelEvent) => {
      if (locking) return;
      const rect = bannerEl().getBoundingClientRect();
      const vh = window.innerHeight;
      const visible = rect.bottom > 0 && rect.top < vh;
      if (!visible) return;

      // CRM sticky가 아직 물려 있으면 그쪽 역스크롤 이탈에 맡김
      const crm = document.getElementById("automated-crm");
      if (crm) {
        const cr = crm.getBoundingClientRect();
        if (cr.top <= 0 && cr.bottom > 0) return;
      }

      if (e.deltaY > 0) {
        e.preventDefault();
        skipTo(afterBanner());
        return;
      }

      if (e.deltaY < 0) {
        e.preventDefault();
        skipTo(beforeBanner());
      }
    };

    /** 관성으로 한가운데 걸리면 가까운 쪽으로 스냅 */
    const onScroll = () => {
      if (locking) return;
      window.clearTimeout(idle);
      idle = window.setTimeout(() => {
        if (locking) return;
        const rect = bannerEl().getBoundingClientRect();
        const vh = window.innerHeight;
        const mid = vh / 2;
        if (rect.top >= mid || rect.bottom <= mid) return;
        const bannerMid = (rect.top + rect.bottom) / 2;
        skipTo(bannerMid < mid ? afterBanner() : beforeBanner());
      }, 40);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(idle);
    };
  }, []);

  return (
    <div ref={wrapRef}>
      <Canvas id="banner" height={675} background="bg-black">
        {banner.lines.map((line, i) => (
          <p
            key={line}
            className="absolute whitespace-pre font-display text-[22px] font-normal uppercase leading-none text-porcelain"
            style={{
              left: `${LINES[i].left}px`,
              top: `${LINES[i].top}px`,
            }}
          >
            {line}
          </p>
        ))}

        {/* .BANNER-LOGO */}
        <div
          className="absolute text-porcelain"
          style={{ left: `${WORDMARK.left}px`, top: `${WORDMARK.top}px` }}
        >
          <Wordmark width={WORDMARK.width} />
        </div>
      </Canvas>
    </div>
  );
}
