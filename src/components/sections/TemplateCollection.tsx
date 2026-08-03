"use client";

import Image from "next/image";
import { useRef, useState } from "react";

import { Canvas } from "@/components/layout/Canvas";
import { templateCollection } from "@/content/site";

/**
 * 07_Template Collection — 아트보드 1440 × 1749, 배경 #f6ecdf
 *
 * 헤더 타입 스케일은 05_Key Benefits 와 완전히 같고, 헤드라인이 3줄이라
 * 본문만 한 줄(96) 아래로 내려옵니다.
 *
 * 카드 줄은 가운데 한 장만 크고 좌우 이웃이 화면 밖으로 잘려 나갑니다.
 * 가운데 카드에 호버하면 대문 이미지가 살짝 확대되면서 어두워지고
 * 템플릿 이름과 VIEW DEMO 버튼이 떠오릅니다.
 *
 * 시안이 843px 로 축소 저장돼 있어(배율 0.585) 아래 좌표는 축소 경계의
 * 면적을 적분해 역산한 값입니다. ±1px 오차가 남아 있습니다.
 *
 * 시안에서 잰 잉크 좌표
 *   아이브로우  y 299
 *   H2          1행 y 362 (행간 96)
 *   본문        1행 y 680 (행간 36)
 *   가운데 카드 800 × 500, x 320, y 924
 *   좌우 카드   800 × 426, 세로 중심은 가운데와 같은 y 1174
 *   카드 간격   31 (좌우 카드가 289 씩 보임)
 *   템플릿 이름 y 1109, 카드 중앙 정렬
 *   버튼        230 × 56, y 1181, 카드 중앙 정렬
 *   하단 마퀴   y 1623, 문구 사이 66
 */
const HEIGHT = 1749;
const EYEBROW_TOP = 295;
const HEADLINE_TOP = 345;
const BODY_TOP = 671;

/** 작은 "04 /" 는 큰 글자보다 베이스라인이 7px 위에 있습니다. (03·05 와 동일) */
const INDEX_RISE = 7;

const CARD = { width: 800, active: 500, inactive: 426, gap: 31 };
const PITCH = CARD.width + CARD.gap;
const ROW_CENTER = 1174;

const NAME_TOP = 185;
const BUTTON = { top: 257, width: 230, height: 56 };

const MARQUEE = { top: 1607, height: 56, gap: 66 };
/** 시안은 첫 문구의 P 가 화면 왼쪽으로 잘린 지점에서 멈춰 있습니다. */
const MARQUEE_START = 22;

const TEMPLATES = templateCollection.templates;
/**
 * 좌우 이웃이 항상 있어야 해서 목록을 세 벌 이어 붙이고 가운데 벌 안에서만
 * 움직입니다. 스트립이 세 벌 주기로 똑같이 생겼으므로, 가운데 벌을 벗어나면
 * 전환 없이 한 벌만큼 되돌려도 화면은 그대로입니다.
 */
const COPIES = 3;
const STRIP = Array.from(
  { length: TEMPLATES.length * COPIES },
  (_, i) => TEMPLATES[i % TEMPLATES.length],
);
const FIRST = TEMPLATES.length;
const LAST = TEMPLATES.length * 2 - 1;

/** 스트립에서 i 번째 카드를 화면 가운데(x 720)에 놓기 위한 이동 거리 */
const originFor = (i: number) => 720 - i * PITCH - CARD.width / 2;

