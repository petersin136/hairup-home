"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type MouseEvent } from "react";

import { GlyphLines } from "@/components/copy/GlyphLines";
import { FooterNewsletter } from "@/components/sections/FooterNewsletter";
import { Wordmark } from "@/components/brand/Wordmark";
import { TopBanner } from "@/components/layout/TopBanner";
import {
  DemoChat,
  type DemoChatHandle,
  IPHONE_MOCKUP,
  IPHONE_MOCKUP_COMPACT,
} from "@/components/sections/DemoChat";
import {
  automatedCrm,
  banner,
  cta,
  dilemma,
  experience,
  faq,
  footer,
  hero,
  keyBenefits,
  nav,
  pricing,
  start,
  templateCollection,
} from "@/content/site";
import { onHashClick, scrollToHash } from "@/lib/scroll-to-hash";
import { saveReturnScroll } from "@/lib/entry-chrome";
import { libreBodoni } from "@/lib/fonts";

/**
 * 모바일 전용 홈. HomeShell 이 1440px 미만일 때만 마운트합니다.
 */

const MENU_ROLL = "duration-500 ease-[cubic-bezier(0.65,0,0.35,1)]";

export function MobileHome() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuTop, setMenuTop] = useState(94);
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const chatRef = useRef<DemoChatHandle>(null);

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

  useEffect(() => {
    if (!menuOpen) return;
    const update = () => {
      const bottom = headerRef.current?.getBoundingClientRect().bottom;
      if (bottom != null) setMenuTop(bottom);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [menuOpen]);

  return (
    <div className="[&_.text-kr]:break-keep">
      {/* 띠배너 — hu_TOP_BANNER__M */}
      <TopBanner mobile />

      {/* 헤더 + 메뉴 — 시안 hu_m_Menu_open */}
      <header
        ref={headerRef}
        data-site-header
        className="relative sticky top-0 z-50 bg-porcelain"
      >
        <div className="flex h-[56px] items-center justify-between px-4">
          <Link
            href="/"
            className="text-ink"
            aria-label="hair up"
            onClick={() => setMenuOpen(false)}
          >
            <Wordmark width={101} />
          </Link>
          <button
            type="button"
            aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={menuOpen}
            onClick={() => {
              if (!menuOpen) {
                const bottom = headerRef.current?.getBoundingClientRect().bottom;
                if (bottom != null) setMenuTop(bottom);
              }
              setMenuOpen((v) => !v);
            }}
            className="flex size-10 items-center justify-center text-ink"
          >
            <span className="sr-only">메뉴</span>
            <span className="flex w-[22px] flex-col gap-[8px]" aria-hidden>
              <span
                className={`block h-[2px] w-full bg-ink transition ${menuOpen ? "translate-y-[10px] rotate-45" : ""}`}
              />
              <span
                className={`block h-[2px] w-full bg-ink transition ${menuOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`block h-[2px] w-full bg-ink transition ${menuOpen ? "-translate-y-[10px] -rotate-45" : ""}`}
              />
            </span>
          </button>
        </div>
      </header>

      {menuOpen ? (
        <nav
          className="fixed inset-x-0 bottom-0 z-40 bg-porcelain px-4"
          style={{ top: menuTop }}
          aria-label="주요 메뉴"
        >
          <ul className="flex flex-col gap-[33px] pt-[44px]">
            {nav.map((item, i) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={(e) => goHashFromMenu(e, item.href)}
                  className={
                    i === 0
                      ? "text-kr flex h-[32px] items-center text-[32px] font-normal leading-none text-ink"
                      : "group grid h-[32px] overflow-hidden text-left text-[#909090] transition-colors duration-300 hover:text-ink focus-visible:text-ink"
                  }
                >
                  {i === 0 ? (
                    item.ko
                  ) : (
                    <MobileMenuRoll en={item.en} ko={item.ko} />
                  )}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href={cta.href}
            onClick={(e) => goHashFromMenu(e, cta.href)}
            className="rounded-btn group mt-[52px] flex h-[56px] w-full items-center justify-between bg-forest px-[25px] text-porcelain no-underline transition-colors duration-300 hover:bg-forest-deep focus-visible:bg-forest-deep active:bg-forest-deep"
          >
            <span className="grid h-6 overflow-hidden">
              <MobileMenuRoll
                en={cta.en}
                ko={cta.ko}
                enClassName="font-latin text-[17px] font-normal uppercase"
                koClassName="text-kr text-[17px] font-normal"
              />
            </span>
            <svg
              aria-hidden
              width="7"
              height="11"
              viewBox="0 0 7 11"
              fill="none"
              className="shrink-0"
            >
              <path
                d="M1 1L5.5 5.5L1 10"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </nav>
      ) : null}

      <main className="[&_section]:scroll-mt-[94px]">
        {/* Hero — 모바일 시안 hu_m_Main · 375 × 691 */}
        <section id="hero" className="bg-porcelain">
          <div className="px-4 pt-[80px]">
            <p className="font-display text-[13px] font-medium uppercase leading-none tracking-[0.02em] text-forest">
              {hero.eyebrow}
            </p>
            <h1 className="text-kr mt-[18px] text-[32px] font-bold leading-[1.37] tracking-[-0.01em] text-ink">
              <GlyphLines lines={hero.headline} />
            </h1>
            <p className="text-kr mt-[31px] text-[15px] font-normal leading-[24px] tracking-[-0.01em] text-body">
              <GlyphLines lines={hero.body} />
            </p>
          </div>
          <div
            className="relative mt-[42px] h-[280px] w-full overflow-hidden bg-black"
            aria-label="비주얼 영상 영역"
          >
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src="/videos/hero-visual.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
          </div>
        </section>

        {/* Dilemma — 모바일 시안 hu_m_Dilemma · 375 × 946 */}
        <section
          id="dilemma"
          className="bg-porcelain px-4 pt-[80px] pb-[80px] text-center"
        >
          <p className="glyph-trim-latin flex items-center justify-center leading-none text-forest">
            <span className="section-eyebrow-index mr-[6px] text-[12px] font-medium tracking-normal uppercase">
              {dilemma.eyebrow.index}
            </span>
            <span className="font-display text-[13px] font-medium uppercase">
              {dilemma.eyebrow.label}
            </span>
          </p>
          <h2 className="text-kr mt-[19px] text-[32px] font-bold leading-[1.37] tracking-[-0.01em] text-ink">
            <GlyphLines lines={dilemma.headline} />
          </h2>

          <div className="relative mt-[40px] aspect-[343/210] overflow-hidden rounded-[6px] bg-black">
            <Image
              src={dilemma.images[2]}
              alt=""
              fill
              className="object-cover"
              sizes="343px"
              unoptimized
            />
          </div>

          <p className="text-kr mt-[26px] text-[15px] font-normal leading-[24px] tracking-[-0.01em] text-body">
            <GlyphLines lines={dilemma.body} />
          </p>

          <div className="mt-[50px] flex gap-[11px]">
            {dilemma.images.slice(0, 2).map((src) => (
              <div
                key={src}
                className="relative aspect-[166/210] min-w-0 flex-1 overflow-hidden rounded-[6px] bg-black"
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="166px"
                  unoptimized
                />
              </div>
            ))}
          </div>

          <p className="text-kr mt-[26px] text-[15px] font-normal leading-[24px] tracking-[-0.01em] text-body">
            <GlyphLines lines={dilemma.bodyAside} />
          </p>
        </section>

        {/* Experience — iPhone 데모 (시안 HU_TEST) */}
        <section id="ai-manager" className="bg-porcelain px-5 py-14">
          <p className="glyph-trim-latin font-display text-[13px] font-medium uppercase text-forest">
            <span className="section-eyebrow-index mr-1.5 text-[12px] font-medium">
              {experience.eyebrow.index}
            </span>
            {experience.eyebrow.label}
          </p>
          <h2 className="text-kr mt-4 text-[30px] font-bold leading-[1.3] text-ink">
            <GlyphLines lines={experience.headline} />
          </h2>
          <p className="text-kr mt-5 text-[15px] leading-[1.65] text-body">
            <GlyphLines lines={experience.body} />
          </p>

          <MobileDemoPhone chatRef={chatRef} />

          <div className="mt-8 w-full min-w-0">
            <p className="font-display text-[28px] font-medium leading-none text-forest uppercase">
              {experience.tryAsking.title}
            </p>
            <p className="text-kr mt-4 text-[15px] font-normal leading-[1.64] text-body">
              <GlyphLines lines={experience.tryAsking.body} />
            </p>
            <ul className="mt-5 w-full">
              {experience.examples.map((q, i) => (
                <li key={q} className="w-full">
                  {i === 0 ? (
                    <div
                      className="h-px w-full"
                      style={{ background: "rgba(108, 104, 100, 0.7)" }}
                      aria-hidden
                    />
                  ) : null}
                  <button
                    type="button"
                    onClick={() => chatRef.current?.ask(q)}
                    className="text-kr group flex w-full items-center gap-2.5 py-[18px] text-left text-[15px] font-normal leading-none text-[rgba(102,102,102,0.7)] active:text-forest"
                  >
                    <span
                      className="flex size-[22px] shrink-0 items-center justify-center rounded-full bg-[#FEE500]"
                      aria-hidden
                    >
                      <svg
                        width="10"
                        height="12"
                        viewBox="0 0 10 12"
                        fill="none"
                      >
                        <path
                          d="M5 10.5V2.2M5 2.2L1.6 5.6M5 2.2l3.4 3.4"
                          stroke="#191919"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span className="min-w-0 flex-1">{q}</span>
                  </button>
                  <div
                    className="h-px w-full"
                    style={{ background: "rgba(108, 104, 100, 0.7)" }}
                    aria-hidden
                  />
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Automated CRM — 가로 스냅 캐러셀 (세로 길이 ↓) */}
        <section id="automated-crm" className="bg-linen py-14">
          <div className="px-5">
            <p className="font-display text-[13px] font-medium uppercase tracking-[0.025em] text-forest">
              {automatedCrm.tag}
            </p>
            <h2 className="text-kr mt-5 text-[30px] font-bold leading-[1.25] text-ink">
              <GlyphLines lines={automatedCrm.headline} />
            </h2>
            <p className="text-kr mt-5 text-[15px] leading-[1.65] text-body">
              <GlyphLines lines={automatedCrm.body} />
            </p>
          </div>
          <MobileCrmCarousel />
        </section>

        {/* Banner strip */}
        <section className="bg-black px-5 py-16 text-porcelain">
          <div className="flex flex-col gap-8">
            {banner.lines.map((line) => (
              <p
                key={line}
                className="font-display text-[22px] font-normal uppercase leading-none"
              >
                {line}
              </p>
            ))}
          </div>
          <div className="mt-12 text-porcelain">
            <Wordmark width={200} />
          </div>
        </section>

        {/* Key benefits — 모바일 시안 hu_m_Key_Benefits · 375 × 757 */}
        <section id="key-benefits" className="bg-porcelain pt-[80px] pb-[81px]">
          <div className="px-4">
            <p className="font-display text-[13px] font-medium uppercase leading-none tracking-[0.025em] text-forest">
              {keyBenefits.tag.before}
              <em className="italic normal-case">{keyBenefits.tag.article}</em>
              {keyBenefits.tag.after}
            </p>
            <h2 className="text-kr mt-[21px] text-[32px] font-bold leading-[1.37] tracking-[-0.01em] text-ink">
              <GlyphLines lines={keyBenefits.headline} />
            </h2>
            <p className="text-kr mt-[29px] text-[15px] font-normal leading-[24px] tracking-[-0.01em] text-body">
              <GlyphLines lines={keyBenefits.body} />
            </p>
          </div>
          <div
            className="mt-[51px] overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            style={{ touchAction: "pan-x pan-y" }}
          >
            <div className="flex w-max gap-3 px-4">
              {keyBenefits.cards.map((card) => (
                <article key={card.title} className="w-[290px] shrink-0">
                  <div className="relative h-[195px] overflow-hidden rounded-[6px] bg-black">
                    <Image
                      src={card.image}
                      alt=""
                      fill
                      sizes="290px"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <h3 className="text-kr mt-[26px] text-[22px] font-semibold leading-[30px] tracking-[-0.01em] text-forest">
                    {card.title}
                  </h3>
                  <p className="text-kr mt-[20px] text-[15px] font-normal leading-[24px] tracking-[-0.01em] text-body">
                    <GlyphLines lines={card.body} />
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Template collection */}
        <section id="template" className="bg-porcelain py-14">
          <div className="px-5">
            <p className="SECTION-TAG text-forest">
              {templateCollection.tag.before}
              <em>{templateCollection.tag.article}</em>
              {templateCollection.tag.after}
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

          <div className="mt-8 overflow-hidden" aria-hidden>
            <p className="mobile-marquee-track font-display flex w-max whitespace-nowrap text-[14px] font-medium tracking-[0.12em] text-forest uppercase">
              {Array.from({ length: 2 }, (_, loop) =>
                templateCollection.marquee.map((phrase) => (
                  <span key={`${loop}-${phrase}`} className="mx-4 shrink-0">
                    {phrase}
                  </span>
                )),
              )}
            </p>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="bg-porcelain px-5 py-14">
          <p className="SECTION-TAG text-forest">
            {pricing.tag.before}
            <em>{pricing.tag.article}</em>
            {pricing.tag.after}
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

        {/* FAQ — 모바일 시안 hu_m_FAQ · 375 환산 */}
        <section id="faq" className="bg-porcelain px-4 pt-[80px] pb-[81px] text-center">
          <p className="SECTION-TAG text-center text-forest">
            {faq.tag.before}
            <em>{faq.tag.article}</em>
            {faq.tag.after}
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

        {/* Start CTA — 모바일 시안 hu_m_CTA / hu_m_CTA_HOVER · 375 × 620 */}
        <section
          id="start"
          className="relative flex min-h-[620px] flex-col justify-end overflow-hidden px-4 pb-[81px] text-porcelain"
        >
          <Image
            src="/images/cta-bg.jpg"
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
            quality={90}
            priority={false}
          />
          <div className="relative">
            <h2 className="text-kr text-[32px] font-bold leading-[1.37] tracking-[-0.01em]">
              <GlyphLines lines={start.headline} />
            </h2>
            <p
              className="text-kr mt-[31px] text-[15px] font-normal leading-[24px] tracking-[-0.01em]"
              style={{ color: "rgba(250, 248, 245, 0.7)" }}
            >
              <span className="block">{start.body[0]}</span>
              <span className="block">
                이제 그 실력이 온전히 빛나도록 나머지는
              </span>
              <span className="block">헤어업이 하겠습니다.</span>
            </p>
            <a
              href={start.cta.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-kr mt-[61px] flex h-[57px] w-full items-center justify-center rounded-btn border border-porcelain bg-transparent text-[16px] font-medium tracking-[-0.01em] text-porcelain transition-colors duration-200 ease-in-out hover:bg-porcelain hover:text-ink active:bg-porcelain active:text-ink"
            >
              {start.cta.label}
            </a>
          </div>
        </section>

        {/* Footer — 모바일 시안 hu_m_FOOTER */}
        <footer id="footer" className="scroll-mt-[94px] bg-linen px-4 pt-[80px] pb-[30px]">
          <FooterNewsletter compact />

          {footer.columns
            .filter((column) => column.title !== "INDEX")
            .map((column) => (
              <div key={column.title} className="mt-[93px]">
                <p className="font-latin text-[12px] font-bold uppercase leading-none tracking-[0.06em] text-ink">
                  {column.title}
                </p>
                <ul className="mt-[14px]">
                  {column.links.map((item) => (
                    <li
                      key={item.label}
                      className="font-latin text-[15px] font-semibold leading-[1.65] text-ink"
                    >
                      <Link
                        href={item.href}
                        onClick={(e) => onHashClick(e, item.href)}
                        className="transition-colors duration-200 hover:underline hover:underline-offset-[3px]"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

          <div className="text-kr mt-[93px] text-[12px] font-normal leading-[1.55] text-ink/65">
            {footer.company.flat().map((part) => (
              <p key={part.label}>
                {part.label}
                <span className="mx-[0.35em] text-ink/35" aria-hidden>
                  |
                </span>
                {part.value}
              </p>
            ))}
          </div>

          <p className="font-latin mt-[30px] text-[12px] font-normal uppercase leading-none tracking-[0.01em] text-ink/65">
            {footer.copyright}
          </p>

          <nav
            className="mt-[12px] flex items-center gap-[20px]"
            aria-label="약관"
          >
            {footer.legal.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={saveReturnScroll}
                className="font-latin text-[12px] font-normal uppercase leading-none text-ink underline decoration-ink underline-offset-[3px]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/"
            className="mt-[82px] block w-full text-ink"
            aria-label="hair up"
          >
            <Wordmark width={343} className="h-auto w-full" />
          </Link>
        </footer>
      </main>
    </div>
  );
}

type FaqItem = (typeof faq.items)[number];

const FAQ_TONE: Record<FaqItem["tone"], string> = {
  forest: "bg-forest",
  clay: "bg-clay",
  espresso: "bg-espresso",
};

function MobileMenuRoll({
  en,
  ko,
  enClassName = "font-latin text-[32px] font-normal uppercase leading-none",
  koClassName = "text-kr text-[32px] font-normal leading-none",
}: {
  en: string;
  ko: string;
  enClassName?: string;
  koClassName?: string;
}) {
  return (
    <>
      <span
        className={`relative flex items-center whitespace-nowrap [grid-area:1/1] transition-transform ${MENU_ROLL} group-hover:-translate-y-full group-focus-visible:-translate-y-full ${enClassName}`}
      >
        {en}
      </span>
      <span
        aria-hidden
        className={`relative flex translate-y-full items-center whitespace-nowrap [grid-area:1/1] transition-transform ${MENU_ROLL} group-hover:translate-y-0 group-focus-visible:translate-y-0 ${koClassName}`}
      >
        {ko}
      </span>
    </>
  );
}

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

function MobileDemoPhone({
  chatRef,
}: {
  chatRef: React.RefObject<DemoChatHandle | null>;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const frameHeight = IPHONE_MOCKUP_COMPACT.height;
  const visibleHeight = frameHeight - IPHONE_MOCKUP_COMPACT.cropBottom;

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const sync = () => {
      // 가로는 컨테이너 폭에 맞춰 크게 유지
      setScale(el.clientWidth / IPHONE_MOCKUP.width);
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={wrapRef}
      className="mobile-demo-chat mx-auto mt-8 w-full overflow-hidden"
      style={{ height: visibleHeight * scale }}
    >
      <div
        style={{
          width: IPHONE_MOCKUP.width,
          height: frameHeight,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        <DemoChat ref={chatRef} compact />
      </div>
    </div>
  );
}

/** SYSTEM 01–04 가로 스냅 + 자동 전환. 세로 스크롤은 건드리지 않습니다. */
function MobileCrmCarousel() {
  const systems = automatedCrm.systems;
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const activeRef = useRef(0);
  const pauseUntilRef = useRef(0);

  activeRef.current = active;

  const scrollToIndex = (index: number, smooth: boolean) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelectorAll<HTMLElement>("[data-crm-card]")[index];
    if (!card) return;
    /* scrollIntoView 금지 — 모바일에서 페이지 세로 스크롤까지 끌어당김 */
    const left = card.offsetLeft - (el.clientWidth - card.offsetWidth) / 2;
    el.scrollTo({
      left: Math.max(0, left),
      behavior: smooth ? "smooth" : "auto",
    });
  };

  const bumpPause = (ms = 6000) => {
    pauseUntilRef.current = Date.now() + ms;
  };

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(Boolean(entry?.isIntersecting)),
      { threshold: 0.25 },
    );
    io.observe(root);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        const cards = Array.from(
          el.querySelectorAll<HTMLElement>("[data-crm-card]"),
        );
        if (!cards.length) return;
        const mid = el.scrollLeft + el.clientWidth / 2;
        let best = 0;
        let bestDist = Infinity;
        cards.forEach((card, i) => {
          const c = card.offsetLeft + card.offsetWidth / 2;
          const d = Math.abs(c - mid);
          if (d < bestDist) {
            bestDist = d;
            best = i;
          }
        });
        setActive(best);
      });
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      el.removeEventListener("scroll", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    if (paused || !inView) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const id = window.setInterval(() => {
      if (Date.now() < pauseUntilRef.current) return;
      if (!scrollerRef.current) return;
      const next = (activeRef.current + 1) % systems.length;
      scrollToIndex(next, true);
    }, 3800);

    return () => window.clearInterval(id);
  }, [paused, inView, systems.length]);

  const goTo = (i: number) => {
    bumpPause();
    setActive(i);
    scrollToIndex(i, true);
  };

  return (
    <div
      ref={rootRef}
      className="mt-8"
      onPointerDown={() => {
        setPaused(true);
        bumpPause();
      }}
      onPointerUp={() => setPaused(false)}
      onPointerCancel={() => setPaused(false)}
    >
      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-5 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-x pan-y" }}
      >
        {systems.map((s, i) => (
          <article
            key={s.index}
            data-crm-card
            className="w-[82%] shrink-0 snap-center"
            aria-current={i === active ? "true" : undefined}
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-black">
              <div
                className="absolute inset-0 bg-gradient-to-br from-white/12 to-transparent transition-opacity duration-500"
                style={{ opacity: i === active ? 1 : 0.3 }}
                aria-hidden
              />
              <span className="font-latin absolute left-3 top-3 text-[11px] font-medium tracking-[0.12em] text-porcelain/45">
                {s.index}
              </span>
            </div>
            <div
              className="mt-4 transition-all duration-500 ease-out"
              style={{
                opacity: i === active ? 1 : 0.4,
                transform: i === active ? "translateY(0)" : "translateY(6px)",
              }}
            >
              <p className="text-kr text-[14px] font-semibold leading-[1.45] text-ink/85">
                <span className="font-latin mr-1.5 tracking-[0.02em]">
                  {s.index}
                </span>
                {s.title.join(" ")}
              </p>
              <p className="text-kr mt-2 text-[13px] leading-[1.55] text-body">
                {s.body.join(" ")}
              </p>
            </div>
          </article>
        ))}
        <div className="w-[8%] shrink-0" aria-hidden />
      </div>

      <div className="mt-6 flex items-center justify-center gap-2 px-5">
        {systems.map((s, i) => (
          <button
            key={s.index}
            type="button"
            aria-label={`${s.index}로 이동`}
            onClick={() => goTo(i)}
            className="relative h-1.5 overflow-hidden rounded-full bg-ink/15 transition-all duration-300"
            style={{ width: i === active ? 28 : 8 }}
          >
            {i === active && !paused && inView ? (
              <span
                key={`prog-${active}`}
                className="crm-dot-fill absolute inset-y-0 left-0 bg-ink"
              />
            ) : null}
          </button>
        ))}
      </div>
    </div>
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
