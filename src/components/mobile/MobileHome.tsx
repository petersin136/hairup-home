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
import { DemoChat } from "@/components/sections/DemoChat";
import { FooterNewsletter } from "@/components/sections/FooterNewsletter";
import { Wordmark } from "@/components/brand/Wordmark";
import { TopBanner } from "@/components/layout/TopBanner";
import {
  cta,
  dilemma,
  experience,
  faq,
  footer,
  hero,
  keyBenefits,
  pricing,
  start,
  templateCollection,
} from "@/content/site";
import { onHashClick, scrollToHash } from "@/lib/scroll-to-hash";
import { saveReturnScroll } from "@/lib/entry-chrome";
import { libreBodoni } from "@/lib/fonts";
import { MOBILE_ARTBOARD_PX } from "@/lib/mobile-artboard";

/**
 * 모바일 전용 홈. HomeShell 이 1440px 미만일 때만 마운트합니다.
 * 레이아웃 기준 폭 390px (기존 375). 2x 이미지는 1x CSS 크기로 표시.
 */

/**
 * 열림 GNB 메뉴 — 시안 hu_gnb_m.
 * href 는 PC(nav)와 같지만 세 번째 라벨이 PRICING 이 아니라 MEMBERSHIP 이라 따로 둔다.
 */
