"use client";

import {
  Fragment,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { GlyphLines } from "@/components/copy/GlyphLines";
import { faq, type FaqAnswerGroup } from "@/content/site";

/**
 * 모바일 FAQ — PC hu_FAQ_DETAIL_PC 아코디언을 390 폭에 축소.
 * 카드 flip 없음. PC Faq.tsx 는 건드리지 않습니다.
 */
export function MobileFaq() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section id="faq" className="M-FAQ">
      <p className="M-FAQ-TAG">
        {faq.tagMobile.before}
        <em>{faq.tagMobile.article}</em>
        {faq.tagMobile.after}
      </p>
      <h2 className="M-FAQ-TITLE text-kr">
        <GlyphLines lines={faq.headline} />
      </h2>
      <p className="M-FAQ-DESC text-kr">
        <GlyphLines lines={faq.bodyMobile} />
      </p>

      <div className="M-FAQ-LIST">
        {faq.list.map((item) => {
          const isOpen = open === item.category;
          return (
            <div key={item.category}>
              <div className="M-FAQ-LINE" />
              <div className={isOpen ? "M-FAQ-ITEM is-open" : "M-FAQ-ITEM"}>
                <button
                  type="button"
                  className="M-FAQ-HIT"
                  aria-expanded={isOpen}
                  aria-label={item.question}
                  onClick={() => setOpen(isOpen ? null : item.category)}
                >
                  <span className="M-FAQ-CATEGORY">({item.category})</span>
                  <span className="M-FAQ-QUESTION text-kr">{item.question}</span>
                  <span className="M-FAQ-ICON-SLOT">
                    <MobileFaqIcon />
                  </span>
                </button>
                <MobileFaqPanel open={isOpen}>
                  <MobileFaqAnswer groups={item.answer} />
                </MobileFaqPanel>
              </div>
            </div>
          );
        })}
        <div className="M-FAQ-LINE" />
      </div>
    </section>
  );
}

function answerLineKind(text: string): "bullet" | "sub" | "plain" {
  if (text.startsWith("•")) return "bullet";
  if (text.startsWith("-") || text.startsWith("=")) return "sub";
  return "plain";
}

function MobileFaqAnswer({ groups }: { groups: readonly FaqAnswerGroup[] }) {
  return (
    <div className="M-FAQ-ANSWER text-kr">
      {groups.map((group, gi) => (
        <div key={gi} className="M-FAQ-GROUP">
          {group.map((line, li) => {
            const kind = answerLineKind(line.text);
            const content = line.bold ? (
              <strong>{line.text}</strong>
            ) : (
              line.text
            );
            if (kind === "plain") {
              return (
                <Fragment key={li}>
                  {li > 0 ? <br /> : null}
                  {content}
                </Fragment>
              );
            }
            return (
              <span
                key={li}
                className={kind === "bullet" ? "M-FAQ-LI" : "M-FAQ-SUB"}
              >
                {content}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function MobileFaqPanel({
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
      className={open && settled ? "M-FAQ-PANEL is-open" : "M-FAQ-PANEL"}
      style={open && settled ? undefined : { height }}
    >
      <div className="M-FAQ-PANEL-INNER" ref={innerRef}>
        {children}
      </div>
    </div>
  );
}

function MobileFaqIcon() {
  return (
    <svg
      className="M-FAQ-ICON"
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
        className="M-FAQ-ICON-V"
        d="M10 1V19"
        fill="none"
        stroke="#000000"
        strokeWidth="2"
        strokeLinecap="square"
      />
    </svg>
  );
}
