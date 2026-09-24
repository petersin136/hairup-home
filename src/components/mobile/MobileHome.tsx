"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Fragment,
  useEffect,
  useState,
  type MouseEvent,
} from "react";

import { GlyphLines } from "@/components/copy/GlyphLines";
import { MobileAutomatedCrm } from "@/components/mobile/MobileAutomatedCrm";
import { MobileFaq } from "@/components/mobile/MobileFaq";
import { MobilePricing } from "@/components/mobile/MobilePricing";
import { DemoChat } from "@/components/sections/DemoChat";
import { FooterNewsletter } from "@/components/sections/FooterNewsletter";
import { Wordmark } from "@/components/brand/Wordmark";
import { TopBanner } from "@/components/layout/TopBanner";
import {
  cta,
  dilemma,
  experience,
  footer,
  hero,
  keyBenefits,
  start,
  templateCollection,
} from "@/content/site";
import { openConsultationModal } from "@/lib/consultation-modal";
import { onHashClick, scrollToHash } from "@/lib/scroll-to-hash";
import { saveReturnScroll } from "@/lib/entry-chrome";
import { MOBILE_ARTBOARD_PX } from "@/lib/mobile-artboard";

/**
 * 모바일 전용 홈. HomeShell 이 1440px 미만일 때만 마운트합니다.
 * 레이아웃 기준 폭 390px. 2x 이미지는 1x CSS 표시 크기로 사용.
 */

/**
 * 열림 GNB 메뉴 — 시안 hu_gnb_m.
 * href 는 PC(nav)와 동일. 세 번째 라벨 PRICING → #pricing.
 */
