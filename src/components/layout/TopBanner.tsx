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
        {mobile ? (
          /* 중첩 span 은 부모 trim 을 깨므로 두 weight 를 형제 flex 아이템으로 둡니다 */
          <>
            <span className="KR">{topBanner.krMobileRegular}</span>
            <span className="KR KR-STRONG">{topBanner.krMobileBold}</span>
          </>
        ) : (
          <span className="KR">{topBanner.kr}</span>
        )}
      </p>
    </div>
  );
}
