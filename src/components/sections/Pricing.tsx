"use client";

import { GlyphLines } from "@/components/copy/GlyphLines";
import { Canvas } from "@/components/layout/Canvas";
import { pricing } from "@/content/site";
import { libreBodoni } from "@/lib/fonts";
import { onHashClick } from "@/lib/scroll-to-hash";

/**
 * 06_Pricing Plan — hu_PRICING_PC
 *
 * 헤더: 다른 PC 섹션과 동일
 *   SECTION-TAG 13/500 · title 40/600 · desc 17/400
 *   tag→title 42 · title→desc 36 · 상 300
 * 시안 1440: 카드 584×924 · gap 32 · 거터 120 · desc→카드 101
 * 연간 배너 1200×202 · 카드→배너 32 · 하 200
 */
const GUTTER = 120;
const CARD_W = 584;
const CARD_H = 924;
const CARD_GAP = 32;
const CARD_PAD = 60;
const BTN_H = 55;
const BTN_W = 464;

const TAG_TOP = 300;
const TAG_H = 13;
const GAP_TAG_TITLE = 42;
const TITLE_H = 84.3;
const GAP_TITLE_DESC = 36;
const DESC_H = 39.4;
const GAP_DESC_CARDS = 101;
const COPY_STACK_H = TAG_H + GAP_TAG_TITLE + TITLE_H + GAP_TITLE_DESC + DESC_H;
const CARD_TOP = TAG_TOP + COPY_STACK_H + GAP_DESC_CARDS;

const BANNER_W = 1200;
const BANNER_H = 202;
const GAP_CARDS_BANNER = 32;
const BANNER_TOP = CARD_TOP + CARD_H + GAP_CARDS_BANNER;
const PAD_BOTTOM = 200;
const HEIGHT = Math.ceil(BANNER_TOP + BANNER_H + PAD_BOTTOM);

type PlanTone = "starter" | "branding";

function PlanCard({
  tone,
  plan,
}: {
  tone: PlanTone;
  plan: typeof pricing.starter | typeof pricing.branding;
}) {
  const dark = tone === "branding";
  const nameColor = dark ? "text-porcelain" : "text-ink";
  const muted = dark ? "text-porcelain/80" : "text-stone";
  const numColor = dark ? "text-porcelain" : "text-ink";
  const featTitle = dark ? "text-porcelain" : "text-ink";
  const featDesc = dark ? "text-porcelain/75" : "text-stone";
  const checkColor = dark ? "#FAF8F5" : "#1C1A19";
  const ctaExternal = plan.cta.href.startsWith("http");

  return (
    <article
      className="PRICING-CARD rounded-ui box-border flex shrink-0 flex-col"
      style={{
        width: CARD_W,
        minHeight: CARD_H,
        padding: CARD_PAD,
        backgroundColor: dark ? "#2C3A2E" : "#F4F1EC",
      }}
    >
      <h3 className={`PRICING-NAME ${libreBodoni.className} ${nameColor}`}>
        {plan.name}
      </h3>

      <p className={`PRICING-TAGLINE text-kr ${muted}`}>
        <GlyphLines lines={plan.tagline} />
      </p>

      <div className="PRICING-PRICES">
        {plan.prices.map((row) => (
          <p key={row.label} className="PRICING-PRICE">
            <span className={`PRICING-NUM ${libreBodoni.className} ${numColor}`}>
              {row.num}
            </span>
            <span className={`PRICING-UNIT text-kr ${muted}`}>
              {row.unit} / {row.label}
            </span>
          </p>
        ))}
      </div>

      <hr className={dark ? "PRICING-RULE is-dark" : "PRICING-RULE"} />

      <ul className="PRICING-FEATURES">
        {plan.features.map((feature) => (
          <li key={feature.title} className="PRICING-FEAT">
            <CheckIcon color={checkColor} />
            <div className="min-w-0 flex-1">
              <p className={`PRICING-FEAT-T text-kr ${featTitle}`}>
                {feature.title}
              </p>
              <p className={`PRICING-FEAT-D text-kr ${featDesc}`}>
                <GlyphLines lines={feature.desc} />
              </p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-auto flex justify-center" style={{ paddingTop: 48 }}>
        <a
          href={plan.cta.href}
          onClick={(e) => onHashClick(e, plan.cta.href)}
          {...(ctaExternal
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
          className={
            dark
              ? "rounded-btn text-kr flex items-center justify-center bg-porcelain text-[16px] font-medium text-forest transition-colors duration-200 hover:bg-[#1A251B] hover:text-porcelain"
              : "rounded-btn text-kr flex items-center justify-center bg-forest text-[16px] font-medium text-porcelain transition-colors duration-200 hover:bg-forest-deep"
          }
          style={{ width: BTN_W, height: BTN_H }}
        >
          {plan.cta.label}
        </a>
      </div>
    </article>
  );
}

function CheckIcon({ color }: { color: string }) {
  return (
    <svg
      className="PRICING-CHECK"
      width="18"
      height="16"
      viewBox="0 0 18 16"
      aria-hidden
    >
      <path
        d="M1.6 8.4L6.4 13.4L16.4 2.2"
        fill="none"
        stroke={color}
        strokeWidth="2.8"
        strokeLinecap="butt"
        strokeLinejoin="miter"
      />
    </svg>
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

      <div
        className="PRICING-YEAR absolute"
        style={{
          left: `${GUTTER}px`,
          top: `${BANNER_TOP}px`,
          width: BANNER_W,
          height: BANNER_H,
        }}
      >
        <div className="PRICING-YEAR-COPY">
          <p className="PRICING-YEAR-H">
            {pricing.year.headlineBefore}
            <em>{pricing.year.headlineEm}</em>
          </p>
          <p className="PRICING-YEAR-D text-kr">{pricing.year.body}</p>
        </div>
        <div className="PRICING-YEAR-BADGES" aria-hidden>
          <span className="PRICING-YEAR-CIRCLE">
            12 <em>for</em> 10
          </span>
          <span className="PRICING-YEAR-CIRCLE is-saved">
            <span className="PRICING-YEAR-SAVED-N">
              {pricing.year.savedNum}
            </span>
            <span className="PRICING-YEAR-SAVED-L">
              {pricing.year.savedLabel}
            </span>
          </span>
        </div>
      </div>
    </Canvas>
  );
}
