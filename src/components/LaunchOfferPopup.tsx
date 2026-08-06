"use client";

import Image from "next/image";
import { useEffect, useId, useState } from "react";

import { launchPopup } from "@/content/site";

/**
 * 런치 오퍼 팝업 — 시안 POPUP 실측
 *
 * 카드 440 × 600
 * 이미지 0–390
 * DESC      top 414
 * DISCOUNT  top 464
 * CTA       top 522 · 390×53 · 하단 여백 25
 *
 * .DISCOUNT-RATE
 *   35·%  Bodoni Moda upright 40/28 · weight 400
 *   Off   Playfair italic 28 (Bodoni italic f 하단 루프가 과해서 교체)
 * .PRICE-DETAIL   Noto 12/500 · 할인가 600 · #8C847A
 */
export function LaunchOfferPopup() {
  const titleId = useId();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const splashSeen =
      document.documentElement.classList.contains("splash-seen");
    const delayMs = splashSeen ? 400 : 1650;
    const timer = window.setTimeout(() => setOpen(true), delayMs);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const dismiss = () => setOpen(false);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/45 px-4"
      role="presentation"
      onClick={dismiss}
    >
      <div
        role="dialog"
        aria-modal
        aria-labelledby={titleId}
        className="relative box-border h-[600px] w-[440px] overflow-hidden rounded-[6px] bg-porcelain shadow-[0_24px_80px_rgba(0,0,0,0.35)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* .POPUP-TOP-IMAGE */}
        <div className="absolute top-0 left-0 h-[390px] w-[440px]">
          <Image
            src={launchPopup.image}
            alt=""
            fill
            sizes="440px"
            className="object-cover"
            priority
          />
          <button
            type="button"
            aria-label="닫기"
            onClick={dismiss}
            className="absolute top-[25px] right-[25px] z-10 flex size-[32px] cursor-pointer items-center justify-center rounded-full bg-[rgba(28,26,25,0.35)] text-porcelain transition-colors hover:bg-[rgba(28,26,25,0.55)]"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
              <path
                d="M1 1l10 10M11 1L1 11"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* .POPUP-DESC · top 414 */}
        <p
          id={titleId}
          className="text-kr absolute inset-x-[25px] text-center text-[14px] font-normal text-ink"
          style={{ top: 414, lineHeight: 1.64 }}
        >
          {launchPopup.desc.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>

        {/* .DISCOUNT-RATE + .PRICE-DETAIL
            35·% Bodoni upright · Off Playfair italic(덜 휜 f) · 가격 500 */}
        <div
          className="absolute inset-x-0 flex items-baseline justify-center gap-[8px]"
          style={{ top: 464 }}
        >
          <p className="flex items-baseline text-ink leading-none">
            <span className="font-bodoni text-[40px] font-normal not-italic tracking-[-0.02em]">
              {launchPopup.discount.num}
            </span>
            <span className="font-bodoni text-[28px] font-normal not-italic">
              {launchPopup.discount.percent}
            </span>
            <span className="font-display ml-[4px] text-[28px] font-normal italic">
              {launchPopup.discount.off}
            </span>
          </p>
          <p className="text-kr whitespace-nowrap text-[12px] font-medium leading-none text-stone">
            <span>(</span>
            <span>{launchPopup.price.from}</span>
            <span className="mx-[4px]">→</span>
            <span className="font-semibold">{launchPopup.price.to}</span>
            <span>)</span>
          </p>
        </div>

        {/* .POPUP-CTA-BTN · top 522 · 390×53 · 좌우 25 */}
        <a
          href={launchPopup.cta.href}
          onClick={dismiss}
          className="rounded-btn text-kr absolute left-[25px] flex h-[53px] w-[390px] items-center justify-center bg-forest text-[15px] font-normal text-porcelain no-underline transition-colors duration-200 hover:bg-forest-deep"
          style={{ top: 522 }}
        >
          {launchPopup.cta.label}
        </a>
      </div>
    </div>
  );
}
