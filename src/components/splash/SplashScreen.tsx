"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

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

function coverViewport(el: HTMLElement) {
  const vv = window.visualViewport;
  const width = Math.ceil(vv?.width ?? window.innerWidth);
  const height = Math.ceil(vv?.height ?? window.innerHeight);
  const top = Math.floor(vv?.offsetTop ?? 0);
  const left = Math.floor(vv?.offsetLeft ?? 0);
  el.style.top = `${top}px`;
  el.style.left = `${left}px`;
  el.style.right = "auto";
  el.style.bottom = "auto";
  el.style.width = `${width}px`;
  el.style.height = `${height}px`;
}

export function SplashScreen() {
  const [isDone, setIsDone] = useState(false);
  const [portalEl, setPortalEl] = useState<HTMLElement | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPortalEl(document.body);

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

  useLayoutEffect(() => {
    if (isDone) return;
    const el = rootRef.current;
    if (!el) return;

    const fit = () => coverViewport(el);
    fit();
    window.addEventListener("resize", fit);
    window.visualViewport?.addEventListener("resize", fit);
    window.visualViewport?.addEventListener("scroll", fit);
    return () => {
      window.removeEventListener("resize", fit);
      window.visualViewport?.removeEventListener("resize", fit);
      window.visualViewport?.removeEventListener("scroll", fit);
    };
  }, [isDone, portalEl]);

  if (isDone) return null;

  const node = (
    <div
      ref={rootRef}
      data-splash
      aria-hidden
      className="splash-root flex items-center justify-center bg-forest"
    >
      <div className="splash-content">
        <p className="splash-sub">{splash.eyebrow}</p>
        <Wordmark width={151} className="splash-logo" />
      </div>
    </div>
  );

  return portalEl ? createPortal(node, portalEl) : node;
}
