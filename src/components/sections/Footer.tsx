"use client";

import Link from "next/link";

import { Wordmark } from "@/components/brand/Wordmark";
import { Canvas } from "@/components/layout/Canvas";
import { FooterNewsletter } from "@/components/sections/FooterNewsletter";
import { footer } from "@/content/site";
import { saveReturnScroll } from "@/lib/entry-chrome";
import { onHashClick } from "@/lib/scroll-to-hash";

/**
 * 15_Footer — 시안 수치.
 *
 * 좌·우·하 여백 30. 로고·카피라이트·약관 모두 하단에서 30.
 * 폼 658 @ x 752 / 로고 660 @ x 30 (가로 겹침 없음).
 *
 * Send me PDF: 밑줄 끝에서 70px 안쪽 (레퍼런스 실측).
 */
const HEIGHT = 739;
const EDGE = 30;
const FORM_WIDTH = 658;
const LOGO_WIDTH = 660;
const LOGO_HEIGHT = (LOGO_WIDTH * 101.01) / 267.08;

const FORM_LEFT = 1440 - EDGE - FORM_WIDTH; /* 752 */
const LOGO_LEFT = EDGE;
const LOGO_TOP = HEIGHT - EDGE - LOGO_HEIGHT;

/**
 * 뉴스레터 높이:
 * title26 + gap26 + desc54.08 + gap50 + email26 + gap16 + line1 + gap16 + notice12
 */
const NEWSLETTER =
  26 + 26 + 16 * 1.69 * 2 + 50 + 26 + 16 + 1 + 16 + 12;

/**
 * INDEX / CONTACT / JOIN US — 시안 16-D 실측.
 * justify-between 으로 658을 채우지 않고, 폼 왼쪽 기준 고정 시작점.
 * (레퍼런스 start-start ≈ 224 · 249)
 */
const COL_LEFTS = [0, 224, 473] as const;

/** 링크 줄높이 — 레퍼런스에 맞게 타이트하게 */
const LINK_SIZE = 14;
const LINK_LH = 1.65;
const COL_TITLE = 12;
const COL_TITLE_GAP = 14;
const COL_LINKS = 4;
const COLS_BLOCK_H =
  COL_TITLE + COL_TITLE_GAP + LINK_SIZE * LINK_LH * COL_LINKS;

/** 카피·약관 하단 = 높이 − 30 (로고와 동일) */
const COPYRIGHT_TOP = HEIGHT - EDGE - 12;
/** 사업자 정보 2줄 — 위치·굵기 그대로 (올리지 않음) */
const COMPANY_LINE = 12 * 1.55;
const GAP_AFTER_FAQ = 22;
const COMPANY_TOP = COPYRIGHT_TOP - 19 - COMPANY_LINE * 2;
/** INDEX/CONTACT/JOIN US만 ~1cm 상향 */
const COLS_LIFT = 19;
const COLS_TOP = COMPANY_TOP - GAP_AFTER_FAQ - COLS_BLOCK_H - COLS_LIFT;

export function Footer() {
  return (
    <Canvas id="footer" height={HEIGHT} background="bg-linen">
      <Link
        href="/"
        className="absolute block text-ink"
        style={{
          left: `${LOGO_LEFT}px`,
          top: `${LOGO_TOP}px`,
          width: `${LOGO_WIDTH}px`,
        }}
        aria-label="hair up"
      >
        <Wordmark width={LOGO_WIDTH} />
      </Link>

      <div
        className="absolute"
        style={{
          left: `${FORM_LEFT}px`,
          top: 100,
          width: `${FORM_WIDTH}px`,
        }}
      >
        <FooterNewsletter />
      </div>

      <div
        className="absolute"
        style={{
          left: `${FORM_LEFT}px`,
          top: `${COLS_TOP}px`,
          width: `${FORM_WIDTH}px`,
          height: `${COLS_BLOCK_H}px`,
        }}
      >
        {footer.columns.map((column, index) => (
          <div
            key={column.title}
            className="absolute top-0 min-w-0"
            style={{ left: `${COL_LEFTS[index]}px` }}
          >
            <p className="font-latin text-[12px] font-bold uppercase leading-none tracking-[0.06em] text-ink">
              {column.title}
            </p>
            <ul className="mt-[14px]">
              {column.links.map((item) => (
                <li
                  key={item.label}
                  className={[
                    "font-latin text-[14px] font-semibold text-ink",
                    column.title === "INDEX" ? "uppercase" : "normal-case",
                  ].join(" ")}
                  style={{ lineHeight: LINK_LH }}
                >
                  <Link
                    href={item.href}
                    onClick={(e) => onHashClick(e, item.href)}
                    className="transition-colors duration-200 hover:text-ink hover:underline hover:underline-offset-[3px]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* 사업자 정보 — 카피라이트 위 19 · 항목 justify-between */}
      <div
        className="text-kr absolute text-[12px] font-normal text-ink/65"
        style={{
          left: `${FORM_LEFT}px`,
          top: `${COMPANY_TOP}px`,
          width: `${FORM_WIDTH}px`,
          lineHeight: 1.55,
        }}
      >
        {footer.company.map((row) => (
          <p
            key={row.map((p) => p.label).join("-")}
            className="flex justify-between gap-4"
          >
            {row.map((part) => (
              <span key={part.label} className="shrink-0 whitespace-nowrap">
                {part.label}
                <span className="mx-[0.35em] text-ink/35" aria-hidden>
                  |
                </span>
                {part.value}
              </span>
            ))}
          </p>
        ))}
      </div>

      <p
        className="absolute font-latin text-[12px] font-normal uppercase leading-none text-ink/65"
        style={{
          left: `${FORM_LEFT}px`,
          top: `${COPYRIGHT_TOP}px`,
          letterSpacing: "0.01em",
        }}
      >
        {footer.copyright}
      </p>

      <nav
        className="absolute flex items-center gap-[28px]"
        style={{ right: `${EDGE}px`, top: `${COPYRIGHT_TOP}px` }}
        aria-label="약관"
      >
        {footer.legal.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            onClick={saveReturnScroll}
            className="font-latin text-[12px] font-normal uppercase leading-none text-ink underline decoration-ink underline-offset-[3px] transition-opacity duration-200 hover:opacity-55"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </Canvas>
  );
}
