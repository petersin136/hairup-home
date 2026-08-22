"use client";

import Image from "next/image";
import { useEffect, useId, useState } from "react";

import { launchPopup } from "@/content/site";
import {
  hasSeenLaunchPopup,
  markLaunchPopupSeen,
} from "@/lib/entry-chrome";

/**
 * 런치 오퍼 팝업 — 시안 규격 그대로 (440 × 600)
 * 최초 1회만 표시 (약관 복귀·새로고침 포함)
 */
export function LaunchOfferPopup() {
  const titleId = useId();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (hasSeenLaunchPopup()) return;

    const splashSeen =
      document.documentElement.classList.contains("splash-seen");
    const delayMs = splashSeen ? 400 : 1650;
    const timer = window.setTimeout(() => {
      markLaunchPopupSeen();
      setOpen(true);
    }, delayMs);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const dismiss = () => {
    markLaunchPopupSeen();
    setOpen(false);
  };

  if (!open) return null;

  return (
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
    </>
  );
}
