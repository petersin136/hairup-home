"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { GlyphLines } from "@/components/copy/GlyphLines";
import { Canvas } from "@/components/layout/Canvas";
import { templateCollection } from "@/content/site";

/**
 * 07_Template Collection — 시안 hu_TEMPLATE PC 01–06
 *
 * 01  섹션 상단 200 · tag→title 42 · title→desc 36 (.TEMPLATE-TAG/-TITLE/-DESC)
 * 02  중앙 활성 .TEMPLATE-CARD-ACTIVE 840 × 650 · radius 10 · 배경 흰색
 *     desc→카드 85 · 카드 좌우 간격 33
 * 03  카드 하단 정보 (.CARD-TAG/-TITLE/-DESC) · 이미지→태그 33 · 26 · 17 · 33 · 좌측 30
 * 04  듀얼 버튼 (.BTN-VIEW-DEMO / .BTN-GET-STARTED) · 29 · 12 · 29 · 우측 30
 * 05  대기 .TEMPLATE-CARD-WAITING 688 · radius 10 · opacity 0.3
 * 06  카드→마퀴 200 · 마퀴→섹션 끝 200
 *
 * 카드 3장 고정 · 무한 루프 없음.
 * 진입 시 2번 카드가 화면 정중앙, 1·3번은 좌우에 일부 걸쳐 대기.
 * 전환은 대기 카드를 눌렀을 때만 일어납니다(호버 전환 없음).
 */
const TAG_TOP = 200;
/** Playfair 13 · text-box trim(text alphabetic) 실측 */
const TAG_H = 14;
const GAP_TAG_TITLE = 42;
const GAP_TITLE_DESC = 36;
/** 40/600 · lh 1.375 · 3줄 · text-box trim(cap alphabetic) 실측 */
const TITLE_H = 139.31;
/** 17/400 · lh 1.588 · 3줄 · text-box trim(cap alphabetic) 실측 */
const DESC_H = 66.44;
const GAP_DESC_CARDS = 85;
const GAP_CARDS_MARQUEE = 200;
const PAD_MARQUEE_BOTTOM = 200;

const CARD = {
  activeW: 840,
  activeH: 650,
  inactiveW: 688,
  inactiveH: 532,
  gap: 33,
};
/** 자리 간격은 활성 카드 폭 + 거터. 비활성은 슬롯 안에서 가운데 쪽으로 붙입니다. */
const PITCH = CARD.activeW + CARD.gap;
/** tag→title 42 · title→desc 36 · desc→카드 150 (01–04 와 동일) */
const COPY_STACK_H = TAG_H + GAP_TAG_TITLE + TITLE_H + GAP_TITLE_DESC + DESC_H;
const CARD_TOP = TAG_TOP + COPY_STACK_H + GAP_DESC_CARDS;
const ROW_CENTER = CARD_TOP + CARD.activeH / 2;
/** 카드 폭의 몇 할을 끌어야 다음 장으로 넘어가는지 */
const SNAP = 0.2;

/*
 * 하단 마퀴 · hu_MARQUEE_DETAIL_PC
 * .MARQUEE-TRACK  flex · align-items center · gap 90 · nowrap
 * .MARQUEE-TEXT   Playfair 24/400 · letter-spacing 0.035em · rgb(44,58,46)
 * 카드→마퀴 200 · 마퀴→섹션 끝 200 · 기본 우→좌, 스크롤로 가속·역방향
 * Playfair 24 trim-both / text alphabetic 박스 높이 실측 26
 */
const MARQUEE_TEXT_H = 26;
const MARQUEE_TOP = CARD_TOP + CARD.activeH + GAP_CARDS_MARQUEE;
const HEIGHT = Math.ceil(MARQUEE_TOP + MARQUEE_TEXT_H + PAD_MARQUEE_BOTTOM);
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
const CARD_COUNT = TEMPLATES.length;
/** 진입 시 2번 카드(인덱스 1)가 화면 정중앙 */
const INITIAL_INDEX = 1;

const clampIndex = (i: number) =>
  Math.max(0, Math.min(CARD_COUNT - 1, i));

/** 드래그 오프셋 — 1번·3번 끝에서 반대 방향으로는 넘어가지 않음 */
const clampDragOffset = (offset: number, index: number) => {
  let clamped = Math.max(-PITCH, Math.min(PITCH, offset));
  if (index === 0 && clamped > 0) clamped = 0;
  if (index === CARD_COUNT - 1 && clamped < 0) clamped = 0;
  return clamped;
};

/** i 번 자리를 화면 가운데(x 720)에 놓기 위한 줄 전체의 이동 거리 */
const originFor = (i: number) => 720 - i * PITCH - CARD.activeW / 2;

