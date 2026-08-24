"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { GlyphLines } from "@/components/copy/GlyphLines";
import { Canvas } from "@/components/layout/Canvas";
import { templateCollection } from "@/content/site";

/**
 * 07_Template Collection — 시안 12-D 지시사항
 *
 * 카피 스택: Key Benefits(04) 와 동일 — SECTION-TAG + SECTION-COPY-TITLE/DESC
 * tag→title 42 · title→desc 36 · desc→카드 150 · 카드→마퀴 200
 * .TEMPLATE-CARD-LEFT/RIGHT  688 × 410 · radius 6 · 대기상태 overlay black/50%
 * 카드 간격 33 · 본문 아래 150 · 카드 아래 200
 * 마퀴→Pricing 여백 300 은 Pricing TAG_TOP 이 담당
 *
 * 카드 줄은 가운데 한 장만 크고 좌우 이웃이 화면 밖으로 잘려 나갑니다.
 * 좌우 카드는 커서를 올리기만 해도 가운데로 미끄러져 옵니다.
 */
const TAG_TOP = 344;
const GAP_DESC_CARDS = 150;
const GAP_CARDS_MARQUEE = 200;

const CARD = {
  activeW: 840,
  activeH: 500,
  inactiveW: 688,
  inactiveH: 410,
  gap: 33,
};
/** 자리 간격은 활성 카드 폭 + 거터. 비활성은 슬롯 안에서 가운데 쪽으로 붙입니다. */
const PITCH = CARD.activeW + CARD.gap;
/** copy 스택 + desc→카드 150 — margin stack 과 동일한 여백 */
const CARD_TOP = TAG_TOP + 488 + GAP_DESC_CARDS;
const ROW_CENTER = CARD_TOP + CARD.activeH / 2;
/** 카드 폭의 몇 할을 끌어야 다음 장으로 넘어가는지 */
const SNAP = 0.2;

/** 줄이 미끄러지는 시간(ms). 아래 transition 값과 같아야 합니다. */
const GLIDE = 600;
/** 호버로 한 장 넘긴 뒤, 커서가 이만큼(px) 움직여야 다음 호버를 받습니다. */
const HOVER_REARM = 24;

/** 카드 호버 오버레이 · 시안 13-D */
const VIEW_BTN = { width: 225, height: 45, gap: 13 };

/*
 * 하단 마퀴 · 시안 14-D
 * .MARQUEE-TRACK SPAN  Playfair 33/400 · #2C3A2E · uppercase · flex-shrink 0
 * 문구 간격 65 · 기본 우→좌, 스크롤로 가속·역방향
 */
const MARQUEE = {
  top: CARD_TOP + CARD.activeH + 200,
  height: 43,
  gap: 65,
};
const HEIGHT = Math.ceil(MARQUEE.top + MARQUEE.height);
/** 시안은 첫 문구의 P 가 화면 왼쪽으로 잘린 지점에서 멈춰 있습니다. */
const MARQUEE_START = 20;
/** 한 벌(=1/3)을 밀어내는 데 걸리는 시간. 예전 CSS 42s 와 같습니다. */
const MARQUEE_CYCLE_MS = 42_000;
/** 스크롤 중 목표 배속. 내리면 +2×, 올리면 −2×(역방향). */
const MARQUEE_SCROLL_MULT = 2;
/** 마지막 스크롤 뒤 이 시간(ms) 동안은 2배속을 유지합니다. */
const MARQUEE_SCROLL_HOLD_MS = 180;
/** hold 가 끝난 뒤 배속이 이 비율로 식어 1배로 돌아옵니다. (16ms 당) */
const MARQUEE_BOOST_DECAY = 0.92;

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

/**
 * 호버 빗장. 마지막으로 넘긴 시각과 그때 커서가 있던 자리를 들고 있습니다.
 * 렌더 중에 시계를 읽으면 안 되므로 여닫는 일은 컴포넌트 밖에서 합니다.
 */
