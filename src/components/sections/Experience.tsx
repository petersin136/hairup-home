"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { RainInLines } from "@/components/motion/RainInLines";
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
 * 03_The Experience — 채팅 데모 + 실시간 관리자 대시보드
 * 텍스트 좌표는 시안 05-D 유지. 예약 상태는 이 부모에서만 보관(새로고침 시 초기화).
 */
const GUTTER = 120;
const PANEL = { left: GUTTER, top: 148, width: 600, height: 768 };
const TOP_HEIGHT = PANEL.top + PANEL.height + PANEL.top;

const TEXT_LEFT = PANEL.left + PANEL.width + GUTTER;

const TITLE = { top: 159, size: 25 };
const SECTION_TITLE = {
  top: TITLE.top + TITLE.size + 45,
  size: 70,
  leading: 1.37,
  lines: 3,
};
const SECTION_DESC = {
  top:
    SECTION_TITLE.top +
    SECTION_TITLE.size * SECTION_TITLE.leading * SECTION_TITLE.lines +
    65,
  size: 22,
  leading: 1.64,
  lines: experience.body.length,
};

const DESC_BOTTOM =
  SECTION_DESC.top +
  SECTION_DESC.size * SECTION_DESC.leading * SECTION_DESC.lines;

const EXAMPLES_TOP = DESC_BOTTOM + 48;

const PHONE_LEFT = GUTTER;
const PHONE_TOP = PANEL.top + (PANEL.height - IPHONE_MOCKUP.height) / 2 + 36;

export function Experience() {
  const chatRef = useRef<DemoChatHandle>(null);
  const deskOpenRef = useRef(false);
  const deskDelayRef = useRef<number | null>(null);
  /** 예약 확정 전에는 대시보드를 아예 숨김 */
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

    /* 이미 열려 있으면 리스트만 갱신 */
    if (deskOpenRef.current || deskDelayRef.current !== null) return;

    /* 확정 멘트 후 1.5초 뒤 검정 필터 등장 */
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

  /** 개발용 — 채팅 없이 검정 필터·예약 현황 바로 확인 */
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
    <section id="ai-manager" className="relative w-full overflow-x-clip bg-porcelain">
      <div
        className="relative mx-auto w-[1440px]"
        style={{ height: `${TOP_HEIGHT}px` }}
      >
        <div
          className="absolute"
          style={{
            left: `${PHONE_LEFT}px`,
            top: `${PHONE_TOP}px`,
          }}
        >
          <DemoChat ref={chatRef} onBooking={handleBooking} />
        </div>

        <p
          className="absolute inline-flex items-start font-display text-[25px] font-medium uppercase leading-none text-forest"
          style={{ left: `${TEXT_LEFT}px`, top: `${TITLE.top}px` }}
        >
          <span className="mr-[6px] font-latin text-[14px] font-medium tracking-normal">
            {experience.eyebrow.index}
          </span>
          {experience.eyebrow.label}
        </p>

        <h2
          className="text-kr absolute text-left text-[70px] font-bold tracking-[-0.01em] text-ink"
          style={{
            left: `${TEXT_LEFT}px`,
            top: `${SECTION_TITLE.top}px`,
            lineHeight: SECTION_TITLE.leading,
          }}
        >
          {experience.headline.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>

        <RainInLines
          lines={experience.body}
          className="text-kr absolute text-left text-[22px] font-normal tracking-[-0.01em] text-body"
          style={{
            left: `${TEXT_LEFT}px`,
            top: `${SECTION_DESC.top}px`,
            lineHeight: SECTION_DESC.leading,
          }}
        />

        <div
          className="absolute flex w-[440px] flex-col gap-3"
          style={{ left: `${TEXT_LEFT}px`, top: `${EXAMPLES_TOP}px` }}
        >
          <p className="font-display text-[13px] font-medium tracking-[0.08em] text-forest uppercase">
            Try asking
          </p>
          <ul className="flex flex-col gap-2.5">
            {experience.examples.map((q) => (
              <li key={q}>
                <button
                  type="button"
                  onClick={() => chatRef.current?.ask(q)}
                  className="text-kr group text-left text-[16px] font-normal tracking-[-0.01em] text-body transition-colors hover:text-ink"
                >
                  <span className="mr-2 text-forest/50">—</span>
                  <span className="border-b border-transparent transition-[border-color] group-hover:border-ink/25">
                    {q}
                  </span>
                </button>
              </li>
            ))}
          </ul>
          {isDev ? (
            <button
              type="button"
              onClick={previewDesk}
              className="mt-4 self-start rounded-[2px] border border-dashed border-ink/25 px-3 py-2 font-latin text-[11px] tracking-[0.08em] text-ink/55 uppercase transition-colors hover:border-gold hover:text-gold"
            >
              [Dev] Preview booking overlay
            </button>
          ) : null}
        </div>
      </div>

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
