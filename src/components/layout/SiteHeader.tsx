"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { Wordmark } from "@/components/brand/Wordmark";
import { cta, nav } from "@/content/site";
import { onHashClick } from "@/lib/scroll-to-hash";

/**
 * 헤더 시안(01-D) 지시사항
 *   로고      left 120 · top 36 · w 144 · h auto · display block
 *   GNB       flex · gap 65 · Inter 17/400 · #8C847A
 *             호버 시 영문 숨기고 한글(Noto Sans KR 400 · #1C1A19)
 *   CTA       200 × 56 · bg #2C3A2E · radius 2 · Inter 17/400 · #FAF8F5
 *             호버 bg #1E2921
 *
 * 시안은 메뉴가 한글이지만, 영문을 기본으로 두고 가리키면 한글이 아래에서
 * 굴러 올라오도록 했습니다. 한글이 올라온 자리는 시안 그대로입니다.
 *
 * 두 언어를 같은 격자 칸에 겹쳐 두어 칸 폭이 둘 중 넓은 쪽으로 잡히므로,
 * 글자가 바뀌어도 메뉴 간격이 흔들리지 않습니다.
 */
const ROW = 24;
const NAV_RISE = 2;
const EN_DROP = 1;
const KO_LIFT = 1;

const ROLL = "duration-500 ease-[cubic-bezier(0.65,0,0.35,1)]";

export function SiteHeader() {
  return (
    <header className="absolute top-[36px] left-[120px] flex h-[56px] w-[1200px] items-center">
      {/* .HEADER-LOGO .LOGO-IMG — width 144 · height auto · display block */}
      <Link href="/" className="block shrink-0 text-ink">
        <Wordmark width={144} />
      </Link>

      {/* 로고 ↔ CREATE BRAND 사이 정중앙 */}
      <nav
        className="flex h-full flex-1 items-center justify-center gap-x-[65px]"
        style={{ transform: `translateY(-${NAV_RISE}px)` }}
        aria-label="주요 메뉴"
      >
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={(e) => onHashClick(e, item.href)}
            className="group grid overflow-hidden text-center text-stone transition-colors duration-300 hover:text-ink focus-visible:text-ink"
            style={{ height: `${ROW}px` }}
          >
            <Roll
              en={item.en}
              ko={item.ko}
              /* .GNB-ITEM A — Inter 17/400 · #8C847A */
              enClassName="font-latin text-[17px] font-normal"
              /* .TXT-KR — Noto Sans KR 400 · #1C1A19 (호버 시 표시) */
              koClassName="text-kr text-[17px] font-normal"
            />
          </Link>
        ))}
      </nav>

      {/* .BTN-CREATE-BRAND — 200×56 · #2C3A2E · radius 2 · hover #1E2921 */}
      <Link
        href={cta.href}
        onClick={(e) => onHashClick(e, cta.href)}
        className="rounded-btn group inline-flex h-[56px] w-[200px] shrink-0 items-center justify-center overflow-hidden bg-forest text-porcelain no-underline transition-colors duration-300 hover:bg-forest-deep focus-visible:bg-forest-deep"
      >
        <span className="grid overflow-hidden" style={{ height: `${ROW}px` }}>
          <Roll
            en={cta.en}
            ko={cta.ko}
            /* Inter 17/400 · uppercase · #FAF8F5 */
            enClassName="font-latin text-[17px] font-normal uppercase"
            koClassName="text-kr text-[17px] font-normal"
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
  top: number;
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
