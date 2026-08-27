"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

import { GlyphLines } from "@/components/copy/GlyphLines";
import { faq } from "@/content/site";

/**
 * 07 / FAQ — hu_FAQ_DETAIL_PC
 *
 * 헤더: FAQ-CATEGORY 13/500 · FAQ-TITLE 40/600 · FAQ-DESC 17/400
 *   tag→title 42 · title→desc 36 · 상·하 200
 * 리스트: 폭 937 · desc→리스트 100 · 행 패딩 26 · cat→q 16 · q→icon 100
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
                    <p className="FAQ-ANSWER text-kr">
                      <GlyphLines
                        lines={item.answer.map((block) => block.text)}
                      />
                    </p>
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

function FaqPanel({
  open,
  children,
}: {
  open: boolean;
  children: ReactNode;
}) {
  const innerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | "auto">(0);

  useLayoutEffect(() => {
    const inner = innerRef.current;
    const panel = panelRef.current;
    if (!inner || !panel) return;

    if (open) {
      setHeight(inner.scrollHeight);
      const onEnd = (event: TransitionEvent) => {
        if (event.propertyName !== "height") return;
        setHeight("auto");
      };
      panel.addEventListener("transitionend", onEnd);
      return () => panel.removeEventListener("transitionend", onEnd);
    }

    const current = panel.getBoundingClientRect().height;
    setHeight(current);
    const frame = requestAnimationFrame(() => setHeight(0));
    return () => cancelAnimationFrame(frame);
  }, [open]);

  return (
    <div
      ref={panelRef}
      className={height === "auto" ? "FAQ-PANEL is-open" : "FAQ-PANEL"}
      style={height === "auto" ? undefined : { height }}
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
      <path d="M1 10H19" fill="none" stroke="#000000" strokeWidth="1" />
      <path
        className="FAQ-ICON-V"
        d="M10 1V19"
        fill="none"
        stroke="#000000"
        strokeWidth="1"
      />
    </svg>
  );
}
