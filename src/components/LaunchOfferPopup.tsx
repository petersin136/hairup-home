"use client";

import Image from "next/image";
import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";

import { GlyphLines } from "@/components/copy/GlyphLines";
import { launchPopup } from "@/content/site";
import {
  hasSeenLaunchPopup,
  markLaunchPopupSeen,
} from "@/lib/entry-chrome";
import { openConsultationModal } from "@/lib/consultation-modal";
import { SPLASH_DONE_EVENT } from "@/lib/splash-keys";

/** 스플래시 커튼이 완전히 사라진 뒤 팝업까지의 여유 */
const POPUP_AFTER_SPLASH_MS = 400;
const DESKTOP_MQ = "(min-width: 1440px)";

function lockScroll() {
  document.documentElement.classList.add("entry-scroll-lock");
}

function unlockScroll() {
  document.documentElement.classList.remove("entry-scroll-lock");
}

/**
 * 런치 오퍼 팝업
 * PC 440×600 · 모바일 hu_popup_01~03_m 340×500 (1440 미만)
 *
 * - 닫기/CTA 전까지 저장하지 않음
 * - 예전 localStorage 키는 무시 (v2)
 * - splash-seen 폴링으로 이벤트 유실에도 반드시 표시
 */
export function LaunchOfferPopup() {
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia(DESKTOP_MQ);
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (hasSeenLaunchPopup()) return;

    let alive = true;
    let openTimer: number | null = null;
    let pollTimer: number | null = null;

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

  const goConsult = () => {
    dismiss();
    openConsultationModal();
  };

  if (!open || !mounted || isDesktop === null) return null;

  const overlay = (
    <div className="popup-overlay" role="presentation" onClick={dismiss} />
  );

  if (!isDesktop) {
    return createPortal(
      <>
        {overlay}
        <div
          role="dialog"
          aria-modal
          aria-labelledby={titleId}
          className="M-POPUP"
        >
          <div className="M-POPUP-TOP">
            <Image
              src={launchPopup.imageMobile}
              alt=""
              width={340}
              height={268}
              className="M-POPUP-IMAGE"
              priority
              unoptimized
            />
            <button
              type="button"
              className="M-POPUP-CLOSE"
              aria-label="닫기"
              onClick={dismiss}
            >
              <svg
                className="M-POPUP-CLOSE-ICO"
                width="9"
                height="9"
                viewBox="0 0 9 9"
                aria-hidden
              >
                <path d="M1.5 1.5l6 6M7.5 1.5l-6 6" />
              </svg>
            </button>
          </div>

          <div className="M-POPUP-BODY">
            <p id={titleId} className="M-POPUP-DESC">
              <GlyphLines lines={launchPopup.descMobile} />
            </p>

            <p className="M-POPUP-DISCOUNT">
              {launchPopup.benefit.upto}&nbsp;{launchPopup.benefit.num}
              <span className="M-POPUP-DISCOUNT-PERCENT">
                {launchPopup.benefit.unit}
              </span>
              <span className="M-POPUP-NOTICE">{launchPopup.benefit.limited}</span>
            </p>

            <button
              type="button"
              className="M-POPUP-BTN"
              onClick={goConsult}
            >
              {launchPopup.cta.label}
            </button>
          </div>
        </div>
      </>,
      document.body,
    );
  }

  return createPortal(
    <>
      {overlay}
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
            <svg viewBox="0 0 10 10" aria-hidden>
              <path
                d="M1 1l8 8M9 1L1 9"
                stroke="#FFFFFF"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="popup-body">
          <p id={titleId} className="popup-desc">
            <GlyphLines lines={launchPopup.desc} />
          </p>

          <p className="popup-benefit-rate">
            <span className="upto">{launchPopup.benefit.upto}&nbsp;</span>
            <span className="num">{launchPopup.benefit.num}</span>
            <span className="unit">{launchPopup.benefit.unit}</span>
            <span className="limited">{launchPopup.benefit.limited}</span>
          </p>

          <button
            type="button"
            className="popup-cta-btn"
            onClick={goConsult}
          >
            {launchPopup.cta.label}
          </button>
        </div>
      </div>
    </>,
    document.body,
  );
}
