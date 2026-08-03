"use client";

import { useEffect, useState } from "react";
import { Wordmark } from "@/components/brand/Wordmark";
import { splash } from "@/content/site";

export const SPLASH_SESSION_KEY = "hairup:splash-played";

/**
 * 01. SPLASH SCREEN — 아트보드 1440 × 900, 배경 #2c3a2e
 *
 * 타임라인 (시안 참고사항)
 *   0    ~ 0.4s  서브문구 + 로고가 아래에서 위로 올라오며 불투명도 0 → 100
 *   0.4  ~ 1.2s  0.8초간 정지 유지
 *   1.2  ~ 1.6s  커튼업 — 전체가 위로 빠지며 랜딩페이지가 드러남
 *
 * 로고는 화면 정중앙(y 450), 서브문구는 로고 폭(193px)에 맞춰 자간을 벌려 정렬됩니다.
 */
const RISE_MS = 400;
const HOLD_MS = 800;
const CURTAIN_MS = 400;
const TOTAL_MS = RISE_MS + HOLD_MS + CURTAIN_MS;

export function SplashScreen() {
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    let alreadyPlayed = false;
    try {
      alreadyPlayed = sessionStorage.getItem(SPLASH_SESSION_KEY) === "1";
      sessionStorage.setItem(SPLASH_SESSION_KEY, "1");
    } catch {
      // 시크릿 모드 등에서 sessionStorage 접근이 막히면 그냥 재생합니다.
    }

    // 이미 본 세션이면 layout 의 인라인 스크립트가 붙인 .splash-seen 이
    // 첫 페인트부터 감추고 있으므로 아무것도 하지 않습니다.
    if (alreadyPlayed) return;

    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => {
      document.body.style.overflow = "";
      setIsDone(true);
    }, TOTAL_MS);

    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, []);

  if (isDone) return null;

  return (
    <div
      data-splash
      aria-hidden
      className="splash-root fixed inset-0 z-50 flex items-center justify-center bg-forest"
    >
      {/* 로고 중심을 화면 정중앙에 두고, 서브문구는 그 위에 얹습니다. */}
      <div className="splash-content relative">
        <p
          className="absolute bottom-full left-0 mb-[15px] w-full text-center font-latin text-[14px] font-semibold leading-none tracking-[1.75px] text-porcelain"
          style={{ textIndent: "1.75px" }}
        >
          {splash.eyebrow}
        </p>
        <span className="block text-porcelain">
          <Wordmark width={193} />
        </span>
      </div>
    </div>
  );
}
