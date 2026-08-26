"use client";

import { GlyphLines } from "@/components/copy/GlyphLines";
import { Canvas } from "@/components/layout/Canvas";
import { pricing } from "@/content/site";
import { onHashClick } from "@/lib/scroll-to-hash";

/**
 * 05_Pricing Plan — 시안 2-D · 3-D · 4-D
 *
 * 카피 스택: Key Benefits(04) 와 동일 — SECTION-TAG + SECTION-COPY-TITLE/DESC
 * tag→title 42 · title→desc 36 · desc→카드 150
 * 카드 584 × 2 · gap 32 · 좌우 거터 120
 */
const GUTTER = 120;
const CARD_GAP = 32;
const CARD_PAD_X = 60;
const CARD_PAD_Y = 65;

const TAG_TOP = 300;
const TAG_H = 13;
const GAP_TAG_TITLE = 42;
const GAP_TITLE_DESC = 36;
/** 40/600 · lh 1.375 · 2줄 · text-box trim(cap alphabetic) 실측 */
const TITLE_H = 84.3;
/** 17/400 · lh 1.588 · 2줄 · text-box trim(cap alphabetic) 실측 */
const DESC_H = 39.4;
const GAP_DESC_CARDS = 150;
/** tag→title 42 · title→desc 36 · desc→카드 150 */
const COPY_STACK_H = TAG_H + GAP_TAG_TITLE + TITLE_H + GAP_TITLE_DESC + DESC_H;
const CARD_TOP = TAG_TOP + COPY_STACK_H + GAP_DESC_CARDS;

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
      <div
        className="SECTION-COPY-STACK SECTION-COPY-STACK--center absolute inset-x-0"
        style={{ top: `${TAG_TOP}px` }}
      >
        <p className="SECTION-TAG text-forest">
          {pricing.tag.before}
          <em>{pricing.tag.article}</em>
          {pricing.tag.after}
        </p>

        <h2 className="SECTION-COPY-TITLE text-kr">
          <GlyphLines lines={pricing.headline} />
        </h2>

        <p className="SECTION-COPY-DESC text-kr">
          <GlyphLines lines={pricing.body} />
        </p>
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
