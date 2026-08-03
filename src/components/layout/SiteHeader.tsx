import Link from "next/link";
import type { ReactNode } from "react";

import { Wordmark } from "@/components/brand/Wordmark";
import { cta, nav } from "@/content/site";

/**
 * 01_Hero 시안 기준 (1440px)
 *   로고      x 120,  y 36,  w 144
 *   GNB       첫 항목 잉크 시작 x 493, 항목 간격 65px, 잉크 y 54 → 70
 *   CTA 버튼  x 1120 → 1320, y 36 → 92 (200 × 56), 라벨 잉크 y 56 → 72
 *
 * 시안은 메뉴가 한글이지만, 영문을 기본으로 두고 가리키면 한글이 아래에서
 * 굴러 올라오도록 했습니다. 한글이 올라온 자리는 시안 그대로입니다.
 *
 * 두 언어를 같은 격자 칸에 겹쳐 두어 칸 폭이 둘 중 넓은 쪽으로 잡히므로,
 * 글자가 바뀌어도 메뉴 간격이 흔들리지 않습니다. 또 두 벌 다 칸 안에서 세로
 * 가운데에 놓이므로 굴러 바뀌어도 글줄이 같은 높이에 남습니다.
 */
const ROW = 24;
/** 칸을 그냥 헤더 가운데 두면 시안보다 2px 아래에 떨어집니다. */
const NAV_RISE = 2;
/*
 * 칸 가운데에 그냥 두면 두 언어의 잉크가 2px 어긋납니다. 한글은 em 박스 안에서
 * 아래로, 라틴 대문자는 밑선 위에만 놓여 위로 치우치기 때문입니다.
 * 1px 씩 서로 반대로 밀어 잉크 가운데를 맞춥니다. (굴리는 데 transform 을 쓰므로 top 으로)
 */
const EN_DROP = 1;
const KO_LIFT = 1;

/** 굴러가는 속도. 07 카드 호버와 같은 결로 맞췄습니다. */
const ROLL = "duration-500 ease-[cubic-bezier(0.65,0,0.35,1)]";

export function SiteHeader() {
  return (
    <header className="absolute left-[120px] top-[36px] h-[56px] w-[1200px]">
      <Link href="/" className="absolute left-0 top-0 block text-ink">
        <Wordmark width={144} />
      </Link>

      <nav
        className="absolute left-[373px] top-0 flex h-full items-center gap-x-[65px]"
        style={{ transform: `translateY(-${NAV_RISE}px)` }}
      >
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group grid overflow-hidden text-stone transition-colors duration-300 hover:text-ink focus-visible:text-ink"
            style={{ height: `${ROW}px` }}
          >
            <Roll
              en={item.en}
              ko={item.ko}
              enClassName="font-latin text-[14px] font-medium tracking-[1.6px]"
              koClassName="text-kr text-[17px] font-medium"
            />
          </Link>
        ))}
      </nav>

      <Link
        href={cta.href}
        className="rounded-btn group absolute right-0 top-0 grid h-[56px] w-[200px] place-items-center overflow-hidden bg-forest text-cream"
      >
        <span className="grid overflow-hidden" style={{ height: `${ROW}px` }}>
          <Roll
            en={cta.en}
            ko={cta.ko}
            enClassName="font-latin text-[14px] font-semibold tracking-[1.4px]"
            koClassName="text-kr text-[17px] font-bold"
          />
        </span>
      </Link>
    </header>
  );
}

type RollProps = {
  en: string;
  ko: string;
  enClassName: string;
  koClassName: string;
};

/**
 * 두 벌을 같은 칸에 겹쳐 두고 위로 한 칸 굴립니다. 평소에는 영문이 칸 안에,
 * 한글은 칸 바로 아래에 숨어 있다가 자리를 맞바꿉니다.
 */
function Roll({ en, ko, enClassName, koClassName }: RollProps) {
  return (
    <>
      <Layer
        className={`${enClassName} transition-transform ${ROLL} group-hover:-translate-y-full group-focus-visible:-translate-y-full`}
        top={EN_DROP}
      >
        {en}
      </Layer>
      <Layer
        className={`${koClassName} translate-y-full transition-transform ${ROLL} group-hover:translate-y-0 group-focus-visible:translate-y-0`}
        top={-KO_LIFT}
        muted
      >
        {ko}
      </Layer>
    </>
  );
}

type LayerProps = {
  className: string;
  /** 잉크 가운데를 맞추기 위한 세로 보정(px) */
  top: number;
  /** 겹쳐 둔 두 벌이 다 읽히지 않도록 숨어 있는 쪽은 낭독에서 뺍니다. */
  muted?: boolean;
  children: ReactNode;
};

function Layer({ className, top, muted, children }: LayerProps) {
  return (
    <span
      aria-hidden={muted}
      className={`relative flex items-center justify-center whitespace-nowrap leading-none [grid-area:1/1] ${className}`}
      style={{ top: `${top}px` }}
    >
      {children}
    </span>
  );
}
