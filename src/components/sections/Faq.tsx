"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

import { GlyphLines } from "@/components/copy/GlyphLines";
import { faq, type FaqAnswerBlock } from "@/content/site";

/**
 * 07 / FAQ — hu_FAQ_DETAIL_PC
 *
 * 헤더: FAQ-CATEGORY 13/500 · FAQ-TITLE 40/600 · FAQ-DESC 17/400
 *   tag→title 42 · title→desc 36 · 상·하 200
 * 리스트: 폭 937 · desc→리스트 100 · 행 패딩 26 · cat→q 16 · q→icon 100
 * 답변: q→a 36 · 단락 30 · 세부 줄 20
 */
const PAD_TOP = 200;
const PAD_BOTTOM = 200;
const LIST_W = 937;
const GAP_DESC_LIST = 100;

export function Faq() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section id="faq" className="FAQ">
      <div
        className="FAQ-INNER"
        style={{ paddingTop: PAD_TOP, paddingBottom: PAD_BOTTOM }}
      >
        <p className="FAQ-CATEGORY">( 07. FAQ )</p>
        <h2 className="FAQ-TITLE text-kr">
          <GlyphLines lines={faq.headline} />
        </h2>
        <p className="FAQ-DESC text-kr">
          <GlyphLines lines={faq.body} />
        </p>

        <div
          className="FAQ-LIST"
          style={{ width: LIST_W, marginTop: GAP_DESC_LIST }}
        >
          {faq.list.map((item) => {
            const isOpen = open === item.category;
            return (
              <div key={item.category}>
                <div className="FAQ-LINE" />
                <div
                  className={
                    isOpen ? "FAQ-ITEM FAQ-ITEM-ACTIVE" : "FAQ-ITEM"
                  }
                >
                  <button
                    type="button"
                    className="FAQ-HIT"
                    aria-expanded={isOpen}
                    aria-label={item.question}
                    onClick={() => setOpen(isOpen ? null : item.category)}
                  />
                  <span
                    className={
                      isOpen ? "FAQ-CATEGORY-ACTIVE" : "FAQ-CATEGORY"
                    }
                  >
                    ({item.category})
                  </span>
                  <span
                    className={
                      isOpen ? "FAQ-QUESTION-ACTIVE" : "FAQ-QUESTION"
                    }
                  >
                    {item.question}
                  </span>
                  <FaqIcon />
                  <FaqPanel open={isOpen}>
                    <div className="FAQ-A">
                      {item.answer.map((block, i) => (
                        <AnswerBlock
                          key={`${item.category}-${i}`}
                          block={block}
                        />
                      ))}
                    </div>
                  </FaqPanel>
                  <div className="FAQ-SPACER" />
                </div>
              </div>
            );
          })}
          <div className="FAQ-LINE" />
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

function FaqPanel({
  open,
  children,
}: {
  open: boolean;
  children: ReactNode;
}) {
  const innerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const [settled, setSettled] = useState(false);

  useLayoutEffect(() => {
    const inner = innerRef.current;
    const panel = panelRef.current;
    if (!inner || !panel) return;

    if (!open) {
      setSettled(false);
      setHeight(0);
      return;
    }

    const measure = () => {
      setHeight(Math.ceil(inner.getBoundingClientRect().height));
    };

    measure();
    setSettled(false);

    const settle = () => setSettled(true);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      settle();
    }

    const onEnd = (event: TransitionEvent) => {
      if (event.propertyName !== "height") return;
      settle();
    };
    if (!reduced) {
      panel.addEventListener("transitionend", onEnd);
    }
    const fallback = reduced ? 0 : window.setTimeout(settle, 520);
    const ro = new ResizeObserver(measure);
    ro.observe(inner);
    return () => {
      if (!reduced) {
        panel.removeEventListener("transitionend", onEnd);
        window.clearTimeout(fallback);
      }
      ro.disconnect();
    };
  }, [open]);

  return (
    <div
      ref={panelRef}
      className={open && settled ? "FAQ-PANEL is-open" : "FAQ-PANEL"}
      style={open && settled ? undefined : { height }}
    >
      <div className="FAQ-PANEL-INNER" ref={innerRef}>
        {children}
      </div>
    </div>
  );
}

function FaqIcon() {
  return (
    <svg
      className="FAQ-ICON"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      aria-hidden
    >
      <path
        d="M1 10H19"
        fill="none"
        stroke="#000000"
        strokeWidth="2"
        strokeLinecap="square"
      />
      <path
        className="FAQ-ICON-V"
        d="M10 1V19"
        fill="none"
        stroke="#000000"
        strokeWidth="2"
        strokeLinecap="square"
      />
    </svg>
  );
}
