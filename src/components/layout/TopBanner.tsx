import { topBanner } from "@/content/site";

/**
 * 상단 띠배너 — 시안 5-D
 *
 * .TOP_BANNER   flex · center · 100% × 45 · #2C3A2E
 * .BANNER_TEXT  14px · #FAF8F5 · letter-spacing 0.01em · center
 * .EN           Inter 600
 * .KR           Noto Sans KR 400
 * .BAR          Inter 400 · margin 0 6px
 */
export function TopBanner() {
  return (
    <div
      className="flex h-[45px] w-full items-center justify-center bg-forest"
      role="note"
    >
      <p className="flex items-center text-center text-[14px] leading-none tracking-[0.01em] text-porcelain">
        <span className="font-latin font-semibold">{topBanner.en}</span>
        <span className="mx-[6px] font-latin font-normal" aria-hidden>
          |
        </span>
        <span className="text-kr font-normal">{topBanner.kr}</span>
        <span className="font-latin font-semibold">{topBanner.offer}</span>
      </p>
    </div>
  );
}
