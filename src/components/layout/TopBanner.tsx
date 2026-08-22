import { topBanner } from "@/content/site";

/**
 * 상단 띠배너 — hu_TOP_BANNER__PC
 *
 * .TOP_BANNER   flex · center · 100% × 45 · #2C3A2E
 * .BANNER_TEXT  14px · #FAF8F5 · letter-spacing 0.01em · center
 * .EN           Inter 600
 * .KR           Noto Sans KR 500
 * .BAR          Inter 400 · margin 0 6px
 */
export function TopBanner() {
  return (
    <div className="TOP_BANNER" role="note">
      <p className="BANNER_TEXT">
        <span className="EN">{topBanner.en}</span>
        <span className="BAR" aria-hidden>
          |
        </span>
        <span className="KR">{topBanner.kr}</span>
      </p>
    </div>
  );
}
