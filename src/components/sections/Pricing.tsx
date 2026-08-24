"use client";

import { GlyphLines } from "@/components/copy/GlyphLines";
import { Canvas } from "@/components/layout/Canvas";
import { CountUp } from "@/components/motion/CountUp";
import { RainInLines } from "@/components/motion/RainInLines";
import { pricing } from "@/content/site";
import { onHashClick } from "@/lib/scroll-to-hash";

/**
 * 05_Pricing Plan — 시안 2-D · 3-D · 4-D
 *
 * 보드 1 VS · 보드 2 STARTER · 보드 3 BRANDING
 * 카드 584 × 2 · gap 32 · 좌우 거터 120
 */
const GUTTER = 120;
const CARD_W = 584;
const CARD_GAP = 32;
const CARD_PAD_X = 60;
const CARD_PAD_Y = 65;

const TAG_TOP = 300;
const GAP_TAG_TITLE = 42;
const TAG_SIZE = 13;
const SECTION_TITLE = {
  top: TAG_TOP + TAG_SIZE + GAP_TAG_TITLE,
  size: 70,
  leading: 1.37,
  lines: 2,
};
const SECTION_DESC = {
  top:
    SECTION_TITLE.top +
    SECTION_TITLE.size * SECTION_TITLE.leading * SECTION_TITLE.lines +
    65,
  size: 22,
  leading: 1.64,
  lines: pricing.body.length,
};
const COMPARE_TOP =
  SECTION_DESC.top +
  SECTION_DESC.size * SECTION_DESC.leading * SECTION_DESC.lines +
  150;
const COMPARE_BLOCK = 24 + 23 + 50 + 36 + 60;
const CARD_TOP = COMPARE_TOP + COMPARE_BLOCK + 120;

const featureBlock = (count: number, extraLines = 0) =>
  count * (Math.ceil(22 * 1.64) + 8 + Math.ceil(17 * 1.45)) +
  extraLines * Math.ceil(17 * 1.45) +
  (count - 1) * 45;

/** BRANDING 이 기능 4개 · 마지막 desc 2줄 */
const CARD_H =
  CARD_PAD_Y +
  Math.ceil(44 * 1.2) +
  40 +
  Math.ceil(25 * 1.56) * 2 +
  40 +
  1 +
  35 +
  18 +
  16 +
  72 +
  35 +
  1 +
  35 +
  featureBlock(4, 1) +
  45 +
  61 +
  CARD_PAD_Y;

const HEIGHT = Math.ceil(CARD_TOP + CARD_H);

function formatFee(n: number) {
  return Math.max(0, Math.floor(n)).toLocaleString("en-US");
}

type PlanTone = "starter" | "branding";

