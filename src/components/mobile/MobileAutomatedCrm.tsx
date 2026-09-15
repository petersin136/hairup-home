"use client";

import { useEffect, useRef, useState } from "react";

import { GlyphLines } from "@/components/copy/GlyphLines";
import { automatedCrm } from "@/content/site";

/**
 * 03. AUTOMATED CRM 모바일 — hu_automated_01~04_m
 * 가로 스냅 캐러셀 · 메인 카드 opacity 1 · 대기 카드 0.4
 * 하단 .TITLE / .TEXT 는 활성 슬라이드에 연동
 */
const CARD = 320;
const GAP = 12;

export function MobileAutomatedCrm() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const system = automatedCrm.systems[active] ?? automatedCrm.systems[0];

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const sync = () => {
      const i = Math.round(el.scrollLeft / (CARD + GAP));
      setActive(Math.max(0, Math.min(automatedCrm.systems.length - 1, i)));
    };

    el.addEventListener("scroll", sync, { passive: true });
    sync();
    return () => el.removeEventListener("scroll", sync);
  }, []);

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
        style={{ touchAction: "pan-x pan-y" }}
      >
        {automatedCrm.systems.map((item, i) => {
          const isMain = i === active;
          return (
            <div
              key={item.index}
              className={isMain ? "RECTANGLE__MAIN_" : "RECTANGLE__NEXT_"}
              aria-hidden={!isMain}
              aria-label={`${item.index}. ${item.titleMobile.join(" ")}`}
            />
          );
        })}
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
