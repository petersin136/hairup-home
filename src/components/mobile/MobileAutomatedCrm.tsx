"use client";

import { useEffect, useRef, useState } from "react";

import { GlyphLines } from "@/components/copy/GlyphLines";
import { automatedCrm } from "@/content/site";

/**
 * 03. AUTOMATED CRM 모바일 — hu_automated_01~04_m
 *
 * 카드 스냅 = STUDIO NEUTRAL Professional Team 과 동일 방식
 * (scroll-snap-type: x mandatory · scroll-padding · 앞/뒤 spacer · snap-align start)
 * 자유 스크롤이 아니라 스와이프마다 카드 단위로 자석 고정.
 */
const CARD = 320;
const GAP = 12;
const STRIDE = CARD + GAP;

export function MobileAutomatedCrm() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const system = automatedCrm.systems[active] ?? automatedCrm.systems[0];
  const last = automatedCrm.systems.length - 1;

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const sync = () => {
      const i = Math.round(el.scrollLeft / STRIDE);
      setActive(Math.max(0, Math.min(last, i)));
    };

    el.addEventListener("scroll", sync, { passive: true });
    el.addEventListener("scrollend", sync);
    sync();
    return () => {
      el.removeEventListener("scroll", sync);
      el.removeEventListener("scrollend", sync);
    };
  }, [last]);

  return (
    <section id="automated-crm" className="M-CRM" aria-label="AUTOMATED CRM">
      <p className="__03__AUTOMATED_CRM__">{automatedCrm.tag}</p>

      <h2 className="M-CRM-HEADLINE">
        <GlyphLines lines={automatedCrm.headline} />
      </h2>

      <p className="M-CRM-DESC">
        <GlyphLines lines={automatedCrm.bodyMobile} />
      </p>

      <div
        ref={trackRef}
        className="M-CRM-TRACK"
        aria-roledescription="carousel"
      >
        {/* Professional Team 과 동일 — 좌측 거터 spacer */}
        <div className="M-CRM-SPACER-START" aria-hidden />

        {automatedCrm.systems.map((item, i) => {
          const isMain = i === active;
          const isLast = i === last;
          return (
            <div
              key={item.index}
              className={[
                isMain ? "RECTANGLE__MAIN_" : "RECTANGLE__NEXT_",
                isLast ? "is-last" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              aria-hidden={!isMain}
              aria-label={`${item.index}. ${item.titleMobile.join(" ")}`}
            />
          );
        })}

        {/* 마지막 카드도 좌측 20 스냅 가능하도록 (390 − 20 − 320) */}
        <div className="M-CRM-SPACER-END" aria-hidden />
      </div>

      <h3 className="TITLE">
        <GlyphLines lines={system.titleMobile} />
      </h3>
      <p className="TEXT">
        <GlyphLines lines={system.bodyMobile} />
      </p>
    </section>
  );
}
