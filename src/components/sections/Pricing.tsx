"use client";

import { GlyphLines } from "@/components/copy/GlyphLines";
import { Canvas } from "@/components/layout/Canvas";
import { pricing } from "@/content/site";
import { onHashClick } from "@/lib/scroll-to-hash";

/**
 * 06_Pricing Plan — hu_PRICING_DETAIL_PC_01–10
 *
 * 헤더: PRICING-TAG 13/500 · TITLE 40/600 · DESC 17/400 lh 1.588
 *   tag→title 42 · title→desc 36 · 상 0 (마퀴 하단 200 이 구간 간격)
 * 시안 1440: 카드 584×923 · gap 32 · 거터 120 · desc→카드 100
 * 연간 배너 1200×202 · 카드→배너 32 · 하 200
 */
const GUTTER = 120;
const CARD_W = 584;
const CARD_H = 923;
const CARD_GAP = 32;

const TAG_TOP = 0;
const TAG_H = 9.2;
const GAP_TAG_TITLE = 42;
const TITLE_H = 89.3;
const GAP_TITLE_DESC = 36;
const DESC_H = 39.4;
const GAP_DESC_CARDS = 100;
const COPY_STACK_H = TAG_H + GAP_TAG_TITLE + TITLE_H + GAP_TITLE_DESC + DESC_H;
const CARD_TOP = TAG_TOP + COPY_STACK_H + GAP_DESC_CARDS;

const BANNER_W = 1200;
const BANNER_H = 202;
const GAP_CARDS_BANNER = 32;
const BANNER_TOP = CARD_TOP + CARD_H + GAP_CARDS_BANNER;
const PAD_BOTTOM = 200;
const HEIGHT = Math.ceil(BANNER_TOP + BANNER_H + PAD_BOTTOM);

function PlanCard({
  brand,
  plan,
}: {
  brand?: boolean;
  plan: typeof pricing.starter | typeof pricing.branding;
}) {
  const ctaExternal = plan.cta.href.startsWith("http");

  return (
    <article className="PRICING-CARD-STARTER">
      <h3 className="STARTER-TITLE">{plan.name}</h3>

      <p className="STARTER-DESC">
        <GlyphLines lines={plan.tagline} />
      </p>

      {plan.prices.map((row, i) => (
        <p key={row.label}>
          <span
            className={
              i === 0 ? "STARTER-PRICE-NUM-SETTING" : "STARTER-PRICE-NUM-MONTH"
            }
          >
            {row.num}
          </span>
          <span
            className={
              i === 0
                ? "STARTER-PRICE-TEXT-SETTING"
                : "STARTER-PRICE-TEXT-MONTH"
            }
          >
            {row.unit} / {row.label}
          </span>
        </p>
      ))}

      <hr className="STARTER-DIVIDER" />

      <ul>
        {plan.features.map((feature) => (
          <li key={feature.title}>
            <CheckIcon />
            <div>
              <p className="PRICING-FEATURE-TITLE">{feature.title}</p>
              <p className="PRICING-FEATURE-DESC">
                <GlyphLines lines={feature.desc} />
              </p>
            </div>
          </li>
        ))}
      </ul>

      <a
        href={plan.cta.href}
        onClick={(e) => onHashClick(e, plan.cta.href)}
        {...(ctaExternal
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
        className={brand ? "BTN-BRAND" : "BTN-STARTER"}
      >
        <span>{plan.cta.labelEn}</span>
        <span>{plan.cta.label}</span>
      </a>
    </article>
  );
}

function CheckIcon() {
  return (
    <svg
      className="PRICING-ICON-CHECK"
      width="18"
      height="16"
      viewBox="0 0 18 16"
      aria-hidden
    >
      <path d="M1.6 8.4L6.4 13.4L16.4 2.2" />
    </svg>
  );
}

export function Pricing() {
  return (
    <Canvas id="pricing" height={HEIGHT} background="bg-porcelain">
      <div
        className="absolute inset-x-0"
        style={{ top: `${TAG_TOP}px` }}
      >
        <p className="PRICING-TAG">
          {pricing.tag.before}
          <em>{pricing.tag.article}</em>
          {pricing.tag.after}
        </p>
        <h2 className="PRICING-TITLE">
          <GlyphLines lines={pricing.headline} />
        </h2>
        <p className="PRICING-DESC">
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
        <PlanCard plan={pricing.starter} />
        <PlanCard brand plan={pricing.branding} />
      </div>

      <div
        className="PRICING-YEAR absolute"
        role="img"
        aria-label={`${pricing.year.headlineBefore}${pricing.year.headlineEm} ${pricing.year.body}. 12 for 10, ${pricing.year.savedNum} ${pricing.year.savedLabel}`}
        style={{
          left: `${GUTTER}px`,
          top: `${BANNER_TOP}px`,
          width: BANNER_W,
          height: BANNER_H,
        }}
      />
    </Canvas>
  );
}
