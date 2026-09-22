"use client";

import { useEffect, useRef, useState } from "react";

import { GlyphLines } from "@/components/copy/GlyphLines";
import { automatedCrm } from "@/content/site";

/**
 * 03. AUTOMATED CRM 모바일 — hu_automated_04~07_m
 *
 * 카드 스냅: 트랙을 좌 20 만큼 들여 쓰고(중간 슬라이드는 이전 카드 클립),
 * 마지막은 end 스냅으로 좌측에 이전 카드가 일부 비침.
 * 스와이프 종료 시 stride / maxScroll 로 scrollLeft 강제 정렬.
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

    let settling = false;
    let endTimer = 0;

    const maxScroll = () =>
      Math.max(0, el.scrollWidth - el.clientWidth);

    const scrollLeftForIndex = (i: number) =>
      i >= last ? maxScroll() : i * STRIDE;

    const indexFromScroll = () => {
      const max = maxScroll();
      if (max > 0 && el.scrollLeft >= max - 1) return last;
      return Math.max(0, Math.min(last, Math.round(el.scrollLeft / STRIDE)));
    };

    const snapTo = (i: number) => {
      const left = scrollLeftForIndex(i);
      if (Math.abs(el.scrollLeft - left) < 0.5) {
        setActive(i);
        return;
      }
      settling = true;
      el.scrollTo({ left, behavior: "auto" });
      setActive(i);
      requestAnimationFrame(() => {
        settling = false;
      });
    };

    const sync = () => {
      if (settling) return;
      setActive(indexFromScroll());
      window.clearTimeout(endTimer);
      endTimer = window.setTimeout(() => snapTo(indexFromScroll()), 80);
    };

    const onScrollEnd = () => {
      if (settling) return;
      window.clearTimeout(endTimer);
      snapTo(indexFromScroll());
    };

    el.addEventListener("scroll", sync, { passive: true });
    el.addEventListener("scrollend", onScrollEnd);
    snapTo(indexFromScroll());

    return () => {
      window.clearTimeout(endTimer);
      el.removeEventListener("scroll", sync);
      el.removeEventListener("scrollend", onScrollEnd);
    };
  }, [last]);

  return (
    <section id="automated-crm" className="M-CRM" aria-label="AUTOMATED CRM">
      <p className="M-CRM-TAG">{automatedCrm.tag}</p>

      <h2 className="M-CRM-HEADLINE">
        <GlyphLines lines={automatedCrm.headline} />
      </h2>

      <p className="M-CRM-DESC">
        <GlyphLines lines={automatedCrm.bodyMobile} />
      </p>

      {/* 좌 20 거터는 뷰포트 margin — 중간 슬라이드에서 이전 카드 클립 */}
      <div className="M-CRM-VIEWPORT">
        <div
          ref={trackRef}
          className="M-CRM-TRACK"
          aria-roledescription="carousel"
        >
          {automatedCrm.systems.map((item, i) => {
            const isMain = i === active;
            const isLast = i === last;
            return (
              <div
                key={item.index}
                className={[
                  isMain ? "M-CRM-CARD" : "M-CRM-CARD-NEXT",
                  isLast ? "is-last" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                aria-hidden={!isMain}
                aria-label={`${item.index}. ${item.titleMobile.join(" ")}`}
              />
            );
          })}
        </div>
      </div>

      <h3 className="M-CRM-TITLE">
        <GlyphLines lines={system.titleMobile} />
      </h3>
      <p className="M-CRM-TEXT">
        <GlyphLines lines={system.bodyMobile} />
      </p>
    </section>
  );
}