const MGNB_ITEMS = [
  { label: "AI MANAGER", href: "#ai-manager" },
  { label: "TEMPLATES", href: "#template" },
  { label: "MEMBERSHIP", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
] as const;

export function MobileHome() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<string | null>(null);

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
      {/* 헤더 — 시안 hu_hero_detail_1_m */}
      <header
        data-site-header
        className="relative sticky top-0 z-50 bg-porcelain"
      >
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

      <main className="[&_section]:scroll-mt-[94px]">
        {/* Hero — 모바일 시안 hu_m_Main · 390 기준 */}
        <section id="hero" className="M-HERO bg-porcelain">
          <div className="CARD-CONTAINER">
            <div className="CARD-MEDIA">
              <Image
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
            </div>
            <a
              className="CREATE-BRAND-BTN"
              href={cta.href}
              onClick={(e) => onHashClick(e, cta.href)}
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
            </a>
          </div>
        </section>

        {/* Dilemma — 모바일 시안 hu_dilemma_m · 390 기준 */}
        <section id="dilemma" className="DILEMMA-M bg-porcelain">
          <p className="__01__THE_DILEMMA__">
            {dilemma.tag.before}
            <em>{dilemma.tag.article}</em>
            {dilemma.tag.after}
          </p>

          <h2 className="DILEMMA-M-TITLE">
            <GlyphLines lines={dilemma.headline} />
          </h2>

          <p className="DILEMMA-M-DESC">
            <GlyphLines lines={dilemma.bodyMobile} />
          </p>

          <div className="DILEMMA-M-FIGURES">
            {/* PC버전에서 머리자르고 있는 사진 */}
            <div className="RECTANGLE_1">
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
            <div className="RECTANGLE_2">
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

          <p className="DILEMMA-M-EMPHASIS">
            <GlyphLines lines={dilemma.emphasisMobile} />
          </p>
        </section>

        {/* Experience — 모바일 시안 hu_experience_m · 390 기준 */}
        <section id="ai-manager" className="M-EXPERIENCE bg-porcelain">
          {/* detail_1_m · .RECTANGLE_1 — SOURCE: HU_EX_BG.PNG (2x 700×660 → 350×330) */}
          <div className="RECTANGLE_1">
            <Image
              src={experience.mobileBg}
              alt=""
              width={350}
              height={330}
              unoptimized
              quality={100}
              sizes="350px"
              className="RECTANGLE_1-BG"
              priority={false}
            />
            <div className="M-EX-COPY">
              <p className="__02__THE_EXPERIENCE__">
                {experience.tag.before}
                <em>{experience.tag.article}</em>
                {experience.tag.after}
              </p>
              <h2 className="M-EX-TITLE">
                <GlyphLines lines={experience.headlinePc} />
              </h2>
              <p className="M-EX-DESC">
                <GlyphLines lines={experience.bodyMobile} />
              </p>
              <a
                href={experience.kakaoDemo.href}
                target="_blank"
                rel="noopener noreferrer"
                className="M-EX-BTN"
              >
                {experience.kakaoDemo.label}
              </a>
            </div>
          </div>

          {/* detail_1_m · .RECTANGLE_19_COPY — DemoChat fill */}
          <div className="RECTANGLE_19_COPY">
            <DemoChat fill />
          </div>
        </section>

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
                  <Image
                    src={card.image}
                    alt=""
                    fill
                    sizes="350px"
                    className="object-cover"
                    unoptimized
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

        {/* Template collection */}
        <section id="template" className="bg-porcelain pt-14 pb-0">
          <div className="px-5">
            <p className="SECTION-TAG text-forest">
              {templateCollection.tagMobile.before}
              <em>{templateCollection.tagMobile.article}</em>
              {templateCollection.tagMobile.after}
            </p>
            <h2 className="text-kr mt-4 text-[30px] font-bold leading-[1.3] text-ink">
              <GlyphLines lines={templateCollection.headline} />
            </h2>
            <p className="text-kr mt-5 text-[15px] leading-[1.65] text-body">
              <GlyphLines lines={templateCollection.body} />
            </p>
          </div>

          <div
            className="mt-8 overflow-x-auto overscroll-x-contain pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            style={{ touchAction: "pan-x pan-y" }}
          >
            <div className="flex w-max gap-4 px-5">
              {templateCollection.templates.map((template) => (
                <article
                  key={template.index}
                  className="relative h-[360px] w-[min(280px,78vw)] shrink-0 overflow-hidden rounded-[6px] bg-black"
                >
                  <Image
                    src={template.image}
                    alt={`${template.name} 템플릿 미리보기`}
                    fill
                    sizes="280px"
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-black/45" aria-hidden />
                  <div className="absolute inset-0 flex flex-col items-center justify-end px-4 pb-5">
                    <p className="flex items-start justify-center font-display text-[18px] font-medium uppercase leading-none text-porcelain">
                      <span className="mr-1.5 font-latin text-[12px] font-medium tracking-normal">
                        {template.index} /
                      </span>
                      {template.name}
                    </p>
                    <div className="mt-5 flex w-full flex-col gap-2">
                      <a
                        href={template.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-btn flex h-10 items-center justify-center border border-porcelain font-latin text-[13px] uppercase text-porcelain no-underline"
                      >
                        {templateCollection.ctas.pc}
                      </a>
                      <a
                        href={template.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-btn flex h-10 items-center justify-center border border-porcelain font-latin text-[13px] uppercase text-porcelain no-underline"
                      >
                        {templateCollection.ctas.mobile}
                      </a>
                    </div>
                  </div>
                </article>
              ))}
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

        {/* Pricing */}
        <section id="pricing" className="bg-porcelain px-5 pb-14 pt-0">
          <p className="SECTION-TAG text-forest">
            {pricing.tagMobile.before}
            <em>{pricing.tagMobile.article}</em>
            {pricing.tagMobile.after}
          </p>
          <h2 className="text-kr mt-4 text-[30px] font-bold leading-[1.3] text-ink">
            <GlyphLines lines={pricing.headline} />
          </h2>
          <p className="text-kr mt-5 text-[15px] leading-[1.65] text-body">
            <GlyphLines lines={pricing.body} />
          </p>

          <div className="mt-12 flex flex-col gap-5">
            <MobilePlanCard tone="starter" plan={pricing.starter} />
            <MobilePlanCard tone="branding" plan={pricing.branding} />
          </div>
        </section>

        {/* FAQ — 모바일 시안 hu_m_FAQ · 390 기준 */}
        <section id="faq" className="bg-porcelain px-4 pt-[80px] pb-[81px] text-center">
          <p className="SECTION-TAG text-center text-forest">
            {faq.tagMobile.before}
            <em>{faq.tagMobile.article}</em>
            {faq.tagMobile.after}
          </p>
          <h2 className="text-kr mt-[22px] text-[32px] font-bold leading-[1.37] tracking-[-0.01em] text-ink">
            <GlyphLines lines={faq.headline} />
          </h2>
          <p className="text-kr mt-[30px] text-[15px] font-normal leading-[24px] tracking-[-0.01em] text-body">
            <span className="block">{faq.body[0]}</span>
            <span className="block">헤어업은 사용하기 쉽고,</span>
            <span className="block">
              몇 가지 설정만으로 간단하게 시작할 수 있습니다.
            </span>
          </p>
          <div className="mt-[51px] flex flex-col gap-4">
            {faq.items.map((item) => (
              <MobileFaqCard
                key={item.q}
                item={item}
                open={openFaq === item.q}
                onToggle={() =>
                  setOpenFaq((cur) => (cur === item.q ? null : item.q))
                }
              />
            ))}
          </div>
        </section>

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
            <a
              href={start.cta.href}
              target="_blank"
              rel="noopener noreferrer"
              className="M-CTA-BTN"
            >
              {start.cta.label}
            </a>
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

type FaqItem = (typeof faq.items)[number];

const FAQ_TONE: Record<FaqItem["tone"], string> = {
  forest: "bg-forest",
  clay: "bg-clay",
  espresso: "bg-espresso",
};

function MobileFaqCard({
  item,
  open,
  onToggle,
}: {
  item: FaqItem;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={open}
      aria-label={
        open
          ? `${item.question.join(" ")} 답변 닫기`
          : `${item.question.join(" ")} 답변 보기`
      }
      onClick={onToggle}
      className="relative h-[191px] w-full cursor-pointer text-left [perspective:1200px]"
    >
      <div
        className="relative h-full w-full transition-transform duration-[600ms] ease-[cubic-bezier(0.65,0,0.35,1)] [transform-style:preserve-3d]"
        style={{
          transform: open ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        <div
          className="absolute inset-0 flex flex-col rounded-[6px] [backface-visibility:hidden]"
          style={{
            padding: "25px 16px 16px",
            backgroundColor: "#EFEAE3",
          }}
        >
          <p className="text-kr text-[18px] font-bold leading-[1.4] tracking-[-0.01em] text-ink [word-break:keep-all]">
            <span className="font-latin font-normal text-stone">{item.q}</span>{" "}
            {item.question.join(" ")}
          </p>
          <div className="mt-auto self-end text-stone opacity-40">
            <Wordmark width={64} />
          </div>
        </div>

        <div
          className={`absolute inset-0 flex flex-col rounded-[6px] text-porcelain [backface-visibility:hidden] [transform:rotateY(180deg)] ${FAQ_TONE[item.tone]}`}
          style={{ padding: "25px 16px 16px" }}
        >
          <p className="text-kr text-[20px] font-bold leading-none tracking-[-0.01em]">
            {item.answerTitle}
          </p>
          <p className="text-kr mt-[16px] text-[13px] font-normal leading-[1.65] tracking-[-0.01em] text-porcelain/90 [word-break:keep-all]">
            {item.answer.join(" ")}
          </p>
        </div>
      </div>
    </button>
  );
}

function MobilePlanCard({
  tone,
  plan,
}: {
  tone: "starter" | "branding";
  plan: typeof pricing.starter | typeof pricing.branding;
}) {
  const dark = tone === "branding";
  return (
    <article
      className={`rounded-[6px] px-5 py-7 ${dark ? "bg-forest text-porcelain" : "bg-linen text-ink"}`}
    >
      <p
        className={`font-display text-[28px] font-normal ${dark ? "text-porcelain" : "text-forest"}`}
      >
        {plan.name}
      </p>
      {"badge" in plan && plan.badge ? (
        <p className="font-latin mt-1 text-[13px] text-porcelain/80">
          {plan.badge}
        </p>
      ) : null}
      <p
        className={`text-kr mt-3 text-[15px] leading-[1.5] ${dark ? "text-porcelain/85" : "text-stone"}`}
      >
        <GlyphLines lines={plan.tagline} />
      </p>
      <div className="mt-6 flex flex-col gap-3">
        {plan.prices.map((p) => (
          <div key={p.label}>
            <p
              className={`text-kr text-[13px] ${dark ? "text-porcelain/70" : "text-stone"}`}
            >
              {p.label}
            </p>
            <p className="mt-1 flex items-baseline gap-1">
              <span
                className={`font-didot-num ${libreBodoni.className} text-[40px] font-bold leading-none tabular-nums ${dark ? "text-porcelain" : "text-forest"}`}
              >
                {p.num}
              </span>
              <span
                className={`text-kr text-[16px] ${dark ? "text-porcelain/80" : "text-stone"}`}
              >
                {p.unit}
              </span>
            </p>
          </div>
        ))}
      </div>
      <ul className="mt-6 flex flex-col gap-4">
        {plan.features.map((f) => (
          <li key={f.title}>
            <p
              className={`text-kr text-[16px] font-medium ${dark ? "text-porcelain" : "text-forest"}`}
            >
              {f.title}
            </p>
            <p
              className={`text-kr mt-1 text-[14px] leading-[1.5] ${dark ? "text-porcelain/75" : "text-stone"}`}
            >
              <GlyphLines lines={("descMobile" in f ? f.descMobile : f.desc)} />
            </p>
          </li>
        ))}
      </ul>
      <a
        href={plan.cta.href}
        onClick={(e) => onHashClick(e, plan.cta.href)}
        {...(plan.cta.href.startsWith("http")
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
        className={`rounded-btn mt-8 flex h-12 items-center justify-center text-[15px] no-underline ${
          dark
            ? "bg-porcelain text-forest"
            : "bg-forest text-porcelain"
        }`}
      >
        {plan.cta.label}
      </a>
    </article>
  );
}
