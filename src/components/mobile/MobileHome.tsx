"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Wordmark } from "@/components/brand/Wordmark";
import { CountUp } from "@/components/motion/CountUp";
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
  process,
  start,
  templateCollection,
  topBanner,
} from "@/content/site";
import { onHashClick } from "@/lib/scroll-to-hash";
import { saveReturnScroll } from "@/lib/entry-chrome";

/**
 * 모바일 전용 홈. HomeShell 이 1440px 미만일 때만 마운트합니다.
 */
export function MobileHome() {
  const [menuOpen, setMenuOpen] = useState(false);
  const chatRef = useRef<DemoChatHandle>(null);

  return (
    <div>
      {/* 띠배너 */}
      <div className="bg-forest px-4 py-2.5 text-center text-[12px] leading-snug text-porcelain">
        <span className="font-latin font-semibold">{topBanner.en}</span>
        <span className="mx-1.5 opacity-60">|</span>
        <span className="text-kr">
          {topBanner.kr}{" "}
          <span className="font-latin font-semibold">{topBanner.offer}</span>
        </span>
      </div>

      {/* 헤더 + 메뉴 (sticky 안에서 열리도록) */}
      <header className="relative sticky top-0 z-50 border-b border-mist/60 bg-porcelain/95 backdrop-blur">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="text-ink" aria-label="hair up">
            <Wordmark width={110} />
          </Link>
          <button
            type="button"
            aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="flex size-10 items-center justify-center rounded-btn text-ink"
          >
            <span className="sr-only">메뉴</span>
            <span className="flex w-5 flex-col gap-1.5" aria-hidden>
              <span
                className={`block h-0.5 w-full bg-ink transition ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`}
              />
              <span
                className={`block h-0.5 w-full bg-ink transition ${menuOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`block h-0.5 w-full bg-ink transition ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`}
              />
            </span>
          </button>
        </div>

        {menuOpen ? (
          <>
            <button
              type="button"
              aria-label="메뉴 닫기"
              className="fixed inset-0 z-40 cursor-default bg-ink/25"
              onClick={() => setMenuOpen(false)}
            />
            <nav className="absolute inset-x-0 top-full z-50 border-b border-mist bg-porcelain px-4 py-3 shadow-[0_12px_24px_rgba(28,26,25,0.08)]">
              <ul className="flex flex-col gap-1">
                {nav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={(e) => {
                        onHashClick(e, item.href);
                        setMenuOpen(false);
                      }}
                      className="text-kr block rounded-btn px-2 py-3 text-[16px] text-ink"
                    >
                      {item.ko}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href={cta.href}
                    onClick={(e) => {
                      onHashClick(e, cta.href);
                      setMenuOpen(false);
                    }}
                    className="rounded-btn mt-2 flex h-12 items-center justify-center bg-forest text-[15px] text-porcelain"
                  >
                    {cta.ko}
                  </Link>
                </li>
              </ul>
            </nav>
          </>
        ) : null}
      </header>

      <main>
        {/* Hero */}
        <section id="hero" className="bg-porcelain px-5 pb-10 pt-10">
          <p className="font-display text-[13px] font-medium uppercase tracking-[0.04em] text-forest">
            {hero.eyebrow}
          </p>
          <h1 className="text-kr mt-5 text-[34px] font-bold leading-[1.25] tracking-[-0.02em] text-ink">
            {hero.headline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="text-kr mt-5 text-[15px] leading-[1.65] text-body">
            {hero.body.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
          <div className="relative mt-8 aspect-[4/3] overflow-hidden rounded-[6px] bg-black">
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src="/videos/hero-visual.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              style={{
                filter: "saturate(0.55) brightness(0.72) contrast(1.08)",
              }}
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(20,18,16,0.28) 0%, rgba(20,18,16,0.18) 45%, rgba(20,18,16,0.42) 100%)",
              }}
              aria-hidden
            />
          </div>
        </section>

        {/* Dilemma */}
        <section id="dilemma" className="bg-porcelain px-5 py-14">
          <p className="font-display text-[13px] font-medium uppercase text-forest">
            <span className="font-latin mr-1.5 text-[12px]">
              {dilemma.eyebrow.index}
            </span>
            {dilemma.eyebrow.label}
          </p>
          <h2 className="text-kr mt-4 text-[30px] font-bold leading-[1.3] text-ink">
            {dilemma.headline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
          <p className="text-kr mt-5 text-[15px] leading-[1.65] text-body">
            {dilemma.body.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
          <div className="mt-8 flex flex-col gap-3">
            {dilemma.images.slice(0, 2).map((src) => (
              <div
                key={src}
                className="relative aspect-[5/3] overflow-hidden rounded-[6px]"
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="100vw"
                  unoptimized
                />
              </div>
            ))}
          </div>
          <p className="text-kr mt-6 text-[15px] leading-[1.65] text-body">
            {dilemma.bodyAside.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
          <div className="mt-6">
            <div className="relative aspect-[5/3] overflow-hidden rounded-[6px]">
              <Image
                src={dilemma.images[2]}
                alt=""
                fill
                className="object-cover"
                sizes="100vw"
                unoptimized
              />
            </div>
          </div>
        </section>

        {/* Experience — iPhone 데모 (시안 HU_TEST) */}
        <section id="ai-manager" className="bg-porcelain px-5 py-14">
          <p className="font-display text-[13px] font-medium uppercase text-forest">
            <span className="font-latin mr-1.5 text-[12px]">
              {experience.eyebrow.index}
            </span>
            {experience.eyebrow.label}
          </p>
          <h2 className="text-kr mt-4 text-[30px] font-bold leading-[1.3] text-ink">
            {experience.headline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
          <p className="text-kr mt-5 text-[15px] leading-[1.65] text-body">
            {experience.body.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>

          <MobileDemoPhone chatRef={chatRef} />

          <div className="mt-8 w-full min-w-0">
            <p className="font-display text-[28px] font-medium leading-none text-forest uppercase">
              {experience.tryAsking.title}
            </p>
            <p className="text-kr mt-4 text-[15px] font-normal leading-[1.64] text-body">
              {experience.tryAsking.body.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
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
            <p className="font-display text-[13px] font-medium uppercase text-ink">
              <span className="font-latin mr-1.5 text-[12px]">
                {automatedCrm.eyebrow.index}
              </span>
              {automatedCrm.eyebrow.label}
            </p>
            <h2 className="text-kr mt-5 text-[30px] font-bold leading-[1.25] text-ink">
              {automatedCrm.headline.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>
            <p className="text-kr mt-5 text-[15px] leading-[1.65] text-body">
              {automatedCrm.body.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
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

        {/* Key benefits — 가로 슬라이드 */}
        <section className="bg-porcelain py-14">
          <div className="px-5">
            <p className="font-display text-[13px] font-medium uppercase text-forest">
              <span className="font-latin mr-1.5 text-[12px]">
                {keyBenefits.eyebrow.index}
              </span>
              {keyBenefits.eyebrow.label}
            </p>
            <h2 className="text-kr mt-4 text-[30px] font-bold leading-[1.3] text-ink">
              {keyBenefits.headline.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>
            <p className="text-kr mt-5 text-[15px] leading-[1.65] text-body">
              {keyBenefits.body.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
          </div>
          <div
            className="mt-8 overflow-x-auto overscroll-x-contain pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            style={{ touchAction: "pan-x pan-y" }}
          >
            <div className="flex w-max gap-4 px-5">
              {keyBenefits.cards.map((card) => (
                <article
                  key={card.title.join("-")}
                  className="w-[min(300px,78vw)] shrink-0"
                >
                  <div className="relative h-[200px] overflow-hidden rounded-[6px] bg-black">
                    <Image
                      src={card.image}
                      alt=""
                      fill
                      sizes="300px"
                      className="object-cover [filter:brightness(1.08)_saturate(1.12)_contrast(1.06)_hue-rotate(-4deg)]"
                      unoptimized
                    />
                  </div>
                  <h3 className="text-kr mt-5 text-[22px] font-semibold leading-[1.35] text-forest">
                    {card.title.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </h3>
                  <p className="text-kr mt-3 text-[15px] leading-[1.6] text-body">
                    {card.body.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="bg-forest px-5 py-14 text-porcelain">
          <h2 className="font-display text-[28px] font-medium uppercase leading-none">
            {process.title}
          </h2>
          <div className="mt-10 flex flex-col gap-8">
            {process.steps.map((step) => (
              <article key={step.index}>
                <p className="font-latin text-[13px] tracking-wide opacity-70">
                  {step.index} {step.caption}
                </p>
                <p className="text-kr mt-3 text-[15px] leading-[1.65] text-porcelain/80">
                  {step.body.join(" ")}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Template collection */}
        <section id="template" className="bg-porcelain py-14">
          <div className="px-5">
            <p className="font-display text-[13px] font-medium uppercase text-forest">
              <span className="font-latin mr-1.5 text-[12px]">
                {templateCollection.eyebrow.index}
              </span>
              {templateCollection.eyebrow.label}
            </p>
            <h2 className="text-kr mt-4 text-[30px] font-bold leading-[1.3] text-ink">
              {templateCollection.headline.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>
            <p className="text-kr mt-5 text-[15px] leading-[1.65] text-body">
              {templateCollection.body.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
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
          <p className="font-display text-[13px] font-medium uppercase text-forest">
            <span className="font-latin mr-1.5 text-[12px]">
              {pricing.eyebrow.index}
            </span>
            {pricing.eyebrow.label}
          </p>
          <h2 className="text-kr mt-4 text-[30px] font-bold leading-[1.3] text-ink">
            {pricing.headline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
          <p className="text-kr mt-5 text-[15px] leading-[1.65] text-body">
            {pricing.body.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>

          <div className="mt-10 grid grid-cols-1 gap-8">
            <div className="text-center">
              <p className="text-kr text-[14px] text-stone">
                {pricing.compare.left.subtitle}
              </p>
              <p className="text-kr mt-2 text-[28px] font-bold text-stone">
                {pricing.compare.left.title}
              </p>
              <CountUp
                to={pricing.compare.left.spinTo}
                continuous
                perSecond={110000}
                suffix="+α"
                format={(n) => Math.floor(n).toLocaleString("en-US")}
                className="mt-3 inline-block min-w-[10ch] font-latin text-[36px] font-bold text-stone tabular-nums"
              />
            </div>
            <p className="text-center font-latin text-[28px] font-bold text-mist">
              VS
            </p>
            <div className="text-center">
              <p className="text-kr text-[14px] text-stone">
                {pricing.compare.right.subtitle}
              </p>
              <p className="text-kr mt-2 text-[28px] font-bold text-ink">
                {pricing.compare.right.title}
              </p>
              <CountUp
                to={pricing.compare.right.amount}
                durationMs={550}
                className="mt-3 inline-block min-w-[10ch] font-latin text-[36px] font-bold text-ink tabular-nums"
              />
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-5">
            <MobilePlanCard tone="starter" plan={pricing.starter} />
            <MobilePlanCard tone="branding" plan={pricing.branding} />
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="bg-porcelain px-5 py-14">
          <p className="font-display text-[13px] font-medium uppercase text-forest">
            <span className="font-latin mr-1.5 text-[12px]">
              {faq.eyebrow.index}
            </span>
            {faq.eyebrow.label}
          </p>
          <h2 className="text-kr mt-4 text-[30px] font-bold leading-[1.3] text-ink">
            {faq.headline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
          <div className="mt-8 flex flex-col gap-4">
            {faq.items.map((item) => (
              <MobileFaqCard key={item.q} item={item} />
            ))}
          </div>
        </section>

        {/* Start CTA */}
        <section
          id="start"
          className="relative overflow-hidden px-5 py-16 text-porcelain"
        >
          <Image
            src="/images/cta-bg.jpg"
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
            quality={90}
          />
          <div className="absolute inset-0 bg-black/45" aria-hidden />
          <div className="relative">
            <h2 className="text-kr text-[32px] font-bold leading-[1.25]">
              {start.headline.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>
            <p className="text-kr mt-5 text-[15px] leading-[1.65] text-porcelain/90">
              {start.body.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
            <a
              href={start.cta.href}
              className="rounded-btn mt-8 inline-flex h-12 items-center justify-center border border-porcelain px-5 text-[15px] text-porcelain"
            >
              {start.cta.label}
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer id="footer" className="bg-linen px-5 py-12">
          <Wordmark width={160} />
          <div className="text-kr mt-6 space-y-2 text-[12px] leading-[1.55] text-ink/70">
            {footer.company.map((row) => (
              <p
                key={row.map((p) => p.label).join("-")}
                className="flex flex-wrap gap-x-5 gap-y-1"
              >
                {row.map((part) => (
                  <span key={part.label} className="whitespace-nowrap">
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
          <p className="font-latin mt-3 text-[12px] text-ink/55">
            {footer.copyright}
          </p>
          <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2">
            {footer.legal.map((p) => (
              <a
                key={p.label}
                href={p.href}
                onClick={saveReturnScroll}
                className="font-latin text-[12px] uppercase text-ink/70 underline underline-offset-2"
              >
                {p.label}
              </a>
            ))}
          </div>
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

function MobileFaqCard({ item }: { item: FaqItem }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <button
      type="button"
      aria-pressed={flipped}
      aria-label={
        flipped
          ? `${item.question.join(" ")} 답변 닫기`
          : `${item.question.join(" ")} 답변 보기`
      }
      onClick={() => setFlipped((v) => !v)}
      className="relative h-[168px] w-full cursor-pointer text-left [perspective:1200px]"
    >
      <div
        className="relative h-full w-full transition-transform duration-[600ms] ease-[cubic-bezier(0.65,0,0.35,1)] [transform-style:preserve-3d]"
        style={{
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* 앞면 — 질문 */}
        <div className="absolute inset-0 flex flex-col rounded-[6px] bg-linen px-4 py-4 [backface-visibility:hidden]">
          <p className="font-latin text-[16px] font-normal leading-none text-stone">
            {item.q}
          </p>
          <p className="text-kr mt-3 text-[18px] font-bold leading-[1.35] text-ink">
            {item.question.join(" ")}
          </p>
          <div className="mt-auto text-stone/40">
            <Wordmark width={64} />
          </div>
        </div>

        {/* 뒷면 — 답변 */}
        <div
          className={`absolute inset-0 flex flex-col rounded-[6px] px-4 py-4 text-porcelain [backface-visibility:hidden] [transform:rotateY(180deg)] ${FAQ_TONE[item.tone]}`}
        >
          <p className="text-kr text-[18px] font-bold leading-none tracking-[-0.01em]">
            {item.answerTitle}
          </p>
          <p className="text-kr mt-3 overflow-y-auto text-[13px] leading-[1.65] text-porcelain/90">
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
                {s.title}
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
        {plan.tagline.join(" ")}
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
                className={`font-latin text-[40px] font-bold tabular-nums ${dark ? "text-porcelain" : "text-forest"}`}
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
              {f.desc.join(" ")}
            </p>
          </li>
        ))}
      </ul>
      <a
        href={plan.cta.href}
        onClick={(e) => onHashClick(e, plan.cta.href)}
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
