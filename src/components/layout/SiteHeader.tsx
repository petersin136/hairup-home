"use client";

import Link from "next/link";

import { Wordmark } from "@/components/brand/Wordmark";
import { contact, nav } from "@/content/site";
import { onHashClick } from "@/lib/scroll-to-hash";

/**
 * GNB — hu_GNB_PC · hu_MAIN_SPACING_PC
 *
 * .HEADER-LOGO .LOGO-IMG  144 × auto · display block
 * .GNB-MENU-LIST          flex · align-items center · gap 65
 * .GNB-ITEM A             Inter 15/500 · #1C1A19 · center
 * .TXT-KR                 Noto Sans KR 15/400 · 기본 숨김, 호버 시 영문 숨기고 한글만
 * CONTACT                 메뉴와 동일 스타일 · 호버 시 문의하기 · 카카오 채널
 * padding                 상 45 · 좌우 30 · 하 75
 */
export function SiteHeader() {
  return (
    <header className="GNB">
      <div className="GNB-INNER">
        <Link href="/" className="HEADER-LOGO" aria-label="hair up">
          <Wordmark width={144} className="LOGO-IMG" />
        </Link>

        <nav className="GNB-MENU-LIST" aria-label="주요 메뉴">
          {nav.map((item) => (
            <span key={item.href} className="GNB-ITEM">
              <Link
                href={item.href}
                onClick={(e) => onHashClick(e, item.href)}
              >
                <span className="TXT-EN">{item.en}</span>
                <span className="TXT-KR" aria-hidden>
                  {item.ko}
                </span>
              </Link>
            </span>
          ))}
        </nav>

        <a
          href={contact.href}
          target="_blank"
          rel="noopener noreferrer"
          className="GNB-LOGIN"
        >
          <span className="TXT-EN">{contact.en}</span>
          <span className="TXT-KR" aria-hidden>
            {contact.ko}
          </span>
        </a>
      </div>
    </header>
  );
}
