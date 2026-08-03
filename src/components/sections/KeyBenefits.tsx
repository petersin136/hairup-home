"use client";

import { useRef } from "react";

import { Canvas } from "@/components/layout/Canvas";
import { keyBenefits } from "@/content/site";

/**
 * 05_Key Benefits — 아트보드 1440 × 1723, 배경 #f6ecdf
 *
 * 헤더는 전부 x=720 중앙 정렬이고, 타입 스케일은 03_Test 와 완전히 같습니다.
 * 카드 줄은 좌거터 120 에서 시작해 오른쪽 화면 밖으로 흘러넘칩니다.
 * 시안에서 세 번째 카드가 254px 만 보이는 상태가 스크롤 0 위치입니다.
 *
 * 시안에서 잰 잉크 좌표
 *   아이브로우  y 299
 *   H2          1행 y 364 (행간 96)
 *   본문        1행 y 585 (행간 36)
 *   카드        y 827, 500 × 360, x 120 / 653 / 1186
 *   카드 제목   1행 y 1232 (행간 46), 카드 좌변에서 8px 안쪽
 *   카드 본문   1행 y 1344 (행간 31)
 */
const EYEBROW_TOP = 295;
const HEADLINE_TOP = 345;
const BODY_TOP = 575;

const TRACK = { left: 120, top: 827, width: 1320 };
const CARD = { width: 500, height: 360, gap: 33 };
/** 카드 아래 텍스트는 카드 좌변보다 살짝 안쪽에서 시작합니다. */
const CARD_TEXT_INSET = 7;
const CARD_TITLE_TOP = 1222 - TRACK.top;
const CARD_BODY_TOP = 1337 - TRACK.top;
/** 트랙 높이는 카드 위끝부터 본문 마지막 줄 아래끝까지입니다. */
const TRACK_HEIGHT = 1424 - TRACK.top;

/** 작은 "03 /" 는 큰 글자보다 베이스라인이 7px 위에 있습니다. (03_Test 와 동일) */
const INDEX_RISE = 7;

export function KeyBenefits() {
  const track = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; left: number } | null>(null);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = track.current;
    if (!el) return;
    drag.current = { x: e.clientX, left: el.scrollLeft };
    el.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = track.current;
    if (!el || !drag.current) return;
    el.scrollLeft = drag.current.left - (e.clientX - drag.current.x);
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    drag.current = null;
    track.current?.releasePointerCapture(e.pointerId);
  };

  return (
    <Canvas id="key-benefits" height={1723} background="bg-cream">
      <p
        className="absolute inset-x-0 whitespace-pre text-center font-display text-[27px] font-semibold leading-none tracking-[-1.2px] text-forest"
        style={{ top: `${EYEBROW_TOP}px` }}
      >
        <span
          className="relative font-latin text-[16px] font-semibold tracking-[0.65px]"
          style={{ top: `-${INDEX_RISE}px` }}
        >
          {keyBenefits.eyebrow.index}{" "}
        </span>
        {keyBenefits.eyebrow.label}
      </p>

      <h2
        className="text-kr absolute inset-x-0 text-center text-[70px] font-bold leading-[96px] tracking-[-0.01em] text-ink"
        style={{ top: `${HEADLINE_TOP}px` }}
      >
        {keyBenefits.headline.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h2>

      <p
        className="text-kr absolute inset-x-0 text-center text-[22px] font-normal leading-[36px] tracking-[-0.01em] text-body"
        /* 글자 폭이 시안과 미세하게 달라 중앙 정렬 결과가 0.5px 왼쪽으로 떨어집니다. */
        style={{ top: `${BODY_TOP}px`, transform: "translateX(1px)" }}
      >
        {keyBenefits.body.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </p>

      <div
        ref={track}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className="absolute flex cursor-grab overflow-x-auto overscroll-x-contain [scrollbar-width:none] active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
        style={{
          left: `${TRACK.left}px`,
          top: `${TRACK.top}px`,
          width: `${TRACK.width}px`,
          height: `${TRACK_HEIGHT}px`,
          gap: `${CARD.gap}px`,
        }}
      >
        {keyBenefits.cards.map((card) => (
          <article
            key={card.title[0]}
            className="relative shrink-0 select-none"
            style={{ width: `${CARD.width}px` }}
          >
            <div
              className="rounded-ui bg-black"
              style={{ height: `${CARD.height}px` }}
            />
            <h3
              className="text-kr absolute text-[32px] font-bold leading-[46px] tracking-[-0.4px] text-forest"
              style={{ left: `${CARD_TEXT_INSET}px`, top: `${CARD_TITLE_TOP}px` }}
            >
              {card.title.map((line) => (
                <span key={line} className="block whitespace-pre">
                  {line}
                </span>
              ))}
            </h3>
            <p
              className="text-kr absolute text-[19px] font-normal leading-[31px] tracking-[-0.01em] text-body"
              style={{ left: `${CARD_TEXT_INSET}px`, top: `${CARD_BODY_TOP}px` }}
            >
              {card.body.map((line) => (
                <span key={line} className="block whitespace-pre">
                  {line}
                </span>
              ))}
            </p>
          </article>
        ))}
      </div>
    </Canvas>
  );
}
