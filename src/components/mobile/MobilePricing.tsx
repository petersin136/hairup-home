"use client";

import { GlyphLines } from "@/components/copy/GlyphLines";
import { pricing } from "@/content/site";
import { onHashClick } from "@/lib/scroll-to-hash";

const PLANS = [
  { tone: "starter" as const, plan: pricing.starter },
  { tone: "branding" as const, plan: pricing.branding },
];

export function MobilePricing() {
  return (
    <section id="pricing" className="M-PRICE-SEC">
      <p className="M-PRICE-TAG">
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
        <p className="M-PRICE-YEAR-H">
          A whole year,
          <br />
          <em>{pricing.year.headlineEm}</em>
        </p>
        <p className="M-PRICE-YEAR-D text-kr">{pricing.year.bodyMobile}</p>
        <p className="M-PRICE-YEAR-SAVED">
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
      <p className="M-PRICE-NAME">{plan.name}</p>
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
            <svg
              className="M-PRICE-CHECK"
              width="14"
              height="11"
              viewBox="0 0 14 11"
              aria-hidden
            >
              <path
                d="M1.2 5.6L5.1 9.4L12.8 1.4"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div>
              <p className="M-PRICE-FEAT-T text-kr">{feature.title}</p>
              <p className="M-PRICE-FEAT-D text-kr">
                {(
                  "descMobile" in feature ? feature.descMobile : feature.desc
                ).map((line, i) => (
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
      <a
        href={plan.cta.href}
        onClick={(e) => onHashClick(e, plan.cta.href)}
        {...(plan.cta.href.startsWith("http")
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
        className="M-PRICE-BTN"
      >
        {plan.cta.label}
      </a>
    </article>
  );
}
