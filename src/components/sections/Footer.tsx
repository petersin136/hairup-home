"use client";

import Link from "next/link";

import { Wordmark } from "@/components/brand/Wordmark";
import { Canvas } from "@/components/layout/Canvas";
import { FooterNewsletter } from "@/components/sections/FooterNewsletter";
import { footer } from "@/content/site";
import { saveReturnScroll } from "@/lib/entry-chrome";
import { onHashClick } from "@/lib/scroll-to-hash";

/**
 * hu_FOOTER PC
 *
 * .BACKGROUND 시안 표기 739 — PC_08 간격(100/26/50/16/165/29/112/65/18/30)을
 * 글리프 기준으로 쌓으면 브라우저 메트릭상 739를 초과함.
 * 간격·하단 30은 시안대로 두고, 섹션 높이는 콘텐츠에 맞춤(실측 ≈794).
 *
 * .LOGO 660 · left/bottom 30
 * 폼 658 @ left 752 · top 100
 * LEGAL 간격은 시안에 숫자 없음 → 28 유지
 */
const EDGE = 30;
const FORM_WIDTH = 658;
const LOGO_WIDTH = 660;
const FORM_LEFT = 1440 - EDGE - FORM_WIDTH; /* 752 */
const LOGO_LEFT = EDGE;
/** PRIVACY ↔ TERMS 간격 — 시안 PC_08 */
const LEGAL_GAP = 28;

/** PC_08 스택 실측 맞춤 (739 시안보다 큼 — 자가검증 표에 명시) */
const HEIGHT = 794;

export function Footer() {
  return (
    <Canvas id="footer" height={HEIGHT} background="bg-linen">
      <Link
        href="/"
        className="LOGO absolute text-ink"
        style={{
          left: LOGO_LEFT,
          bottom: EDGE,
          width: LOGO_WIDTH,
        }}
        aria-label="hair up"
      >
        <Wordmark width={LOGO_WIDTH} />
      </Link>

      <div
        className="absolute"
        style={{
          left: FORM_LEFT,
          top: 100,
          width: FORM_WIDTH,
        }}
      >
        <FooterNewsletter />

        <div style={{ marginTop: 165 }}>
          <div className="flex items-start" style={{ gap: 112 }}>
            {footer.columns.map((column) => (
              <div key={column.title} className="min-w-0 shrink-0">
                <p
                  className={
                    column.title === "INDEX"
                      ? "INDEX"
                      : column.title === "CONTACT"
                        ? "CONTACT"
                        : "CONNECT"
                  }
                >
                  {column.title}
                </p>
                <ul
                  className="FOOTER_MENU_LIST"
                  style={{ marginTop: 29 }}
                >
                  {column.links.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        onClick={(e) => onHashClick(e, item.href)}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="FOOTER-META">
            <p className="COMPANY_INFO">{footer.companyPc}</p>

            <div className="FOOTER-LEGAL-ROW">
              <p className="COPYRIGHT">{footer.copyright}</p>
              <nav
                className="FOOTER-LEGAL-NAV"
                style={{ gap: LEGAL_GAP }}
                aria-label="약관"
              >
                {footer.legal.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={saveReturnScroll}
                    className="LEGAL_LINKS"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </Canvas>
  );
}
