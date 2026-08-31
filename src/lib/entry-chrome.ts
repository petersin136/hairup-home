"use client";

import { useEffect } from "react";

import { SPLASH_DONE_EVENT, SPLASH_SESSION_KEY } from "@/lib/splash-keys";

/**
 * 런치 팝업 — 닫기/CTA 후에만 저장.
 * v2: 예전 버그가 open 시점에 seen 을 찍어 영구 차단하던 키와 분리.
 */
export const LAUNCH_POPUP_SEEN_KEY = "hairup:launch-popup-dismissed-v2";
const LEGACY_LAUNCH_POPUP_KEYS = [
  "hairup:launch-popup-seen",
] as const;

/** 약관에서 홈으로 돌아올 때 복원할 스크롤 위치 */
export const RETURN_SCROLL_KEY = "hairup:return-scroll-y";

function clearLegacyLaunchPopupKeys() {
  try {
    for (const key of LEGACY_LAUNCH_POPUP_KEYS) {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    }
  } catch {
    // ignore
  }
}

export function hasSeenLaunchPopup(): boolean {
  clearLegacyLaunchPopupKeys();
  try {
    if (localStorage.getItem(LAUNCH_POPUP_SEEN_KEY) === "1") return true;
  } catch {
    // ignore
  }
  return false;
}

export function markLaunchPopupSeen(): void {
  clearLegacyLaunchPopupKeys();
  try {
    localStorage.setItem(LAUNCH_POPUP_SEEN_KEY, "1");
  } catch {
    // ignore
  }
}

export function markSplashSeen(): void {
  try {
    sessionStorage.setItem(SPLASH_SESSION_KEY, "1");
  } catch {
    // ignore
  }
  document.documentElement.classList.add("splash-seen");
  document.documentElement.classList.remove("entry-scroll-lock");
  window.dispatchEvent(new Event(SPLASH_DONE_EVENT));
}

export function saveReturnScroll(): void {
  try {
    sessionStorage.setItem(
      RETURN_SCROLL_KEY,
      String(Math.round(window.scrollY)),
    );
  } catch {
    // ignore
  }
}

export function consumeReturnScroll(): number | null {
  try {
    const raw = sessionStorage.getItem(RETURN_SCROLL_KEY);
    if (raw == null) return null;
    sessionStorage.removeItem(RETURN_SCROLL_KEY);
    const y = Number(raw);
    return Number.isFinite(y) ? y : null;
  } catch {
    return null;
  }
}

/**
 * 약관/개인정보 페이지 진입 시 호출.
 * 홈으로 돌아와도 스플래시·런치 팝업이 다시 뜨지 않게 합니다.
 */
export function SuppressEntryChrome() {
  useEffect(() => {
    markSplashSeen();
    markLaunchPopupSeen();
  }, []);
  return null;
}

/**
 * 홈 마운트 시 — 약관에서 돌아온 스크롤 위치 또는 #footer 로 복원.
 */
export function RestoreHomeScroll() {
  useEffect(() => {
    const restore = () => {
      const saved = consumeReturnScroll();
      if (saved != null) {
        window.scrollTo(0, saved);
        return;
      }
      if (window.location.hash === "#footer") {
        const nodes = document.querySelectorAll<HTMLElement>("#footer");
        const el =
          [...nodes].find((n) => n.getClientRects().length > 0) ?? nodes[0];
        el?.scrollIntoView({ behavior: "instant", block: "nearest" });
      }
    };

    restore();
    const t1 = window.setTimeout(restore, 0);
    const t2 = window.setTimeout(restore, 120);
    const t3 = window.setTimeout(restore, 400);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, []);

  return null;
}
