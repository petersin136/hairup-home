"use client";

import Image from "next/image";
import { useEffect, useId, useState } from "react";

import { launchPopup } from "@/content/site";
import {
  hasSeenLaunchPopup,
  markLaunchPopupSeen,
} from "@/lib/entry-chrome";

/**
 * 런치 오퍼 팝업
 * - 데스크톱(≥480): 시안 440×600 절대 배치 유지
 * - 모바일(<480): 스크롤 가능한 플로우 카드 + 큰 닫기
 * - 최초 1회만 표시 (약관 복귀·새로고침 포함)
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
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/45 px-4"
      role="presentation"
      onClick={dismiss}
    >
      {/* —— 모바일 카드 —— */}
      <div
        role="dialog"
        aria-modal
        aria-labelledby={`${titleId}-m`}
        className="relative flex max-h-[min(640px,90dvh)] w-full max-w-[400px] flex-col overflow-hidden rounded-[6px] bg-porcelain shadow-[0_24px_80px_rgba(0,0,0,0.35)] min-[480px]:hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-[440/320] w-full shrink-0">
          <Image
            src={launchPopup.image}
            alt=""
            fill
            sizes="400px"
            className="object-cover"
            priority
          />
          <button
            type="button"
            aria-label="닫기"
            onClick={dismiss}
            className="absolute top-3 right-3 z-10 flex size-11 cursor-pointer items-center justify-center rounded-full bg-[rgba(28,26,25,0.65)] text-porcelain"
          >
            <svg width="14" height="14" viewBox="0 0 12 12" aria-hidden>
              <path
                d="M1 1l10 10M11 1L1 11"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        <div className="flex flex-1 flex-col items-center overflow-y-auto px-5 py-5">
          <p
            id={`${titleId}-m`}
            className="text-kr text-center text-[13px] font-normal leading-[1.64] text-ink"
          >
            {launchPopup.desc.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
          <div className="mt-4 flex flex-wrap items-baseline justify-center gap-x-2 gap-y-1">
            <p className="flex items-baseline text-ink leading-none">
              <span className="font-display text-[36px] font-normal">
                {launchPopup.discount.num}
              </span>
              <span className="font-display text-[24px] font-normal">
                {launchPopup.discount.percent}
              </span>
              <span className="font-display ml-1 text-[24px] italic">
                {launchPopup.discount.off}
              </span>
            </p>
            <p className="text-kr text-[12px] font-medium text-stone">
              ({launchPopup.price.from} → {launchPopup.price.to})
            </p>
          </div>
          <a
            href={launchPopup.cta.href}
            onClick={dismiss}
            className="rounded-btn text-kr mt-5 flex h-12 w-full items-center justify-center bg-forest text-[14px] font-normal text-porcelain no-underline"
          >
            {launchPopup.cta.label}
          </a>
        </div>
      </div>

      {/* —— 데스크톱 카드 (시안 그대로) —— */}
      <div
        role="dialog"
        aria-modal
        aria-labelledby={titleId}
        className="relative box-border hidden h-[600px] w-[440px] overflow-hidden rounded-[6px] bg-porcelain shadow-[0_24px_80px_rgba(0,0,0,0.35)] min-[480px]:block"
        onClick={(e) => e.stopPropagation()}
      >
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

        <div
          className="absolute inset-x-0 flex items-baseline justify-center gap-[8px]"
          style={{ top: 464 }}
        >
          <p className="flex items-baseline text-ink leading-none">
            <span className="font-display text-[40px] font-normal not-italic tracking-[-0.02em]">
              {launchPopup.discount.num}
            </span>
            <span className="font-display text-[28px] font-normal not-italic">
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
