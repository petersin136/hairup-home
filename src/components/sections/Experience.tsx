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
 * - 리스트 구분선 500
 * - 세로(시각 보정): 36 / 52 / 80 / 36 / 36
 *   ※ 시안 표기 45/65/100/45/45 — 행간 포함 시 과해 보여 약 80%로 조정
 */
const SIDE_L = 183;
const SIDE_R = 160;
const PHONE_W = IPHONE_MOCKUP.width;
const PHONE_H = IPHONE_MOCKUP.height;
/** 본문 최장줄 + 여유 — 폰↔텍스트 간격 120 */
const COL_GAP = 120;
const TEXT_COL_W = 520;
const LIST_W = 500;
const SECTION_TOP = 96;
/** 폰 목업 하단 ↔ 섹션 끝 = 150 (다음 CRM 상단 여백과 동일) */
const SECTION_BOTTOM = 150;

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
        className="relative z-10 mx-auto flex w-[1440px] items-start"
        style={{
          paddingLeft: SIDE_L,
          paddingRight: SIDE_R,
          paddingTop: SECTION_TOP,
          paddingBottom: SECTION_BOTTOM,
          gap: COL_GAP,
        }}
      >
        <div className="relative shrink-0" style={{ width: PHONE_W, height: PHONE_H }}>
          <DemoChat ref={chatRef} onBooking={handleBooking} />
        </div>

        <div className="min-w-0 shrink-0" style={{ width: TEXT_COL_W }}>
          {/* 02 / THE EXPERIENCE — Inter 14 + Playfair 25 · #2C3A2E */}
          <p className="flex items-start leading-none text-forest">
            <span className="section-eyebrow-index font-latin mr-[6px] text-[14px] font-medium leading-none tracking-normal uppercase">
              {experience.eyebrow.index}
            </span>
            <span className="font-display text-[25px] font-medium leading-none uppercase">
              {experience.eyebrow.label}
            </span>
          </p>

          {/* 타이틀 — Noto 70/700 · 행간 1.2 · mt 36 */}
          <h2 className="text-kr mt-[36px] text-[70px] font-bold leading-[1.37] tracking-[-0.01em] text-ink">
            {experience.headline.map((line) => (
              <span key={line} className="block whitespace-nowrap">
                {line}
              </span>
            ))}
          </h2>

          {/* 본문 — Noto 22/400 · #6C6864 · lh 1.64 · mt 52 */}
          <p className="text-kr mt-[52px] text-[22px] font-normal leading-[1.64] text-body">
            {experience.body.map((line) => (
              <span key={line} className="block whitespace-nowrap">
                {line}
              </span>
            ))}
          </p>

          {/* TRY ASKING. — Playfair 44/500 · #2C3A2E · mt 80 */}
          <p className="font-display mt-[80px] text-[44px] font-medium leading-none text-forest uppercase">
            {experience.tryAsking.title}
          </p>

          {/* 설명 — Noto 22/400 · lh 1.64 · mt 36 */}
          <p className="text-kr mt-[36px] text-[22px] font-normal leading-[1.64] text-body">
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
          <ul className="mt-[36px]" style={{ width: LIST_W }}>
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
                  <svg
                    aria-hidden
                    className="question-arrow shrink-0"
                    width="14"
                    height="12"
                    viewBox="0 0 14 12"
                    fill="none"
                  >
                    <path
                      d="M12.5 6H2.2M2.2 6l3.8-3.5M2.2 6l3.8 3.5"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
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
          className="pointer-events-none absolute bottom-0 z-10 w-full"
          style={{ paddingBottom: `${SECTION_BOTTOM + 8}px` }}
        >
          <div
            className="mx-auto w-[1440px]"
            style={{
              paddingLeft: SIDE_L + PHONE_W + COL_GAP,
              paddingRight: SIDE_R,
            }}
          >
            <button
              type="button"
              onClick={previewDesk}
              className="pointer-events-auto rounded-[2px] border border-dashed border-ink/25 px-3 py-2 font-latin text-[11px] tracking-[0.08em] text-ink/55 uppercase transition-colors hover:border-gold hover:text-gold"
            >
              [Dev] Preview booking overlay
            </button>
          </div>
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