type HoverGate = { armed: boolean; x: number; y: number; at: number };

function closeGate(gate: HoverGate, x: number, y: number) {
  gate.armed = false;
  gate.x = x;
  gate.y = y;
  gate.at = performance.now();
}

function tryOpenGate(gate: HoverGate, x: number, y: number) {
  if (gate.armed) return;
  /* 미끄러지는 중에는 어차피 자리가 확정되지 않았으니 세지 않습니다. */
  if (performance.now() - gate.at < GLIDE) return;
  if (Math.hypot(x - gate.x, y - gate.y) > HOVER_REARM) gate.armed = true;
}

/** i 번 자리를 화면 가운데(x 720)에 놓기 위한 줄 전체의 이동 거리 */
const originFor = (i: number) => 720 - i * PITCH - CARD.activeW / 2;

export function TemplateCollection() {
  const [index, setIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0);
  const offset = useRef(0);
  /** 드래그로 끝난 동작이 옆 카드 클릭까지 발동시키지 않도록 남겨 둡니다. */
  const moved = useRef(false);

  /*
   * 호버로 한 장 넘기면 방금 하던 카드가 가운데로 빠지고 그 자리에 다음 카드가
   * 들어옵니다. 커서는 가만히 있어도 새 카드 위에 놓이게 되므로, 그걸 또 호버로
   * 세면 줄이 저 혼자 끝없이 돌아갑니다. 그래서 한 번 받은 뒤에는 빗장을 걸고,
   * 커서가 실제로 움직였을 때만 다시 엽니다.
   */
  const gate = useRef<HoverGate>({ armed: true, x: 0, y: 0, at: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) =>
      tryOpenGate(gate.current, e.clientX, e.clientY);

    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const onCardHover = (seat: number) => (e: React.PointerEvent) => {
    /* 손가락으로 짚는 것은 호버가 아니라 탭이므로 클릭 쪽에 맡깁니다. */
    if (e.pointerType !== "mouse") return;
    if (dragging || seat === index || !gate.current.armed) return;
    closeGate(gate.current, e.clientX, e.clientY);
    setIndex(seat);
  };

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
    const onUp = (e: PointerEvent) => {
      setDragging(false);
      setDragX(0);
      /* 카드 한 장을 다 끌지 않아도 20% 만 넘기면 다음 장으로 넘어갑니다. */
      const raw = -offset.current / PITCH;
      const steps = Math.sign(raw) * Math.floor(Math.abs(raw) + 1 - SNAP);
      setIndex((i) => i + steps);
      offset.current = 0;
      /* 손을 뗀 자리에 우연히 놓인 카드가 곧바로 또 넘어가지 않게 합니다. */
      closeGate(gate.current, e.clientX, e.clientY);
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
      id="template"
      height={HEIGHT}
      background="bg-porcelain"
      className="overflow-hidden"
    >
      {/* 카피 — Key Benefits 와 동일 margin stack */}
      <div
        className="SECTION-COPY-STACK SECTION-COPY-STACK--center absolute inset-x-0"
        style={{ top: `${TAG_TOP}px` }}
      >
        <p className="SECTION-TAG text-forest">
          {templateCollection.tag.before}
          <em>{templateCollection.tag.article}</em>
          {templateCollection.tag.after}
        </p>

        <h2 className="SECTION-COPY-TITLE text-kr">
          <GlyphLines lines={templateCollection.headline} />
        </h2>

        <p className="SECTION-COPY-DESC text-kr">
          <GlyphLines lines={templateCollection.body} />
        </p>
      </div>

      <div
        className="absolute inset-x-0 cursor-grab touch-pan-y select-none active:cursor-grabbing"
        style={{
          top: `${ROW_CENTER - CARD.activeH / 2}px`,
          height: `${CARD.activeH}px`,
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
              seat={seat}
              activeIndex={index}
              centered={seat === index}
              onHover={onCardHover(seat)}
              onSelect={() => {
                if (!moved.current) setIndex(seat);
              }}
            />
          ))}
        </div>
      </div>

      <TemplateMarquee />
    </Canvas>
  );
}

