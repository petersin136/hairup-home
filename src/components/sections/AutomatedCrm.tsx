"use client";

import { useState, type CSSProperties } from "react";

import { automatedCrm } from "@/content/site";

/**
 * 03. AUTOMATED CRM — hu_CRM PC 01–04 · hu_CRM SPACING PC
 *
 * 헤더는 1440 스테이지 · 940 컬럼 유지.
 * 캐러셀만 뷰포트 풀와이드 — 대기 카드(564×360)가 잘리지 않음.
 * 슬라이드는 뷰포트 중앙 기준 calc(50% ± …).
 * 왼쪽 대기 = 메인과 상단 정렬, 오른쪽 대기 = 하단 정렬 · opacity 0.4.
 * 화살표는 첨부 원본(가로축 + 꺾쇠) · PREV 만 180deg.
 */
const N = automatedCrm.systems.length;
const MAIN_W = 940;
const MAIN_H = 600;
const SUB_W = 564;
const SUB_H = 360;
const GAP = 24;
const BTN = 52;
/** 메인 왼쪽 가장자리까지 (뷰포트 중앙 → 왼쪽) */
const MAIN_HALF = MAIN_W / 2; /* 470 */
const PREV_LEFT = `calc(50% - ${MAIN_HALF + GAP + BTN}px)`;
const NEXT_LEFT = `calc(50% + ${MAIN_HALF + GAP}px)`;
const MAIN_LEFT = `calc(50% - ${MAIN_HALF}px)`;
const PEEK_LEFT = `calc(50% - ${MAIN_HALF + GAP + SUB_W}px)`;
const PEEK_RIGHT = `calc(50% + ${MAIN_HALF + GAP}px)`;
const HIDDEN_LEFT = `calc(50% - ${MAIN_HALF + GAP * 2 + SUB_W * 2}px)`;
const HIDDEN_RIGHT = `calc(50% + ${MAIN_HALF + GAP * 2 + SUB_W}px)`;

const ArrowIcon = () => (
  <span className="CRM-SLIDER-ARROW" aria-hidden />
);

export function AutomatedCrm() {
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);

  const go = (delta: -1 | 1) => {
    setDir(delta);
    setActive((i) => (i + delta + N) % N);
  };

  const slotStyle = (i: number): CSSProperties => {
    const rel = (i - active + N) % N;
    const subTop = MAIN_H - SUB_H; /* 240 — 오른쪽 카드는 메인과 하단 맞춤 */
    if (rel === 0) {
      return {
        left: MAIN_LEFT,
        top: 0,
        width: MAIN_W,
        height: MAIN_H,
        opacity: 1,
        zIndex: 2,
      };
    }
    if (rel === 1) {
      return {
        left: PEEK_RIGHT,
        top: subTop,
        width: SUB_W,
        height: SUB_H,
        opacity: 0.4,
        zIndex: 1,
      };
    }
    if (rel === N - 1) {
      return {
        left: PEEK_LEFT,
        top: 0,
        width: SUB_W,
        height: SUB_H,
        opacity: 0.4,
        zIndex: 1,
      };
    }
    return {
      left: dir === 1 ? HIDDEN_LEFT : HIDDEN_RIGHT,
      top: dir === 1 ? 0 : subTop,
      width: SUB_W,
      height: SUB_H,
      opacity: 0,
      zIndex: 0,
    };
  };

  return (
    <section id="automated-crm" className="CRM" aria-label="AUTOMATED CRM">
      <div className="CRM-STAGE">
        <p className="SECTION-TAG CRM-TAG">{automatedCrm.tag}</p>

        <div className="CRM-HEAD">
          <h2 className="CRM-TITLE">
            {automatedCrm.headline[0]}
            <br />
            {automatedCrm.headline[1]}
          </h2>
          <p className="CRM-DESC">
            {automatedCrm.body[0]}
            <br />
            {automatedCrm.body[1]}
          </p>
        </div>

        <div className="CRM-CAROUSEL" aria-roledescription="carousel">
          {automatedCrm.systems.map((system, i) => {
            const isMain = i === active;
            return (
              <article
                key={system.index}
                className={`CRM-SLIDE${isMain ? " is-main" : " is-inactive"}`}
                style={slotStyle(i)}
                aria-hidden={!isMain}
                aria-label={`${system.index}. ${system.title.join(" ")}`}
              >
                <div className="CRM-SLIDE-FACE" aria-hidden />
                <div className="CRM-SLIDE-INFO">
                  <h3 className="CARD-INFO-TITLE">
                    {system.title[0]}
                    <br />
                    {system.title[1]}
                  </h3>
                  <p className="CARD-INFO-DESC">
                    {system.body[0]}
                    <br />
                    {system.body[1]}
                  </p>
                </div>
              </article>
            );
          })}

          <button
            type="button"
            className="CRM-SLIDER-BTN PREV"
            style={{ left: PREV_LEFT, bottom: 20 }}
            aria-label="이전 슬라이드"
            onClick={() => go(-1)}
          >
            <ArrowIcon />
          </button>
          <button
            type="button"
            className="CRM-SLIDER-BTN NEXT"
            style={{ left: NEXT_LEFT, top: 20 }}
            aria-label="다음 슬라이드"
            onClick={() => go(1)}
          >
            <ArrowIcon />
          </button>
        </div>
      </div>
    </section>
  );
}
