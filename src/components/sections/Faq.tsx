"use client";

import { useState } from "react";

import { GlyphLines } from "@/components/copy/GlyphLines";
import { faq, type FaqAnswerBlock } from "@/content/site";

/**
 * 07 / FAQ — hu_FAQ_PC 아코디언
 *
 * 헤더: Pricing / Template 과 동일
 *   SECTION-TAG 13/500 · title 40/600 · desc 17/400
 *   tag→title 42 · title→desc 36 · 상 300
 * 리스트 시안 1440 환산: 폭 940 · 닫힘 101 · desc→리스트 101
 */
const PAD_TOP = 300;
const PAD_BOTTOM = 200;
const LIST_W = 940;
const GAP_DESC_LIST = 101;

export function Faq() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section id="faq" className="FAQ">
      <div
        className="FAQ-INNER"
        style={{ paddingTop: PAD_TOP, paddingBottom: PAD_BOTTOM }}
      >
        <div className="SECTION-COPY-STACK SECTION-COPY-STACK--center">
          <p className="SECTION-TAG text-forest">
            {faq.tag.before}
            <em>{faq.tag.article}</em>
            {faq.tag.after}
          </p>
          <h2 className="SECTION-COPY-TITLE text-kr">
            <GlyphLines lines={faq.headline} />
          </h2>
          <p className="SECTION-COPY-DESC text-kr">
            <GlyphLines lines={faq.body} />
          </p>
        </div>

        <div
          className="FAQ-LIST"
          style={{ width: LIST_W, marginTop: GAP_DESC_LIST }}
        >
          {faq.list.map((item) => {
            const isOpen = open === item.category;
            return (
              <div
                key={item.category}
                className={isOpen ? "FAQ-ITEM is-open" : "FAQ-ITEM"}
              >
                <button
                  type="button"
                  className="FAQ-HIT"
                  aria-expanded={isOpen}
                  aria-label={item.question}
                  onClick={() => setOpen(isOpen ? null : item.category)}
                />
                <span className="FAQ-CAT">({item.category})</span>
                <span className="FAQ-Q">{item.question}</span>
                <span className="FAQ-ICON" aria-hidden>
                  {isOpen ? <MinusIcon /> : <PlusIcon />}
                </span>
                {isOpen ? (
                  <div className="FAQ-A">
                    {item.answer.map((block, i) => (
                      <AnswerBlock
                        key={`${item.category}-${i}`}
                        block={block}
                      />
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function AnswerBlock({ block }: { block: FaqAnswerBlock }) {
  if (block.t === "h") {
    return <p className="FAQ-A-H text-kr">{block.text}</p>;
  }
  if (block.t === "li") {
    return <p className="FAQ-A-LI text-kr">{block.text}</p>;
  }
  if (block.t === "eq") {
    return <p className="FAQ-A-EQ text-kr">{block.text}</p>;
  }
  if (block.t === "pg") {
    return <p className="FAQ-A-PG text-kr">{block.text}</p>;
  }
  return <p className="FAQ-A-P text-kr">{block.text}</p>;
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16">
      <path
        d="M8 3v10M3 8h10"
        fill="none"
        stroke="#1C1A19"
        strokeWidth="1.2"
      />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16">
      <path d="M3 8h10" fill="none" stroke="#1C1A19" strokeWidth="1.2" />
    </svg>
  );
}