export function TemplateCollection() {
  const [index, setIndex] = useState<number>(FIRST);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [snapping, setSnapping] = useState(false);
  const startX = useRef(0);
  /** 드래그로 끝난 동작이 옆 카드 클릭까지 발동시키지 않도록 남겨 둡니다. */
  const moved = useRef(false);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    startX.current = e.clientX;
    moved.current = false;
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    const dx = e.clientX - startX.current;
    if (Math.abs(dx) > 3) moved.current = true;
    setDragX(dx);
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    setDragging(false);
    const next = Math.round(index - dragX / PITCH);
    setIndex(Math.min(STRIP.length - 2, Math.max(1, next)));
    setDragX(0);
  };

  /** 밀림이 끝나면 가운데 벌로 조용히 되돌려 어느 쪽으로든 계속 넘길 수 있게 합니다. */
  const onTransitionEnd = () => {
    if (index >= FIRST && index <= LAST) return;
    setSnapping(true);
    setIndex(index + (index < FIRST ? TEMPLATES.length : -TEMPLATES.length));
    requestAnimationFrame(() => setSnapping(false));
  };

  return (
    <Canvas id="template-collection" height={HEIGHT} background="bg-cream" clip>
      <p
        className="absolute inset-x-0 whitespace-pre text-center font-display text-[27px] font-semibold leading-none tracking-[-1.2px] text-forest"
        style={{ top: `${EYEBROW_TOP}px` }}
      >
        <span
          className="relative font-latin text-[16px] font-semibold tracking-[0.65px]"
          style={{ top: `-${INDEX_RISE}px` }}
        >
          {templateCollection.eyebrow.index}{" "}
        </span>
        {templateCollection.eyebrow.label}
      </p>

      <h2
        className="text-kr absolute inset-x-0 text-center text-[70px] font-bold leading-[96px] tracking-[-0.01em] text-ink"
        style={{ top: `${HEADLINE_TOP}px` }}
      >
        {templateCollection.headline.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h2>

      <p
        className="text-kr absolute inset-x-0 text-center text-[22px] font-normal leading-[36px] tracking-[-0.01em] text-body"
        style={{ top: `${BODY_TOP}px` }}
      >
        {templateCollection.body.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </p>

      <div
        className="absolute inset-x-0 cursor-grab touch-pan-y select-none active:cursor-grabbing"
        style={{
          top: `${ROW_CENTER - CARD.active / 2}px`,
          height: `${CARD.active}px`,
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div
          className="flex h-full w-max items-center"
          style={{
            gap: `${CARD.gap}px`,
            transform: `translateX(${originFor(index) + dragX}px)`,
            transition:
              snapping || dragging
                ? "none"
                : "transform 600ms cubic-bezier(0.65, 0, 0.35, 1)",
          }}
          onTransitionEnd={onTransitionEnd}
        >
          {STRIP.map((template, i) => {
            const centered = i === index;
            return (
              <TemplateCard
                key={`${template.index}-${i}`}
                template={template}
                centered={centered}
                onSelect={() => {
                  if (!moved.current) setIndex(i);
                }}
              />
            );
          })}
        </div>
      </div>

      <div
        className="absolute inset-x-0 overflow-hidden"
        style={{ top: `${MARQUEE.top}px`, height: `${MARQUEE.height}px` }}
        aria-hidden
      >
        <div style={{ transform: `translateX(-${MARQUEE_START}px)` }}>
          <div className="template-marquee flex w-max whitespace-pre font-display text-[39px] font-normal leading-[56px] text-forest">
            {[0, 1].map((copy) =>
              templateCollection.marquee.map((phrase) => (
                <span
                  key={`${copy}-${phrase}`}
                  style={{ marginRight: `${MARQUEE.gap}px` }}
                >
                  {phrase}
                </span>
              )),
            )}
          </div>
        </div>
      </div>
    </Canvas>
  );
}

type CardProps = {
  template: (typeof TEMPLATES)[number];
  centered: boolean;
  onSelect: () => void;
};

function TemplateCard({ template, centered, onSelect }: CardProps) {
  return (
    <article
      data-centered={centered}
      className="rounded-ui group relative shrink-0 overflow-hidden bg-black transition-[height] duration-600 ease-[cubic-bezier(0.65,0,0.35,1)]"
      style={{
        width: `${CARD.width}px`,
        height: `${centered ? CARD.active : CARD.inactive}px`,
      }}
    >
      <Image
        src={template.image}
        alt={`${template.name} 템플릿 미리보기`}
        fill
        sizes={`${CARD.width}px`}
        data-cover
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
      />

      {centered ? (
        <>
          <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <p
              className="absolute inset-x-0 text-center font-display text-[32px] font-normal leading-none text-porcelain"
              style={{ top: `${NAME_TOP}px` }}
            >
              <span className="relative font-latin text-[15px] font-medium tracking-[0.5px] [font-variant-numeric:lining-nums]" style={{ top: "-7px" }}>
                {template.index}{" "}
              </span>
              / {template.name}
            </p>

            <a
              href={template.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-btn pointer-events-auto absolute left-1/2 flex -translate-x-1/2 items-center justify-center border border-porcelain font-latin text-[16px] font-medium tracking-[1.4px] text-porcelain transition-colors duration-200 hover:bg-porcelain hover:text-ink"
              style={{
                top: `${BUTTON.top}px`,
                width: `${BUTTON.width}px`,
                height: `${BUTTON.height}px`,
              }}
            >
              {templateCollection.cta}
            </a>
          </div>
        </>
      ) : (
        <button
          type="button"
          onClick={onSelect}
          className="absolute inset-0 cursor-pointer"
          aria-label={`${template.name} 템플릿 보기`}
        />
      )}
    </article>
  );
}
