"use client";

import { GlyphLines } from "@/components/copy/GlyphLines";
import { pricing } from "@/content/site";
import { onHashClick } from "@/lib/scroll-to-hash";
import { libreBodoni } from "@/lib/fonts";

const PLANS = [
  { tone: "starter" as const, plan: pricing.starter },
  { tone: "branding" as const, plan: pricing.branding },
];

export function MobilePricing() {
  return (
    <section id="pricing" className="M-PRICE-SEC">
      <p className="SECTION-TAG text-forest">
        {pricing.tagMobile.before}
        <em>{pricing.tagMobile.article}</em>
        {pricing.tagMobile.after}
      </p>
      <h2 className="text-kr mt-[22px] text-[30px] font-bold leading-[1.3] text-ink">
        <GlyphLines lines={pricing.headline} />
      </h2>
      <p className="text-kr mt-[28px] text-[15px] leading-[1.65] text-body">
        <GlyphLines lines={pricing.body} />
      </p>

      <div className="M-PRICE-TRACK" aria-label="요금제 카드">
        {PLANS.map(({ tone, plan }) => (
          <div key={tone} className="M-PRICE-SLIDE">
            <MobilePlanCard tone={tone} plan={plan} />
          </div>
        ))}
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
      {"badge" in plan && plan.badge ? (
        <p className="M-PRICE-BADGE">{plan.badge}</p>
      ) : (
        <p className="M-PRICE-BADGE is-slot" aria-hidden="true">
          / RECOMMEND
        </p>
      )}
      <p className="M-PRICE-DESC text-kr">
        <GlyphLines lines={plan.tagline} />
      </p>
      <div className="M-PRICE-PRICES">
        {plan.prices.map((row) => (
          <div key={row.label}>
            <p className="M-PRICE-LABEL text-kr">{row.label}</p>
            <p className="M-PRICE-AMOUNT">
              <span
                className={`M-PRICE-NUM font-didot-num ${libreBodoni.className}`}
              >
                {row.num}
              </span>
              <span className="M-PRICE-UNIT text-kr">{row.unit}</span>
            </p>
          </div>
        ))}
      </div>
      <hr className="M-PRICE-RULE" />
      <ul className="M-PRICE-LIST">
        {plan.features.map((feature) => (
          <li key={feature.title}>
            <svg
              className="M-PRICE-CHECK"
              width="18"
              height="16"
              viewBox="0 0 18 16"
              aria-hidden
            >
              <path d="M1.6 8.4L6.4 13.4L16.4 2.2" />
            </svg>
            <div>
              <p className="M-PRICE-FEAT-T text-kr">{feature.title}</p>
              <p className="M-PRICE-FEAT-D text-kr">
                <GlyphLines
                  lines={
                    "descMobile" in feature ? feature.descMobile : feature.desc
                  }
                />
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
