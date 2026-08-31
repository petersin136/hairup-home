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
 * 07 / FAQ — hu_FAQ_DETAIL_PC
 *
 * 헤더: FAQ-CATEGORY 13/500 · FAQ-TITLE 40/600 · FAQ-DESC 17/400
 *   tag→title 42 · title→desc 36 · 상 0 (Pricing 하 200) · 하 200
 * 리스트: 폭 937 · desc→리스트 100 · 행 패딩 26 · cat→q 16 · q→icon 100
 * 답변: q→a 36 · 줄 27(lh 1.588) · 단락 54(빈 줄 1개) · 강조 600
 */
const PAD_TOP = 0;
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
                    <FaqAnswer groups={item.answer} />
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

/**
 * 시안은 빈 줄로 단락을 나눈 하나의 텍스트 블록이다.
 * 단일 <p> + <br />로 두어야 줄 27 / 단락 54가 line box 그대로 나오고,
 * text-box-trim 이 첫 줄 위·끝 줄 아래에만 적용된다.
 */
function FaqAnswer({ groups }: { groups: readonly FaqAnswerGroup[] }) {
  return (
    <p className="FAQ-ANSWER text-kr">
      {groups.map((group, gi) => (
        <Fragment key={gi}>
          {gi > 0 ? (
            <>
              <br />
              <br />
            </>
          ) : null}
          {group.map((line, li) => (
            <Fragment key={li}>
              {li > 0 ? <br /> : null}
              {line.bold ? <strong>{line.text}</strong> : line.text}
            </Fragment>
          ))}
        </Fragment>
      ))}
    </p>
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
        className="FAQ-ICON-MINUS"
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