function PlanCard({
  tone,
  plan,
}: {
  tone: PlanTone;
  plan: typeof pricing.starter | typeof pricing.branding;
}) {
  const dark = tone === "branding";
  const titleColor = dark ? "text-porcelain" : "text-forest";
  const muted = dark ? "text-mist" : "text-stone";
  const numColor = dark ? "text-porcelain" : "text-forest";
  const plusColor = dark ? "text-porcelain" : "text-stone";
  const featTitle = dark ? "text-porcelain" : "text-forest";
  const featDesc = dark ? "text-porcelain/80" : "text-stone";
  const divider = dark ? "border-mist" : "border-stone";

  const isBranding = "badge" in plan;
  const ctaExternal = plan.cta.href.startsWith("http");

  return (
    <article
      className="rounded-ui box-border flex w-[584px] shrink-0 flex-col"
      style={{
        padding: `${CARD_PAD_Y}px ${CARD_PAD_X}px`,
        backgroundColor: dark ? "#2C3A2E" : "rgba(239, 234, 227, 0.5)",
        boxShadow: dark ? "0px 24px 50px rgba(0, 0, 0, 0.1)" : undefined,
      }}
    >
      {/* 헤더 높이 44px 고정 — BRANDING leading/뱃지 때문에 STARTER 대비 밀리지 않게 */}
      <div className="flex h-[44px] items-end gap-[8px] uppercase">
        {isBranding ? (
          <>
            <span className="font-display text-[44px] font-normal leading-none text-porcelain">
              {plan.name}
            </span>
            <span className="pb-[6px] font-latin text-[18px] font-normal leading-none text-porcelain">
              {plan.badge}
            </span>
          </>
        ) : (
          <h3
            className={`font-display text-[44px] font-normal leading-none ${titleColor}`}
          >
            {plan.name}
          </h3>
        )}
      </div>

      <p
        className={`text-kr text-[25px] font-normal ${muted}`}
        style={{ marginTop: 40, lineHeight: 1.56 }}
      >
        {plan.tagline.map((line) => (
          <span key={line} className="block whitespace-pre">
            {line}
          </span>
        ))}
      </p>

      <hr
        className={`w-full shrink-0 border-0 border-t ${divider}`}
        style={{ marginTop: 40 }}
      />

      {/* 세팅비 + 구독료 — 카드 안쪽 464에 맞춤 · + 좌우 여백을 좁게 */}
      <div
        className="flex w-full min-w-0 items-end justify-center gap-[16px]"
        style={{ marginTop: 35 }}
      >
        <div className="flex w-max shrink-0 flex-col">
          <p
            className={`text-kr whitespace-nowrap text-[18px] font-normal leading-none ${muted}`}
          >
            {plan.prices[0].label}
          </p>
          <p
            className="flex items-baseline gap-[3px] whitespace-nowrap"
            style={{ marginTop: 16 }}
          >
            <span
              className={`font-latin text-[72px] font-bold leading-none tabular-nums ${numColor}`}
            >
              {plan.prices[0].num}
            </span>
            <span
              className={`text-kr shrink-0 text-[16px] font-normal leading-none ${muted}`}
            >
              {plan.prices[0].unit}
            </span>
          </p>
        </div>

        <span
          className={`mb-[22px] shrink-0 font-latin text-[28px] font-normal leading-none ${plusColor}`}
          aria-hidden
        >
          +
        </span>

        <div className="flex w-max shrink-0 flex-col">
          <p
            className={`text-kr whitespace-nowrap text-[18px] font-normal leading-none ${muted}`}
          >
            {plan.prices[1].label}
          </p>
          <p
            className="flex items-baseline gap-[3px] whitespace-nowrap"
            style={{ marginTop: 16 }}
          >
            <span
              className={`font-latin text-[46px] font-bold leading-none tabular-nums ${numColor}`}
            >
              {plan.prices[1].num}
            </span>
            <span
              className={`text-kr shrink-0 text-[16px] font-normal leading-none ${muted}`}
            >
              {plan.prices[1].unit}
            </span>
          </p>
        </div>
      </div>

      <hr
        className={`w-full shrink-0 border-0 border-t ${divider}`}
        style={{ marginTop: 35 }}
      />

      <ul className="flex flex-col" style={{ marginTop: 35, gap: 45 }}>
        {plan.features.map((feature) => (
          <li key={feature.title} className="flex gap-[14px]">
            <span
              className={dark ? "pricing-check pricing-check-light" : "pricing-check"}
              aria-hidden
            />
            <div className="min-w-0 flex-1">
              <p
                className={`text-kr text-[22px] font-normal ${featTitle}`}
                style={{ lineHeight: 1.64 }}
              >
                {feature.title}
              </p>
              <p
                className={`text-kr text-[17px] font-normal ${featDesc}`}
                style={{ marginTop: 4, lineHeight: 1.45 }}
              >
                {feature.desc.map((line) => (
                  <span key={line} className="block whitespace-pre">
                    {line}
                  </span>
                ))}
              </p>
            </div>
          </li>
        ))}
      </ul>

      {dark ? (
        <div className="mt-auto flex justify-center" style={{ paddingTop: 45 }}>
          <a
            href={plan.cta.href}
            onClick={(e) => onHashClick(e, plan.cta.href)}
            {...(ctaExternal
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="rounded-btn text-kr flex items-center justify-center bg-porcelain text-[17px] font-normal text-forest transition-colors duration-200 hover:bg-[#1A251B] hover:text-porcelain"
            style={{ width: 465, height: 61 }}
          >
            {plan.cta.label}
          </a>
        </div>
      ) : (
        <div className="mt-auto flex justify-center" style={{ paddingTop: 45 }}>
          <a
            href={plan.cta.href}
            onClick={(e) => onHashClick(e, plan.cta.href)}
            {...(ctaExternal
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="rounded-btn text-kr flex items-center justify-center text-[17px] font-normal text-espresso transition-colors duration-200 hover:bg-[#E5E1D9]"
            style={{
              width: 465,
              height: 61,
              backgroundColor: "#F4F1EC",
              mixBlendMode: "multiply",
            }}
          >
            {plan.cta.label}
          </a>
        </div>
      )}
    </article>
  );
}

export function Pricing() {
  return (
    <Canvas id="pricing" height={HEIGHT} background="bg-porcelain">
      <p
        className="SECTION-TAG absolute inset-x-0 text-center text-forest"
        style={{ top: `${TAG_TOP}px` }}
      >
        {pricing.tag.before}
        <em>{pricing.tag.article}</em>
        {pricing.tag.after}
      </p>

      <h2
        className="text-kr absolute inset-x-0 text-center text-[70px] font-bold tracking-[-0.01em] text-ink"
        style={{
          top: `${SECTION_TITLE.top}px`,
          lineHeight: SECTION_TITLE.leading,
        }}
      >
        <GlyphLines lines={pricing.headline} />
      </h2>

      <RainInLines
        lines={pricing.body}
        className="text-kr absolute inset-x-0 text-center text-[22px] font-normal tracking-[-0.01em] text-body"
        style={{
          top: `${SECTION_DESC.top}px`,
          lineHeight: SECTION_DESC.leading,
        }}
      />

      <div
        className="absolute inset-x-0 flex items-center justify-center"
        style={{ top: `${COMPARE_TOP}px` }}
      >
        <div className="flex items-center justify-center gap-[80px]">
          <div className="flex w-[320px] flex-col items-center text-center">
            <p className="text-kr text-[24px] font-normal leading-none text-stone">
              {pricing.compare.left.subtitle}
            </p>
            <p
              className="text-kr text-[50px] font-bold leading-none text-stone"
              style={{ marginTop: 23 }}
            >
              {pricing.compare.left.title}
            </p>
            <CountUp
              to={pricing.compare.left.spinTo}
              continuous
              perSecond={110000}
              suffix="+α"
              format={formatFee}
              className="inline-block w-[12ch] text-center font-latin text-[60px] font-bold leading-none text-stone tabular-nums"
              style={{ marginTop: 36 }}
            />
          </div>

          <p className="font-latin shrink-0 text-[60px] font-bold leading-none text-mist">
            VS
          </p>

          <div className="flex w-[320px] flex-col items-center text-center">
            <p className="text-kr text-[24px] font-normal leading-none text-stone">
              {pricing.compare.right.subtitle}
            </p>
            <p
              className="text-kr text-[50px] font-bold leading-none text-ink"
              style={{ marginTop: 23 }}
            >
              {pricing.compare.right.title}
            </p>
            <CountUp
              to={pricing.compare.right.amount}
              durationMs={550}
              className="inline-block w-[12ch] text-center font-latin text-[60px] font-bold leading-none text-ink tabular-nums"
              style={{ marginTop: 36 }}
            />
          </div>
        </div>
      </div>

      <div
        className="absolute flex items-stretch"
        style={{
          left: `${GUTTER}px`,
          top: `${CARD_TOP}px`,
          gap: `${CARD_GAP}px`,
        }}
      >
        <PlanCard tone="starter" plan={pricing.starter} />
        <PlanCard tone="branding" plan={pricing.branding} />
      </div>
    </Canvas>
  );
}
