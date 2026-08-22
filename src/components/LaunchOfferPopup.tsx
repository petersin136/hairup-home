"use client";

import Image from "next/image";
import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";

import { SPLASH_DONE_EVENT } from "@/components/splash/SplashScreen";
import { launchPopup } from "@/content/site";
import {
  hasSeenLaunchPopup,
  markLaunchPopupSeen,
} from "@/lib/entry-chrome";

/** 스플래시 커튼이 완전히 사라진 뒤 팝업까지의 여유 */
const POPUP_AFTER_SPLASH_MS = 400;

function lockScroll() {
  document.documentElement.classList.add("entry-scroll-lock");
}

function unlockScroll() {
  document.documentElement.classList.remove("entry-scroll-lock");
}

/**
 * 런치 오퍼 팝업 — 시안 규격 그대로 (440 × 600)
 *
 * - 닫기/CTA 전까지 저장하지 않음
 * - 예전 localStorage 키는 무시 (v2)
 * - splash-seen 폴링으로 이벤트 유실에도 반드시 표시
 */
export function LaunchOfferPopup() {
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (hasSeenLaunchPopup()) return;

    let alive = true;
    let openTimer: ReturnType<typeof setTimeout> | null = null;
    let pollTimer: ReturnType<typeof setInterval> | null = null;

    const reveal = () => {
      if (!alive || hasSeenLaunchPopup()) return;
      setOpen(true);
      lockScroll();
    };

    const schedule = () => {
      if (!alive || openTimer != null) return;
      openTimer = window.setTimeout(() => {
        openTimer = null;
        reveal();
      }, POPUP_AFTER_SPLASH_MS);
    };

    const onSplashDone = () => schedule();

    window.addEventListener(SPLASH_DONE_EVENT, onSplashDone);

    if (document.documentElement.classList.contains("splash-seen")) {
      schedule();
    } else {
      pollTimer = window.setInterval(() => {
        if (document.documentElement.classList.contains("splash-seen")) {
          if (pollTimer != null) {
            window.clearInterval(pollTimer);
            pollTimer = null;
          }
          schedule();
        }
      }, 50);
    }

    return () => {
      alive = false;
      window.removeEventListener(SPLASH_DONE_EVENT, onSplashDone);
      if (openTimer != null) window.clearTimeout(openTimer);
      if (pollTimer != null) window.clearInterval(pollTimer);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const dismiss = () => {
    markLaunchPopupSeen();
    unlockScroll();
    setOpen(false);
  };

  if (!open || !mounted) return null;

  return createPortal(
    <>
      <div className="popup-overlay" role="presentation" onClick={dismiss} />
      <div
        role="dialog"
        aria-modal
        aria-labelledby={titleId}
        className="popup-card"
      >
        <div className="popup-top">
          <Image
            src={launchPopup.image}
            alt=""
            width={440}
            height={390}
            className="popup-top-image"
            priority
            unoptimized
          />
          <button
            type="button"
            className="btn-close"
            aria-label="닫기"
            onClick={dismiss}
          >
            <svg width="25" height="25" viewBox="0 0 25 25" aria-hidden>
              <path
                d="M6.5 6.5l12 12M18.5 6.5L6.5 18.5"
                stroke="#FFFFFF"
                strokeWidth="1.4"
                strokeLinecap="butt"
              />
            </svg>
          </button>
        </div>

        <div className="popup-body">
          <p id={titleId} className="popup-desc">
            {launchPopup.desc.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>

          <p className="popup-benefit-rate">
            <span className="upto">{launchPopup.benefit.upto}&nbsp;</span>
            <span className="num">{launchPopup.benefit.num}</span>
            <span className="unit">{launchPopup.benefit.unit}</span>
            <span className="limited">{launchPopup.benefit.limited}</span>
          </p>

          <a
            href={launchPopup.cta.href}
            className="popup-cta-btn"
            onClick={dismiss}
          >
            {launchPopup.cta.label}
          </a>
        </div>
      </div>
    </>,
    document.body,
  );
}