/**
 * 문구를 세 벌 이어 붙이고 한 벌만큼(=1/3) 밀어내면 이음매 없이 흐릅니다.
 * 세 벌인 이유는 한 벌이 끝까지 밀려간 순간에도 남은 두 벌이 넓은 화면을
 * 빈틈없이 덮게 하기 위해서입니다.
 *
 * 위치는 CSS animation 이 아니라 rAF 로 직접 밉니다. 속도는 기본(1×)에
 * 스크롤 배속(내리면 +2×, 올리면 −2×)을 곱하고, 손을 떼면 1×로 식습니다.
 */
function TemplateMarquee() {
  const track = useRef<HTMLDivElement>(null);
  /** 지금까지 흘러온 거리(px). 양수일수록 왼쪽(우→좌). */
  const flowed = useRef(MARQUEE_START);
  /** 기본 속도에 곱하는 배속. 1 = 평소, 2 = 스크롤 다운, −2 = 스크롤 업 역방향. */
  const drive = useRef(1);
  const lastY = useRef(0);
  /** 마지막으로 스크롤이 들어온 시각. hold 구간에는 감쇠하지 않습니다. */
  const scrolledAt = useRef(0);

  useEffect(() => {
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    lastY.current = window.scrollY;

    const applyScroll = (dy: number) => {
      if (dy === 0) return;
      /*
       * 트랙패드는 dy 가 1~수 px 이라 비율로 붙이면 거의 안 움직입니다.
       * 방향만 보고 바로 2배(또는 −2배)에 고정하고, hold 동안 유지합니다.
       */
      drive.current = dy > 0 ? MARQUEE_SCROLL_MULT : -MARQUEE_SCROLL_MULT;
      scrolledAt.current = performance.now();
    };

    const onScroll = () => {
      const y = window.scrollY;
      applyScroll(y - lastY.current);
      lastY.current = y;
    };

    /* 페이지 끝에서 scrollY 가 안 바뀌어도 휠은 오므로 같이 듣습니다. */
    const onWheel = (e: WheelEvent) => applyScroll(e.deltaY);

    let frame = 0;
    let prev = performance.now();

    const tick = (now: number) => {
      const dt = now - prev;
      prev = now;

      if (!still.matches && track.current) {
        const cycle = track.current.scrollWidth / 3;
        if (cycle > 0) {
          const base = cycle / MARQUEE_CYCLE_MS;

          if (now - scrolledAt.current > MARQUEE_SCROLL_HOLD_MS) {
            drive.current =
              1 + (drive.current - 1) * Math.pow(MARQUEE_BOOST_DECAY, dt / 16);
            if (Math.abs(drive.current - 1) < 0.01) drive.current = 1;
          }

          flowed.current += base * drive.current * dt;
          const wrapped = ((flowed.current % cycle) + cycle) % cycle;
          track.current.style.transform = `translate3d(${-wrapped}px, 0, 0)`;
        }
      }

      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: true });
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onWheel);
    };
  }, []);

  return (
    <div
      className="absolute left-1/2 w-screen -translate-x-1/2 overflow-hidden"
      style={{ top: `${MARQUEE.top}px`, height: `${MARQUEE.height}px` }}
      aria-hidden
    >
      <div
        ref={track}
        className="flex w-max shrink-0 whitespace-pre font-display text-[33px] font-normal uppercase leading-none text-forest will-change-transform"
        style={{
          lineHeight: `${MARQUEE.height}px`,
        }}
      >
        {[0, 1, 2].map((copy) =>
          templateCollection.marquee.map((phrase) => (
            <span
              key={`${copy}-${phrase}`}
              className="shrink-0"
              style={{ marginRight: `${MARQUEE.gap}px` }}
            >
              {phrase}
            </span>
          )),
        )}
      </div>
    </div>
  );
}

