"use client";

import { GlyphLines } from "@/components/copy/GlyphLines";
import { pricing } from "@/content/site";
import { openConsultationModal } from "@/lib/consultation-modal";
import { playfairDisplay } from "@/lib/fonts";

const PLANS = [
  { tone: "starter" as const, plan: pricing.starter },
  { tone: "branding" as const, plan: pricing.branding },
];

export function MobilePricing() {
  return (
    <section id="pricing" className="M-PRICE-SEC">
      <p className={`M-PRICE-TAG ${playfairDisplay.className}`}>
        {pricing.tagMobile.before}
        <em>{pricing.tagMobile.article}</em>
        {pricing.tagMobile.after}
      </p>
      <h2 className="M-PRICE-HEAD text-kr">
        <GlyphLines lines={pricing.headline} />
      </h2>
      <p className="M-PRICE-BODY text-kr">
        <GlyphLines lines={pricing.body} />
      </p>

      <div className="M-PRICE-TRACK" aria-label="요금제 카드">
        {PLANS.map(({ tone, plan }) => (
          <MobilePlanCard key={tone} tone={tone} plan={plan} />
        ))}
      </div>

      <div
        className="M-PRICE-YEAR"
        aria-label={`${pricing.year.headlineBefore}${pricing.year.headlineEm} ${pricing.year.bodyMobile}. ${pricing.year.savedNum} ${pricing.year.savedLabel}`}
      >
        <p className={`M-PRICE-YEAR-H ${playfairDisplay.className}`}>
          A whole year,
          <br />
          <em>{pricing.year.headlineEm}</em>
        </p>
        <p className="M-PRICE-YEAR-D text-kr">{pricing.year.bodyMobile}</p>
        <p className={`M-PRICE-YEAR-SAVED ${playfairDisplay.className}`}>
          {pricing.year.savedNum} {pricing.year.savedLabel}
        </p>
      </div>
    </section>
  );
}

function MobilePlanCard({
  tone,
  plan,
}: {
  tone: "starter" | "branding";
  plan: typeof pricing.starter | typeof pricing.branding;
}) {
  const brand = tone === "branding";
  return (
    <article className={brand ? "M-PRICE is-brand" : "M-PRICE"}>
      <p className={`M-PRICE-NAME ${playfairDisplay.className}`}>{plan.name}</p>
      <p className="M-PRICE-DESC text-kr">
        <GlyphLines lines={plan.tagline} />
      </p>
      <div className="M-PRICE-PRICES">
        {plan.prices.map((row) => (
          <p key={row.label} className="M-PRICE-AMOUNT">
            <span className="M-PRICE-NUM font-latin">{row.num}</span>
            <span className="M-PRICE-UNIT text-kr">
              {row.unitMobile} / {row.label}
            </span>
          </p>
        ))}
      </div>
      <hr className="M-PRICE-RULE" />
      <ul className="M-PRICE-LIST">
        {plan.features.map((feature) => (
          <li key={feature.title}>
            <span className="M-PRICE-CHECK" aria-hidden />
            <div>
              <p className="M-PRICE-FEAT-T text-kr">{feature.title}</p>
              <p className="M-PRICE-FEAT-D text-kr">
                {feature.descMobile.map((line, i) => (
                  <span key={`${feature.title}-${i}`}>
                    {i > 0 ? <br /> : null}
                    {line}
                  </span>
                ))}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="M-PRICE-BTN"
        onClick={() => openConsultationModal()}
      >
        {plan.cta.label}
      </button>
    </article>
  );
}
