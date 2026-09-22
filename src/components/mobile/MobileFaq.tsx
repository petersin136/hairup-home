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
 * 모바일 FAQ — hu_faq_01~04_m · 08~11_m · 390
 * PC Faq.tsx 는 건드리지 않습니다.
 */
export function MobileFaq() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section id="faq" className="M-FAQ">
      <p className="M-FAQ-TAG">{faq.tagMobile}</p>
      <h2 className="M-FAQ-HEAD">
        <GlyphLines lines={faq.headline} />
      </h2>
      <p className="M-FAQ-BODY">
        <GlyphLines lines={faq.bodyMobile} />
      </p>

      <div className="M-FAQ-LIST">
        {faq.list.map((item) => {
          const isOpen = open === item.category;
          const question =
            "questionMobile" in item && item.questionMobile
              ? item.questionMobile
              : [item.question];
          const answer =
            "answerMobile" in item && item.answerMobile
              ? item.answerMobile
              : item.answer;
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
                  <span className="M-FAQ-QUESTION">
                    <GlyphLines lines={question} />
                  </span>
                  {isOpen ? <IcoMinus /> : <IcoPlus />}
                </button>
                <MobileFaqPanel open={isOpen}>
                  <MobileFaqAnswer groups={answer} />
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

function answerLineKind(text: string): "bullet" | "sub" | "note" | "plain" {
  if (text.startsWith("•")) return "bullet";
  if (text.startsWith("-") || text.startsWith("=")) return "sub";
  if (text.startsWith("(")) return "note";
  return "plain";
}

function FaqLineText({
  text,
  bold,
}: {
  text: string;
  bold?: boolean;
}) {
  const nodes = text.split("\n").map((part, i) => (
    <Fragment key={i}>
      {i > 0 ? <br /> : null}
      {part}
    </Fragment>
  ));
  return bold ? <strong>{nodes}</strong> : nodes;
}

function MobileFaqAnswer({ groups }: { groups: readonly FaqAnswerGroup[] }) {
  return (
    <div className="M-FAQ-ANSWER">
      {groups.map((group, gi) => {
        const nodes: ReactNode[] = [];
        let i = 0;
        let afterBlock = false;
        while (i < group.length) {
          const kind = answerLineKind(group[i].text);
          if (kind === "plain") {
            const run = [];
            while (i < group.length && answerLineKind(group[i].text) === "plain") {
              run.push(group[i]);
              i += 1;
            }
            const body = run.map((line, li) => (
              <Fragment key={li}>
                {li > 0 ? <br /> : null}
                <FaqLineText text={line.text} bold={line.bold} />
              </Fragment>
            ));
            nodes.push(
              afterBlock ? (
                <span key={`p-${i}`} className="M-FAQ-P">
                  {body}
                </span>
              ) : (
                <Fragment key={`intro-${i}`}>{body}</Fragment>
              ),
            );
            continue;
          }
          afterBlock = true;
          const className =
            kind === "bullet"
              ? "M-FAQ-LI"
              : kind === "note"
                ? "M-FAQ-NOTE"
                : "M-FAQ-SUB";
          nodes.push(
            <span key={i} className={className}>
              <FaqLineText text={group[i].text} bold={group[i].bold} />
            </span>,
          );
          i += 1;
        }
        return (
          <div key={gi} className="M-FAQ-GROUP">
            {nodes}
          </div>
        );
      })}
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

/**
 * hu_faq_02_m · 16×16 · stroke 1px #1C1A19
 * 막대 풀폭 + round cap (PNG tip 비율)
 */
function IcoPlus() {
  return (
    <svg
      className="M-FAQ-ICO"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      aria-hidden
    >
      <path d="M0.5 8H15.5" />
      <path d="M8 0.5V15.5" />
    </svg>
  );
}

/** hu_faq_04_m · 컨테이너 16×16, 막대 17×1 중앙 */
function IcoMinus() {
  return (
    <svg
      className="M-FAQ-ICO"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      aria-hidden
    >
      <rect
        className="M-FAQ-ICO-MINUS-BAR"
        x="-0.5"
        y="7.5"
        width="17"
        height="1"
      />
    </svg>
  );
}
