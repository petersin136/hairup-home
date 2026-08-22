"use client";

import { useEffect, useState } from "react";

import { Wordmark } from "@/components/brand/Wordmark";
import { topBanner } from "@/content/site";

/**
 * 상단 띠배너 — hu_TOP_BANNER__PC
 *
 * sticky 고정 + 좌측 워드마크 + 하단 2px 스크롤 진행 바
 */
export function TopBanner({ mobile = false }: { mobile?: boolean }) {
  const [progress, setProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const sync = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      const y = el.scrollTop || window.scrollY || 0;
      setProgress(max > 0 ? Math.min(1, Math.max(0, y / max)) : 0);
      setScrolled(y > 8);
    };

    sync();
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, []);

  return (
    <div
      className={[
        "TOP_BANNER",
        mobile ? "is-mobile" : "",
        scrolled ? "is-scrolled" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      role="note"
    >
      <span className="TOP_BANNER-LOGO" aria-hidden>
        <Wordmark width={mobile ? 52 : 72} />
      </span>
      <p className="BANNER_TEXT">
        <span className="EN">{topBanner.en}</span>
        <span className="BAR" aria-hidden>
          {mobile ? " | " : "|"}
        </span>
        <span className="KR">{mobile ? topBanner.krMobile : topBanner.kr}</span>
      </p>
      <span
        className="TOP_BANNER-PROGRESS"
        style={{ transform: `scaleX(${progress})` }}
        aria-hidden
      />
    </div>
  );
}