const MGNB_ITEMS = [
  { label: "AI MANAGER", href: "#ai-manager" },
  { label: "TEMPLATES", href: "#template" },
  { label: "PRICING", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
] as const;

export function MobileHome() {
  const [menuOpen, setMenuOpen] = useState(false);

  const unlockPageScroll = () => {
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
  };

  useEffect(() => {
    if (!menuOpen) return;
    const prevBody = document.body.style.overflow;
    const prevHtml = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevBody;
      document.documentElement.style.overflow = prevHtml;
    };
  }, [menuOpen]);

  const goHashFromMenu = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    unlockPageScroll();
    setMenuOpen(false);
    if (scrollToHash(href)) event.preventDefault();
  };

  return (
    <div className="[&_.text-kr]:break-keep min-h-dvh w-full bg-porcelain">
      {/* 띠배너 — hu_TOP_BANNER__M · 콘텐츠 max-width 밖 full-bleed */}
      <TopBanner mobile />

      <div
        className="mx-auto w-full"
        style={{ maxWidth: MOBILE_ARTBOARD_PX }}
      >
      {/* 헤더 — 시안 hu_hero_detail_1_m · 스크롤 다운 시 sticky 없이 상단으로 퇴장 */}
      <header data-site-header className="relative z-50 bg-porcelain">
        <div className="M-HEAD-M">
          <Link
            href="/"
            className="M-LOGO-M"
            aria-label="hair up"
            onClick={() => setMenuOpen(false)}
          >
            <Wordmark width={91} />
          </Link>
          <button
            type="button"
            className="M-BURGER-M"
            aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {/* 시안 hamburger_menu · 37×10 · 긴 위 / 짧은 아래 · 우측 정렬 */}
            <svg viewBox="0 0 37 10" fill="currentColor" aria-hidden>
              <rect x="0" y="0" width="37" height="1.5" />
              <rect x="12.33" y="8.5" width="24.67" height="1.5" />
            </svg>
          </button>
        </div>
      </header>

      <main>
        {/* Hero — 모바일 시안 hu_main · 390 기준 · 카드 350×552 */}
        <section id="hero" className="M-HERO bg-porcelain">
          <div className="CARD-CONTAINER">
            <Image
              className="CARD-BG"
              src={hero.media.src}
              alt={hero.media.alt}
              width={hero.media.width}
              height={hero.media.height}
              sizes="350px"
              priority
              unoptimized
            />
            <div className="CARD-COPY">
              <h1 className="CARD-TITLE">
                <GlyphLines lines={hero.headline} />
              </h1>
              <p className="CARD-DESCRIPTION">
                <GlyphLines lines={hero.bodyMobile} />
              </p>
            </div>
            <button
              type="button"
              className="CREATE-BRAND-BTN"
              onClick={() => openConsultationModal()}
            >
              <span className="CREATE-BRAND-TEXT">{cta.en}</span>
              <svg
                className="CREATE-BRAND-ARROW"
                viewBox="0 0 15 12.27"
                fill="none"
                aria-hidden
              >
                <path
                  d="M0 6.14H14.5M9.37 0.5L14.5 6.14L9.37 11.78"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </section>

        {/* Dilemma — 모바일 시안 hu_dilemma_m · 390 기준 */}
        <section id="dilemma" className="M-DILEMMA bg-porcelain">
          <p className="M-DILEMMA-TAG">
            {dilemma.tag.before}
            <em>{dilemma.tag.article}</em>
            {dilemma.tag.after}
          </p>

          <h2 className="M-DILEMMA-HEAD">
            <GlyphLines lines={dilemma.headline} />
          </h2>

          <p className="M-DILEMMA-BODY">
            <GlyphLines lines={dilemma.bodyMobile} />
          </p>

          <div className="M-DILEMMA-FIGURES">
            {/* PC버전에서 머리자르고 있는 사진 */}
            <div className="M-DILEMMA-IMG-1">
              <Image
                src={dilemma.images[0]}
                alt=""
                fill
                className="object-cover"
                sizes="210px"
                unoptimized
              />
            </div>
            {/* PC버전에서 손과 핸드폰 있는 사진 */}
            <div className="M-DILEMMA-IMG-2">
              <Image
                src={dilemma.images[1]}
                alt=""
                fill
                className="object-cover"
                sizes="240px"
                unoptimized
              />
            </div>
          </div>

          <p className="M-DILEMMA-EMPHASIS">
            <GlyphLines lines={dilemma.emphasisMobile} />
          </p>
        </section>

        {/* Experience — 모바일 시안 hu_experience_m · 390 기준 */}
        <section id="ai-manager" className="M-EXPERIENCE bg-porcelain">
          {/* HU_EX_BG.PNG 2x 700×760 → 표시 350×380 */}
          <div className="M-EXPERIENCE-CARD">
            <Image
              src={experience.mobileBg}
              alt=""
              width={350}
              height={380}
              unoptimized
              quality={100}
              sizes="350px"
              className="M-EXPERIENCE-BG"
              priority={false}
            />
            <div className="M-EXPERIENCE-COPY">
              <p className="M-EXPERIENCE-TAG">
                {experience.tag.before}
                <em>{experience.tag.article}</em>
                {experience.tag.after}
              </p>
              <h2 className="M-EXPERIENCE-HEAD">
                <GlyphLines lines={experience.headlinePc} />
              </h2>
              <p className="M-EXPERIENCE-BODY">
                <GlyphLines lines={experience.bodyMobile} />
              </p>
              <a
                href={experience.kakaoDemo.href}
                target="_blank"
                rel="noopener noreferrer"
                className="M-EXPERIENCE-BTN"
              >
                {experience.kakaoDemo.label}
              </a>
            </div>
          </div>

          <div className="M-EXPERIENCE-CHAT">
            <DemoChat fill />
          </div>
        </section>

        {/* Automated CRM — 시안 hu_automated_01~04_m · 390 */}
        <MobileAutomatedCrm />

        {/* Key Benefits — 시안 hu_key_benefits_m · 390 세로 스택 (가로 스와이프 없음) */}
        <section id="key-benefits" className="M-KEY-BENEFITS bg-porcelain">
          <header className="M-KB-HEAD">
            <p className="M-KB-TAG">
              {keyBenefits.tagMobile.before}
              <em>{keyBenefits.tagMobile.article}</em>
              {keyBenefits.tagMobile.after}
            </p>
            <h2 className="M-KB-TITLE">
              <GlyphLines lines={keyBenefits.headline} />
            </h2>
            <p className="M-KB-DESC">
              <GlyphLines lines={keyBenefits.body} />
            </p>
          </header>
          <div className="M-KB-LIST">
            {keyBenefits.cards.map((card) => (
              <article key={card.title} className="M-KB-CARD">
                <div className="M-KB-THUMB">
                  {/* eslint-disable-next-line @next/next/no-img-element -- srcset 2×/lg 분기 */}
                  <img
                    src={card.image}
                    srcSet={`${card.image} 1116w, ${card.imageLg} 1920w`}
                    sizes="350px"
                    alt=""
                    width={1116}
                    height={720}
                    decoding="async"
                    className="M-KB-THUMB-IMG"
                  />
                </div>
                <h3 className="M-KB-CARD-TITLE">{card.title}</h3>
                <p className="M-KB-CARD-DESC">
                  <GlyphLines lines={card.bodyMobile} />
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Template collection — 시안 hu_template_01~05_m */}
        <section id="template" className="M-TEMPLATE">
          <div className="M-TEMPLATE-HEAD">
            <p className="TEMPLATE-HEADER__TAG">
              {templateCollection.tagMobile.before}
              <em>{templateCollection.tagMobile.article}</em>
              {templateCollection.tagMobile.after}
            </p>
            <h2 className="TEMPLATE-TITLE text-kr">
              <GlyphLines lines={templateCollection.headline} />
            </h2>
            <p className="TEMPLATE-DESC text-kr">
              <GlyphLines lines={templateCollection.body} />
            </p>
          </div>

          <div
            className="M-TEMPLATE-SWIPE"
            style={{ touchAction: "pan-x pan-y" }}
          >
            <div className="M-TEMPLATE-TRACK">
              {templateCollection.templates.map((template) => {
                const isDark =
                  "cardTheme" in template && template.cardTheme === "dark";
                return (
                  <article
                    key={template.index}
                    className={
                      isDark
                        ? "TEMPLATE-CARD TEMPLATE-CARD--DARK"
                        : "TEMPLATE-CARD"
                    }
                  >
                    <div className="TEMPLATE-CARD__IMG">
                      <Image
                        src={template.imageMobile}
                        alt={`${template.name} 템플릿 미리보기`}
                        width={320}
                        height={393}
                        sizes="320px"
                        unoptimized
                      />
                    </div>
                    <p className="TEMPLATE-CARD__TAG">{template.cardTag}</p>
                    <p className="TEMPLATE-CARD__TITLE">{template.name}</p>
                    <p className="TEMPLATE-CARD__DESC text-kr">
                      {template.cardDescMobile}
                    </p>
                    <a
                      className="TEMPLATE-CARD__BTN"
                      href={template.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="TEMPLATE-CARD__BTN-TEXT text-kr">
                        {templateCollection.ctaMobile}
                      </span>
                    </a>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="M-MARQUEE" aria-hidden>
            <div className="MARQUEE-TRACK mobile-marquee-track">
              {Array.from({ length: 2 }, (_, loop) =>
                templateCollection.marquee.map((phrase) => (
                  <span key={`${loop}-${phrase}`} className="MARQUEE">
                    {phrase}
                  </span>
                )),
              )}
            </div>
          </div>
        </section>

        {/* Pricing — 비교표 + 가로 스와이프 카드 */}
        <MobilePricing />

        {/* FAQ — PC 아코디언을 390 · 좌우 20 에 축소 */}
        <MobileFaq />

        {/* Start CTA — 시안 hu_cta_banner_footer_m · 390 · HU_CTA_BG 2x→350×480 */}
        <section id="start" className="M-CTA">
          <div className="M-CTA-CARD">
            <picture className="M-CTA-CARD-BG">
              <img
                src="/images/hu_cta_bg.png"
                alt=""
                width={350}
                height={480}
                decoding="async"
                draggable={false}
              />
            </picture>
            <h2 className="M-CTA-TITLE">
              <GlyphLines lines={start.headline} />
            </h2>
            <p className="M-CTA-DESC">
              <GlyphLines lines={start.bodyMobile} />
            </p>
            <button
              type="button"
              className="M-CTA-BTN"
              onClick={() => openConsultationModal()}
            >
              {start.cta.label}
            </button>
          </div>
        </section>

        {/* Footer — 시안 hu_cta_banner_footer_m · 390×1030 */}
        <footer id="footer" className="M-FOOTER">
          <FooterNewsletter mobile />

          {footer.columns
            .filter((column) => column.title !== "INDEX")
            .map((column) => (
              <div key={column.title} className="M-FOOTER-COL">
                <p
                  className={
                    column.title === "CONTACT" ? "M-FOOTER-LABEL-CONTACT" : "M-FOOTER-LABEL-CONNECT"
                  }
                >
                  {column.title}
                </p>
                <ul
                  className={
                    column.title === "CONNECT"
                      ? "M-FOOTER-LINKS M-FOOTER-LINKS--inline"
                      : "M-FOOTER-LINKS"
                  }
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

          <p className="M-FOOTER-COMPANY">
            <GlyphLines lines={[...footer.companyPc, footer.copyright]} />
          </p>

          <nav className="M-FOOTER-LEGAL" aria-label="약관">
            {footer.legal.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={saveReturnScroll}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link href="/" className="M-FOOTER-LOGO" aria-label="hair up">
            <Wordmark width={350} className="h-auto w-full" />
          </Link>
        </footer>
      </main>
      </div>

      {menuOpen ? (
        <div className="MGNB_PANEL">
          <TopBanner mobile />
          <div className="MGNB_ARTBOARD">
            <div className="MGNB_BODY">
              <div className="MGNB_HEAD">
                <Link
                  href="/"
                  className="MGNB_LOGO"
                  aria-label="hair up"
                  onClick={() => setMenuOpen(false)}
                >
                  <Wordmark width={91} />
                </Link>
                <button
                  type="button"
                  className="MGNB_CLOSE"
                  aria-label="메뉴 닫기"
                  onClick={() => setMenuOpen(false)}
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
                    <path
                      d="M0 0L18 18M18 0L0 18"
                      fill="none"
                      stroke="#1C1A19"
                      strokeWidth="1.5"
                    />
                  </svg>
                </button>
              </div>

              <nav className="MGNB_MENU" aria-label="주요 메뉴">
                {MGNB_ITEMS.map((item, i) => (
                  <Fragment key={item.href}>
                    {i > 0 ? <br /> : null}
                    <Link
                      href={item.href}
                      className="GNB_TITLE"
                      onClick={(e) => goHashFromMenu(e, item.href)}
                    >
                      {item.label}
                    </Link>
                  </Fragment>
                ))}
              </nav>

              <a
                href={experience.kakaoDemo.href}
                target="_blank"
                rel="noopener noreferrer"
                className="KAKAO-DEMO-BTN"
              >
                <span className="KAKAO-DEMO-TEXT">
                  {experience.kakaoDemo.label}
                </span>
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
