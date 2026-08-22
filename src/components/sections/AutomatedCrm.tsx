"use client";

import { useState, type CSSProperties } from "react";

import { automatedCrm } from "@/content/site";

/**
 * 03. AUTOMATED CRM — hu_CRM PC 01–04 · hu_CRM SPACING PC
 *
 * 헤더 컬럼 940 (= 메인 슬라이드 폭). 좌측 250에 태그·타이틀 정렬.
 * 캐러셀 중앙 940×600.
 * 왼쪽 대기 카드는 메인과 상단 정렬, 오른쪽 대기 카드는 하단 정렬
 * (564×360 · opacity 0.4). 그 빈 자리에 화살표가 앉습니다.
 * 화살표는 ico-arrow-right 하나 · PREV 만 180deg.
 */
const N = automatedCrm.systems.length;
const STAGE_W = 1440;
const MAIN_W = 940;
const MAIN_H = 600;
const SUB_W = 564;
const SUB_H = 360;
const GAP = 24;
const BTN = 52;
const MAIN_LEFT = (STAGE_W - MAIN_W) / 2; /* 250 */
const PREV_LEFT = MAIN_LEFT - GAP - BTN; /* 174 */
const NEXT_LEFT = MAIN_LEFT + MAIN_W + GAP; /* 1214 */
const PEEK_LEFT = MAIN_LEFT - GAP - SUB_W; /* -338 */
const PEEK_RIGHT = NEXT_LEFT;
const HIDDEN_LEFT = PEEK_LEFT - GAP - SUB_W;
const HIDDEN_RIGHT = PEEK_RIGHT + SUB_W + GAP;

const ArrowIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    aria-hidden
    focusable="false"
  >
    <path
      fill="currentColor"
      d="m18.541,10.894l-4.717-4.717-.707.707,4.616,4.617H5v1h12.735l-4.618,4.617.707.707,4.717-4.716c.296-.296.459-.69.459-1.108s-.163-.812-.459-1.106Z"
    />
  </svg>
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
        <p className="CRM-TAG">{automatedCrm.tag}</p>

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
