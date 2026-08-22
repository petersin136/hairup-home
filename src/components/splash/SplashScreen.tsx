"use client";

import { useEffect, useState } from "react";
import { Wordmark } from "@/components/brand/Wordmark";
import { splash } from "@/content/site";

export const SPLASH_SESSION_KEY = "hairup:splash-played";
/** 커튼이 올라가기 시작하는 순간. 히어로 본문 rain-in 이 이때 맞춰 재생됩니다. */
export const SPLASH_REVEAL_EVENT = "hairup:splash-reveal";
/** 스플래시가 완전히 끝난 뒤 — 런치 팝업은 이 신호 + 400ms 후 표시 */
export const SPLASH_DONE_EVENT = "hairup:splash-done";

/**
 * SPLASH SCREEN — 배경 #2c3a2e
 *
 * 타임라인
 *   0    ~ 0.4s  서브문구 + 로고가 아래에서 위로 올라오며 불투명도 0 → 100
 *   0.4  ~ 1.2s  0.8초간 정지 유지
 *   1.2  ~ 1.6s  커튼업 — 전체가 위로 빠지며 랜딩페이지가 드러남
 */
const RISE_MS = 400;
const HOLD_MS = 800;
const CURTAIN_MS = 400;
const TOTAL_MS = RISE_MS + HOLD_MS + CURTAIN_MS;
const REVEAL_MS = RISE_MS + HOLD_MS;

function launchPopupAlreadySeen() {
  try {
    /* v2 키만 인정 — 예전 seen 키는 무시 */
    if (localStorage.getItem("hairup:launch-popup-dismissed-v2") === "1") {
      return true;
    }
  } catch {
    // ignore
  }
  return false;
}

export function SplashScreen() {
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    let alreadyPlayed = false;
    try {
      alreadyPlayed = sessionStorage.getItem(SPLASH_SESSION_KEY) === "1";
    } catch {
      // ignore
    }

    let finished = false;

    const finishSplash = () => {
      if (finished) return;
      finished = true;
      try {
        sessionStorage.setItem(SPLASH_SESSION_KEY, "1");
      } catch {
        // ignore
      }
      document.documentElement.classList.add("splash-seen");
      /* 팝업이 이어서 뜰 거면 스크롤 잠금 유지 — 바 출현으로 가로 점프 방지 */
      if (launchPopupAlreadySeen()) {
        document.documentElement.classList.remove("entry-scroll-lock");
      }
      setIsDone(true);
      window.dispatchEvent(new Event(SPLASH_DONE_EVENT));
    };

    if (alreadyPlayed) {
      document.documentElement.classList.add("splash-seen");
      setIsDone(true);
      window.dispatchEvent(new Event(SPLASH_REVEAL_EVENT));
      window.dispatchEvent(new Event(SPLASH_DONE_EVENT));
      return;
    }

    document.documentElement.classList.add("entry-scroll-lock");
    const revealTimer = window.setTimeout(() => {
      window.dispatchEvent(new Event(SPLASH_REVEAL_EVENT));
    }, REVEAL_MS);
    const timer = window.setTimeout(finishSplash, TOTAL_MS);

    return () => {
      window.clearTimeout(revealTimer);
      window.clearTimeout(timer);
      /* Strict remount 중엔 overflow 를 풀지 않음 — 스크롤바 깜빡임/가로 점프 방지 */
    };
  }, []);

  if (isDone) return null;

  return (
    <div
      data-splash
      aria-hidden
      className="splash-root fixed inset-0 z-50 flex items-center justify-center bg-forest"
    >
      <div className="splash-content">
        <p className="splash-sub">{splash.eyebrow}</p>
        <Wordmark width={151} className="splash-logo" />
      </div>
    </div>
  );
}