export function TemplateCollection() {
  const [index, setIndex] = useState(INITIAL_INDEX);
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
      offset.current = clampDragOffset(e.clientX - startX.current, index);
      if (Math.abs(offset.current) > 3) moved.current = true;
      setDragX(offset.current);
    };
    const onUp = () => {
      setDragging(false);
      setDragX(0);
      /* 카드 한 장을 다 끌지 않아도 20% 만 넘기면 다음 장으로 넘어갑니다. */
      const raw = -offset.current / PITCH;
      const steps = Math.sign(raw) * Math.floor(Math.abs(raw) + 1 - SNAP);
      setIndex((i) => clampIndex(i + steps));
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
  }, [dragging, index]);

  const seats = TEMPLATES.map((_, seat) => seat);

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
      {/* 카피 — hu_TEMPLATE PC 01 */}
      <div className="absolute inset-x-0" style={{ top: `${TAG_TOP}px` }}>
        <p className="TEMPLATE-TAG">
          {templateCollection.tag.before}
          <em>{templateCollection.tag.article}</em>
          {templateCollection.tag.after}
        </p>

        <h2 className="TEMPLATE-TITLE">
          <GlyphLines lines={templateCollection.headline} />
        </h2>

        <p className="TEMPLATE-DESC">
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
              template={TEMPLATES[seat]}
              left={seat * PITCH}
              seat={seat}
              activeIndex={index}
              centered={seat === index}
              onSelect={() => {
                if (!moved.current) setIndex(clampIndex(seat));
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
      style={{
        top: `${MARQUEE_TOP}px`,
        paddingBottom: PAD_MARQUEE_BOTTOM,
      }}
      aria-hidden
    >
      <div ref={track} className="MARQUEE-TRACK w-max will-change-transform">
        {[0, 1, 2].map((copy) =>
          templateCollection.marquee.map((phrase) => (
            <span key={`${copy}-${phrase}`} className="MARQUEE-TEXT">
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
  /** 대기 카드를 눌렀을 때만 가운데로 끌어옵니다. */
  onSelect: () => void;
};

function TemplateCard({
  template,
  left,
  seat,
  activeIndex,
  centered,
  onSelect,
}: CardProps) {
  /* 비활성(왼쪽)은 슬롯 안에서 오른쪽으로 붙여 가운데와의 간격 33 을 맞춥니다. */
  const inset =
    !centered && seat < activeIndex ? CARD.activeW - CARD.inactiveW : 0;

  const isDark =
    centered && "cardTheme" in template && template.cardTheme === "dark";

  return (
    <article
      data-centered={centered}
      data-theme={isDark ? "dark" : undefined}
      className={
        centered
          ? `TEMPLATE-CARD TEMPLATE-CARD-ACTIVE${isDark ? " TEMPLATE-CARD--DARK" : ""}`
          : "TEMPLATE-CARD TEMPLATE-CARD-WAITING"
      }
      style={{ left: `${left + inset}px` }}
    >
      {/* 대기 전용 PNG — 688 × 532 를 카드 전면에 */}
      <div className="TEMPLATE-CARD-IMG" style={{ opacity: centered ? 0 : 1 }}>
        <Image
          src={template.imageWaiting}
          alt={centered ? "" : `${template.name} 템플릿 미리보기`}
          fill
          sizes={`${CARD.inactiveW}px`}
          draggable={false}
          className="object-cover"
          unoptimized
        />
      </div>

      {/* 활성 전용 PNG — 840 × 650 중 위 500 만 쓰고 아래 150 은 카드 흰 배경 */}
      <div
        className="TEMPLATE-CARD-IMG TEMPLATE-CARD-IMG--active"
        style={{ opacity: centered ? 1 : 0 }}
      >
        <Image
          src={template.imageActive}
          alt={centered ? `${template.name} 템플릿 미리보기` : ""}
          fill
          sizes={`${CARD.activeW}px`}
          draggable={false}
          priority={seat === INITIAL_INDEX}
          className="object-cover object-top"
          unoptimized
        />
      </div>

      {/* hu_TEMPLATE PC 03 — 하단 정보 */}
      <div
        className="TEMPLATE-CARD-INFO"
        style={{ opacity: centered ? 1 : 0 }}
        aria-hidden={!centered}
      >
        <p className="CARD-TAG">{template.cardTag}</p>
        <p className="CARD-TITLE">{template.name}</p>
        {template.cardDesc ? (
          <p className="CARD-DESC text-kr">{template.cardDesc}</p>
        ) : null}
      </div>

      {/* hu_TEMPLATE PC 04 — 듀얼 버튼 */}
      <div
        className="TEMPLATE-CARD-BTNS"
        style={{
          opacity: centered ? 1 : 0,
          pointerEvents: centered ? "auto" : "none",
        }}
        aria-hidden={!centered}
      >
        <a
          className="BTN-VIEW-DEMO"
          href={template.href}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={centered ? undefined : -1}
        >
          <span className="TEMPLATE-BTN-ROLL">
            <span className="TXT-EN">{templateCollection.cardCtas.demo.label}</span>
            <span className="TXT-KR" aria-hidden>
              {templateCollection.cardCtas.demo.labelKr}
            </span>
          </span>
        </a>
        <a
          className="BTN-GET-STARTED"
          href={templateCollection.cardCtas.start.href}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={centered ? undefined : -1}
        >
          <span className="TEMPLATE-BTN-ROLL">
            <span className="TXT-EN">{templateCollection.cardCtas.start.label}</span>
            <span className="TXT-KR" aria-hidden>
              {templateCollection.cardCtas.start.labelKr}
            </span>
          </span>
        </a>
      </div>

      {/* 대기 카드는 눌렀을 때만 가운데로 옵니다 */}
      {centered ? null : (
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
