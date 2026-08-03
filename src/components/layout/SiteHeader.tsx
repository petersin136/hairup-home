import Link from "next/link";
import { Wordmark } from "@/components/brand/Wordmark";
import { cta, nav } from "@/content/site";

/**
 * 01_Hero 시안 기준 (1440px)
 *   로고      x 120,  y 36,  w 144
 *   GNB       첫 항목 잉크 시작 x 493, 항목 간격 65px, 잉크 y 54 → 70
 *   CTA 버튼  x 1120 → 1320, y 36 → 92 (200 × 56), 라벨 잉크 y 56 → 71
 *
 * 한글 글자는 em 박스 안에서 아래쪽에 치우쳐 있어 flex 로 중앙 정렬하면
 * 시안보다 몇 px 아래에 놓입니다. -translate-y 로 그만큼 올려 맞춥니다.
 */
export function SiteHeader() {
  return (
    <header className="absolute left-[120px] top-[36px] h-[56px] w-[1200px]">
      <Link href="/" className="absolute left-0 top-0 block text-ink">
        <Wordmark width={144} />
      </Link>

      <nav className="absolute left-[373px] top-0 flex h-full items-center gap-x-[65px]">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-kr -translate-y-[4px] text-[17px] font-medium leading-none text-stone"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <Link
        href={cta.href}
        className="absolute right-0 top-0 flex h-[56px] w-[200px] items-center justify-center rounded-btn bg-forest"
      >
        <span className="text-kr -translate-y-[2px] text-[17px] font-bold leading-none text-cream">
          {cta.label}
        </span>
      </Link>
    </header>
  );
}
