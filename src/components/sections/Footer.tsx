import Link from "next/link";

import { Wordmark } from "@/components/brand/Wordmark";
import { Canvas } from "@/components/layout/Canvas";
import { FooterNewsletter } from "@/components/sections/FooterNewsletter";
import { footer } from "@/content/site";

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

const COLS_TOP = 100 + NEWSLETTER + 165;

/** 카피·약관 하단 = 높이 − 30 (로고와 동일) */
const COPYRIGHT_TOP = HEIGHT - EDGE - 12;
const COMPANY_TOP = COPYRIGHT_TOP - 19 - 12;

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
        className="absolute flex justify-between"
        style={{
          left: `${FORM_LEFT}px`,
          top: `${COLS_TOP}px`,
          width: `${FORM_WIDTH}px`,
        }}
      >
        {footer.columns.map((column) => (
          <div key={column.title} className="min-w-0">
            <p className="font-latin text-[12px] font-normal uppercase leading-none tracking-[0.06em] text-ink/90">
              {column.title}
            </p>
            <ul className="mt-[14px]">
              {column.links.map((item) => (
                <li
                  key={item.label}
                  className="font-latin text-[14px] font-normal uppercase text-ink/90"
                  style={{ lineHeight: 1.93 }}
                >
                  <Link
                    href={item.href}
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

      {/* 사업자 정보 — 카피라이트 위 19, 카피·약관은 하단에서 30 */}
      <p
        className="text-kr absolute text-[12px] font-normal leading-none text-ink/65"
        style={{
          left: `${FORM_LEFT}px`,
          top: `${COMPANY_TOP}px`,
          width: `${FORM_WIDTH}px`,
          letterSpacing: "0.055em",
        }}
      >
        {footer.company}
      </p>

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
            className="font-latin text-[12px] font-normal uppercase leading-none text-ink underline decoration-ink underline-offset-[3px] transition-opacity duration-200 hover:opacity-55"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </Canvas>
  );
}