type CardProps = {
  template: (typeof TEMPLATES)[number];
  /** 줄 안에서의 자리(px). 자리마다 값이 고정이라 좌우 끝에서 카드를 넣고 빼도 줄이 흔들리지 않습니다. */
  left: number;
  seat: number;
  activeIndex: number;
  centered: boolean;
  /** 좌우 카드에 커서가 들어온 순간. 가운데 카드로 끌어옵니다. */
  onHover: (e: React.PointerEvent) => void;
  onSelect: () => void;
};

function TemplateCard({
  template,
  left,
  seat,
  activeIndex,
  centered,
  onHover,
  onSelect,
}: CardProps) {
  const width = centered ? CARD.activeW : CARD.inactiveW;
  const height = centered ? CARD.activeH : CARD.inactiveH;
  /* 비활성(왼쪽)은 슬롯 안에서 오른쪽으로 붙여 가운데와의 간격 33 을 맞춥니다. */
  const inset =
    !centered && seat < activeIndex ? CARD.activeW - CARD.inactiveW : 0;

  return (
    <article
      data-centered={centered}
      onPointerEnter={onHover}
      className="rounded-ui group absolute top-1/2 -translate-y-1/2 overflow-hidden bg-black transition-[left,width,height] duration-600 ease-[cubic-bezier(0.65,0,0.35,1)]"
      style={{
        left: `${left + inset}px`,
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      <Image
        src={template.image}
        alt={`${template.name} 템플릿 미리보기`}
        fill
        sizes={`${CARD.activeW}px`}
        data-cover
        draggable={false}
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
      />

      {centered ? (
        <>
          {/* .TEMPLATE-CARD-CENTER-HOVER — black/50% · blur 7px */}
          <div className="absolute inset-0 bg-black/50 opacity-0 backdrop-blur-[7px] transition-opacity duration-500 group-hover:opacity-100" />

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            {/* .TITLE-STUDIO-SIGNATURE */}
            <p className="flex items-start justify-center font-display text-[25px] font-medium uppercase leading-none text-porcelain">
              {/* .TITLE-STUDIO-SIGNATURE .SUB.01/ */}
              <span className="section-eyebrow-index mr-[6px] text-[14px] font-medium leading-none tracking-normal">
                {template.index} /
              </span>
              {template.name}
            </p>

            {/* .BTN-VIEW · gap 45 / 13 */}
            <div
              className="pointer-events-auto flex"
              style={{
                marginTop: "45px",
                gap: `${VIEW_BTN.gap}px`,
              }}
            >
              <a
                href={template.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-btn inline-flex items-center justify-center border border-porcelain bg-transparent font-latin text-[16px] font-normal uppercase text-porcelain no-underline transition-all duration-200 ease-in-out hover:border-porcelain hover:bg-porcelain hover:text-ink"
                style={{
                  width: `${VIEW_BTN.width}px`,
                  height: `${VIEW_BTN.height}px`,
                }}
              >
                {templateCollection.ctas.pc}
              </a>
              <a
                href={template.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-btn inline-flex items-center justify-center border border-porcelain bg-transparent font-latin text-[16px] font-normal uppercase text-porcelain no-underline transition-all duration-200 ease-in-out hover:border-porcelain hover:bg-porcelain hover:text-ink"
                style={{
                  width: `${VIEW_BTN.width}px`,
                  height: `${VIEW_BTN.height}px`,
                }}
              >
                {templateCollection.ctas.mobile}
              </a>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* 대기상태 — black / opacity 50% */}
          <div className="pointer-events-none absolute inset-0 bg-black/50" />
          <button
            type="button"
            onClick={onSelect}
            className="absolute inset-0 cursor-pointer"
            aria-label={`${template.name} 템플릿 보기`}
          />
        </>
      )}
    </article>
  );
}
