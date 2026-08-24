import { topBanner } from "@/content/site";

/**
 * 상단 띠배너 — hu_TOP_BANNER__PC
 *
 * 페이지 최상단에만 두고, 스크롤에 따라붙지 않습니다.
 */
export function TopBanner({ mobile = false }: { mobile?: boolean }) {
  return (
    <div
      className={["TOP_BANNER", mobile ? "is-mobile" : ""].filter(Boolean).join(" ")}
      role="note"
    >
      <p className="BANNER_TEXT">
        <span className="EN">{topBanner.en}</span>
        <span className="BAR" aria-hidden>
          {mobile ? " | " : "|"}
        </span>
        <span className="KR">{mobile ? topBanner.krMobile : topBanner.kr}</span>
      </p>
    </div>
  );
}
