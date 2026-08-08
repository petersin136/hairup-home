"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { DemoAdminDashboard } from "@/components/sections/DemoAdminDashboard";
import {
  DemoChat,
  type DemoChatHandle,
  IPHONE_MOCKUP,
} from "@/components/sections/DemoChat";
import { experience } from "@/content/site";
import {
  type BookingPayload,
  type DemoBooking,
  createSampleBookings,
  toDemoBooking,
} from "@/lib/demo-chat/booking";

/**
 * THE EXPERIENCE — HU_TEST DETAIL 시안
 *
 * 아트보드 1440
 * - L 183 · 폰 475×980 · R 160
 * - 리스트 구분선 500 (텍스트 컬럼은 더 넓게 — 22px 본문 한 줄 유지)
 * - 세로: 45 / 65 / 100 / 45 / 45
 */
const SIDE_L = 183;
const SIDE_R = 160;
const PHONE_W = IPHONE_MOCKUP.width;
const PHONE_H = IPHONE_MOCKUP.height;
/** 본문 최장줄(~505) + 여유 — 1440−183−475−160−520 = 102 */
const COL_GAP = 102;
const TEXT_COL_W = 520;
const LIST_W = 500;
const SECTION_TOP = 110;

export function Experience() {
  const chatRef = useRef<DemoChatHandle>(null);
  const deskOpenRef = useRef(false);
  const deskDelayRef = useRef<number | null>(null);
  const [deskOpen, setDeskOpen] = useState(false);
  const [bookings, setBookings] = useState<DemoBooking[]>([]);

  const handleBooking = useCallback((payload: BookingPayload) => {
    const next = toDemoBooking(payload, { isNew: true });
    setBookings((prev) => {
      if (prev.length === 0) {
        return [
          next,
          ...createSampleBookings().map((b) => ({ ...b, isNew: false })),
        ];
      }
      return [next, ...prev.map((b) => ({ ...b, isNew: false }))];
    });

    if (deskOpenRef.current || deskDelayRef.current !== null) return;

    deskDelayRef.current = window.setTimeout(() => {
      deskOpenRef.current = true;
      setDeskOpen(true);
      deskDelayRef.current = null;
    }, 1500);
  }, []);

  useEffect(() => {
    return () => {
      if (deskDelayRef.current) window.clearTimeout(deskDelayRef.current);
    };
  }, []);

  const clearNewFlag = useCallback((id: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isNew: false } : b)),
    );
  }, []);

  const closeDesk = useCallback(() => {
    deskOpenRef.current = false;
    setDeskOpen(false);
  }, []);

  const previewDesk = useCallback(() => {
    if (deskDelayRef.current) {
      window.clearTimeout(deskDelayRef.current);
      deskDelayRef.current = null;
    }
    deskOpenRef.current = false;
    setDeskOpen(false);

    const demo = toDemoBooking(
      {
        date: new Date().toISOString().slice(0, 10),
        time: "15:00",
        designer: "카이",
        services: "남성 컷",
        name: "테스트",
        gender: "M",
        phone: "01012345678",
        request: "개발용 미리보기",
        total: 27000,
      },
      { isNew: true },
    );
    setBookings([
      demo,
      ...createSampleBookings().map((b) => ({ ...b, isNew: false })),
    ]);

    deskDelayRef.current = window.setTimeout(() => {
      deskOpenRef.current = true;
      setDeskOpen(true);
      deskDelayRef.current = null;
    }, 400);
  }, []);

  const isDev = process.env.NODE_ENV === "development";

  return (
    <section
      id="ai-manager"
      className="relative w-full overflow-x-clip bg-porcelain"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-9 z-0 flex flex-col items-center gap-1 font-display text-[13px] font-medium tracking-[0.14em] text-ink/[0.12] uppercase"
        aria-hidden
      >
        {experience.accents.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </div>

      <div
        className="relative z-10 mx-auto flex w-[1440px] items-start"
        style={{
          paddingLeft: SIDE_L,
          paddingRight: SIDE_R,
          paddingTop: SECTION_TOP,
          paddingBottom: SECTION_TOP,
          gap: COL_GAP,
        }}
      >
        <div className="relative shrink-0" style={{ width: PHONE_W, height: PHONE_H }}>
          <DemoChat ref={chatRef} onBooking={handleBooking} />
        </div>

        <div className="min-w-0 shrink-0" style={{ width: TEXT_COL_W }}>
          {/* 02 / THE EXPERIENCE — Inter 14 + Playfair 25 · #2C3A2E */}
          <p className="flex items-center leading-none text-forest">
            <span className="font-latin mr-[6px] text-[14px] font-medium tracking-normal uppercase">
              {experience.eyebrow.index}
            </span>
            <span className="font-display text-[25px] font-medium uppercase">
              {experience.eyebrow.label}
            </span>
          </p>

          {/* 타이틀 — Noto 70/700 · 행간 96(1.37) · ls -0.02em · mt 45 */}
          <h2 className="text-kr mt-[45px] text-[70px] font-bold leading-[96px] tracking-[-0.02em] text-ink">
            {experience.headline.map((line) => (
              <span key={line} className="block whitespace-nowrap">
                {line}
              </span>
            ))}
          </h2>

          {/* 본문 — Noto 22/400 · #6C6864 · lh 1.64 · mt 65 · 시안 줄바꿈 고정 */}
          <p className="text-kr mt-[65px] text-[22px] font-normal leading-[1.64] text-body">
            {experience.body.map((line) => (
              <span key={line} className="block whitespace-nowrap">
                {line}
              </span>
            ))}
          </p>

          {/* TRY ASKING. — Playfair 44/500 · #2C3A2E · mt 100 */}
          <p className="font-display mt-[100px] text-[44px] font-medium leading-none text-forest uppercase">
            {experience.tryAsking.title}
          </p>

          {/* 설명 — Noto 22/400 · lh 1.64 · mt 45 · 막막하다면, 뒤 줄바꿈 */}
          <p className="text-kr mt-[45px] text-[22px] font-normal leading-[1.64] text-body">
            {experience.tryAsking.body.map((line) => (
              <span key={line} className="block whitespace-nowrap">
                {line}
              </span>
            ))}
          </p>

          {/*
            질문 리스트 — DETAIL_03
            구분선 500 · 1px rgba(108,104,100,0.7)
            글 22/400 rgba(102,102,102,0.7) · 호버 #2C3A2E
          */}
          <ul className="mt-[45px]" style={{ width: LIST_W }}>
            {experience.examples.map((q, i) => (
              <li key={q} style={{ width: LIST_W }}>
                {i === 0 ? (
                  <div
                    className="h-px w-full"
                    style={{ background: "rgba(108, 104, 100, 0.7)" }}
                    aria-hidden
                  />
                ) : null}
                <button
                  type="button"
                  onClick={() => chatRef.current?.ask(q)}
                  className="text-kr group flex w-full items-center gap-3 py-[22px] text-left text-[22px] font-normal leading-none tracking-[-0.01em] text-[rgba(102,102,102,0.7)] transition-colors hover:text-forest"
                >
                  <span aria-hidden className="question-chevron shrink-0" />
                  <span className="min-w-0 flex-1 whitespace-nowrap">{q}</span>
                </button>
                <div
                  className="h-px w-full"
                  style={{ background: "rgba(108, 104, 100, 0.7)" }}
                  aria-hidden
                />
              </li>
            ))}
          </ul>
        </div>
      </div>

      {isDev ? (
        <div
          className="relative z-10 mx-auto w-[1440px]"
          style={{
            paddingLeft: SIDE_L + PHONE_W + COL_GAP,
            paddingRight: SIDE_R,
          }}
        >
          <button
            type="button"
            onClick={previewDesk}
            className="mt-4 rounded-[2px] border border-dashed border-ink/25 px-3 py-2 font-latin text-[11px] tracking-[0.08em] text-ink/55 uppercase transition-colors hover:border-gold hover:text-gold"
          >
            [Dev] Preview booking overlay
          </button>
        </div>
      ) : null}

      {deskOpen ? (
        <DemoAdminDashboard
          bookings={bookings}
          onBookingOpened={clearNewFlag}
          onClose={closeDesk}
        />
      ) : null}
    </section>
  );
}
