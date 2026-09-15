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
 * 모바일 FAQ — hu_faq_01~03_m · 390
 * PC Faq.tsx 는 건드리지 않습니다.
 */
export function MobileFaq() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section id="faq" className="M-FAQ">
      <p className="__07__FAQ__">{faq.tagMobile}</p>
      <h2 className="시작은_간단하게.__운영은_편리하게_">
        <GlyphLines lines={faq.headline} />
      </h2>
      <p className="복잡한_준비는_필요하지_않습니다">
        <GlyphLines lines={faq.bodyMobile} />
      </p>

      <div className="M-FAQ-LIST">
        {faq.list.map((item) => {
          const isOpen = open === item.category;
          const question =
            "questionMobile" in item && item.questionMobile
              ? item.questionMobile
              : [item.question];
          return (
            <div key={item.category}>
              <div className="LINE" />
              <div className={isOpen ? "M-FAQ-ITEM is-open" : "M-FAQ-ITEM"}>
                <button
                  type="button"
                  className="M-FAQ-HIT"
                  aria-expanded={isOpen}
                  aria-label={item.question}
                  onClick={() => setOpen(isOpen ? null : item.category)}
                >
                  <span className="QUESTION">
                    <GlyphLines lines={question} />
                  </span>
                  {isOpen ? <IcoMinus /> : <IcoPlus />}
                </button>
                <MobileFaqPanel open={isOpen}>
                  <MobileFaqAnswer groups={item.answer} />
                </MobileFaqPanel>
              </div>
            </div>
          );
        })}
        <div className="LINE" />
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
    <div className="M-FAQ-ANSWER">
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
      /* scrollHeight — trim 글리프가 rect 밖으로 넘쳐도 클립되지 않게 */
      setHeight(Math.ceil(inner.scrollHeight));
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

/** hu_faq_02_m · .ICO-PLUS */
function IcoPlus() {
  return (
    <svg
      className="ICO-PLUS"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      aria-hidden
    >
      <path d="M1 8H15" />
      <path d="M8 1V15" />
    </svg>
  );
}

function IcoMinus() {
  return (
    <svg
      className="ICO-PLUS"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      aria-hidden
    >
      <path d="M1 8H15" />
    </svg>
  );
}
