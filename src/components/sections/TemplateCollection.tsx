"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

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
/** 카드 폭의 몇 할을 끌어야 다음 장으로 넘어가는지 */
const SNAP = 0.2;

/** 카드 위끝을 기준으로 한 오버레이 좌표 */
const NAME = { top: 183, size: 26.5, index: 13, rise: 8 };
const BUTTON = { top: 258, width: 229, height: 56 };

/*
 * 하단 문구 띠. 시안 서체가 Playfair Display 보다 낱글자가 좁아서, 06 과 같은
 * 기준으로 캡 높이(39px 상당)보다 낱말 폭이 맞는 35px 을 골랐습니다.
 * 그만큼 좁아진 어절 사이는 word-spacing 으로 되돌립니다.
 */
const MARQUEE = { top: 1607, height: 56, size: 35.2, wordSpacing: 3.2, gap: 64 };
/** 시안은 첫 문구의 P 가 화면 왼쪽으로 잘린 지점에서 멈춰 있습니다. */
const MARQUEE_START = 20;

const TEMPLATES = templateCollection.templates;

/*
 * 카드는 목록을 몇 벌 이어 붙인 유한한 줄이 아니라, 끝없이 뻗은 자리 번호 위에
 * 놓습니다. 자리 번호 i 는 음수로도 커지고 어떤 목록 항목인지는 나머지로 정하므로,
 * 몇 번을 넘겨도 되돌릴 일이 없습니다. 되돌리는 순간이 없으니 튀지도 않습니다.
 */
const at = (i: number) =>
  TEMPLATES[((i % TEMPLATES.length) + TEMPLATES.length) % TEMPLATES.length];

/** 가운데 자리 좌우로 몇 장까지 그려 둘지. 3 장이면 5300px 폭까지 빈자리가 없습니다. */
const REACH = 3;

/** i 번 자리를 화면 가운데(x 720)에 놓기 위한 줄 전체의 이동 거리 */
const originFor = (i: number) => 720 - i * PITCH - CARD.width / 2;

export function TemplateCollection() {
  const [index, setIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0);
  const offset = useRef(0);
  /** 드래그로 끝난 동작이 옆 카드 클릭까지 발동시키지 않도록 남겨 둡니다. */
  const moved = useRef(false);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    startX.current = e.clientX;
    offset.current = 0;
    moved.current = false;
    setDragging(true);
  };

  /*
   * 포인터를 캡처하면 카드 안의 링크·버튼이 클릭을 못 받으므로, 대신 끄는 동안만
   * 창 전체에서 듣습니다. 이러면 커서가 섹션 밖으로 나가도 계속 따라옵니다.
   */
  useEffect(() => {
    if (!dragging) return;

    const onMove = (e: PointerEvent) => {
      offset.current = e.clientX - startX.current;
      if (Math.abs(offset.current) > 3) moved.current = true;
      setDragX(offset.current);
    };
    const onUp = () => {
      setDragging(false);
      setDragX(0);
      /* 카드 한 장을 다 끌지 않아도 20% 만 넘기면 다음 장으로 넘어갑니다. */
      const raw = -offset.current / PITCH;
      const steps = Math.sign(raw) * Math.floor(Math.abs(raw) + 1 - SNAP);
      setIndex((i) => i + steps);
      offset.current = 0;
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [dragging]);

  /* 가운데 자리를 중심으로 좌우 REACH 장씩만 실제로 그립니다. */
  const seats = Array.from(
    { length: REACH * 2 + 1 },
    (_, n) => index - REACH + n,
  );

  return (
    /*
     * 카드 줄과 하단 문구 띠는 시안에서 좌우가 잘려 나가는 요소입니다.
     * 1440 캔버스가 아니라 섹션(=화면 폭)에서 잘라내야 화면이 1440 보다 넓을 때
     * 여백 안쪽에서 뚝 끊기지 않고 화면 끝까지 이어집니다.
     */
    <Canvas
      id="template-collection"
      height={HEIGHT}
      background="bg-cream"
      className="overflow-hidden"
    >
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
      >
        <div
          data-track
          className="absolute inset-y-0 left-0"
          style={{
            transform: `translateX(${originFor(index) + dragX}px)`,
            transition: dragging
              ? "none"
              : "transform 600ms cubic-bezier(0.65, 0, 0.35, 1)",
          }}
        >
          {seats.map((seat) => (
            <TemplateCard
              key={seat}
              template={at(seat)}
              left={seat * PITCH}
              centered={seat === index}
              onSelect={() => {
                if (!moved.current) setIndex(seat);
              }}
            />
          ))}
        </div>
      </div>

      <div
        className="absolute left-1/2 w-screen -translate-x-1/2 overflow-hidden"
        style={{ top: `${MARQUEE.top}px`, height: `${MARQUEE.height}px` }}
        aria-hidden
      >
        <div style={{ transform: `translateX(-${MARQUEE_START}px)` }}>
          <div
            className="template-marquee flex w-max whitespace-pre font-display font-normal text-forest"
            style={{
              fontSize: `${MARQUEE.size}px`,
              lineHeight: `${MARQUEE.height}px`,
              wordSpacing: `${MARQUEE.wordSpacing}px`,
            }}
          >
            {[0, 1, 2].map((copy) =>
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
  /** 줄 안에서의 자리(px). 자리마다 값이 고정이라 좌우 끝에서 카드를 넣고 빼도 줄이 흔들리지 않습니다. */
  left: number;
  centered: boolean;
  onSelect: () => void;
};

function TemplateCard({ template, left, centered, onSelect }: CardProps) {
  return (
    <article
      data-centered={centered}
      className="rounded-ui group absolute top-1/2 -translate-y-1/2 overflow-hidden bg-black transition-[height] duration-600 ease-[cubic-bezier(0.65,0,0.35,1)]"
      style={{
        left: `${left}px`,
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
        draggable={false}
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
      />

      {centered ? (
        <>
          {/* 시안은 카드 안이 통째로 검정이라, 대문 이미지 위 글자가 그만큼
              또렷하게 읽히도록 충분히 어둡게 덮습니다. */}
          <div className="absolute inset-0 bg-black/90 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <p
              className="absolute inset-x-0 text-center font-display font-normal leading-none text-porcelain"
              style={{ top: `${NAME.top}px`, fontSize: `${NAME.size}px` }}
            >
              <span
                className="relative font-latin font-medium tracking-[0.5px] [font-variant-numeric:lining-nums]"
                style={{ fontSize: `${NAME.index}px`, top: `-${NAME.rise}px` }}
              >
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
