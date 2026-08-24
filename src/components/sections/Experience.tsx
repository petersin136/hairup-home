"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { DemoAdminDashboard } from "@/components/sections/DemoAdminDashboard";
import { DemoChat, type DemoChatHandle } from "@/components/sections/DemoChat";
import { experience } from "@/content/site";
import {
  type BookingPayload,
  type DemoBooking,
  createSampleBookings,
  toDemoBooking,
} from "@/lib/demo-chat/booking";

/**
 * THE EXPERIENCE — PC
 *
 * 좌우 여백 30 · 카드 간격 24 · padding-top 80 · padding-bottom 0
 * (다음 CRM 구간 padding-top 200 과 합쳐 섹션 간격 200)
 * .DASHBOARD-CARD      880×600 · r 10
 * .DASHBOARD-SUB-CARD  476×600 · r 10
 *
 * 서브카드 카피 (태그는 카드 내부)
 *   tag → title 42 · title → desc 36 · desc → btn 55
 *   title top 132 · left 50
 */
const PAD_X = 30;
/** 상단만 80 — 하단은 CRM padding-top 200 이 구간 간격(총 200) */
const PAD_TOP = 80;
const PAD_BOTTOM = 0;
const GAP = 24;
const CARD = { width: 880, height: 600, radius: 10 } as const;
const SUB = { width: 476, height: 600, radius: 10 } as const;
const COPY = {
  top: 132,
  left: 50,
  gapTagTitle: 42,
  gapTitleDesc: 36,
  gapDescBtn: 55,
} as const;
const TITLE_LEADING = 1.375;
const DESC_LEADING = 1.588;
const BTN = { width: 232, height: 55, radius: 4 } as const;

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
          paddingLeft: PAD_X,
          paddingRight: PAD_X,
          paddingTop: PAD_TOP,
          paddingBottom: PAD_BOTTOM,
          gap: GAP,
        }}
      >
        {/* .DASHBOARD-CARD */}
        <div
          className="relative shrink-0 overflow-hidden bg-[#C6D4DF]"
          style={{
            width: CARD.width,
            height: CARD.height,
            borderRadius: CARD.radius,
          }}
        >
          <DemoChat ref={chatRef} fill onBooking={handleBooking} />
        </div>

        {/* .DASHBOARD-SUB-CARD */}
        <div
          className="relative shrink-0 overflow-hidden"
          style={{
            width: SUB.width,
            height: SUB.height,
            borderRadius: SUB.radius,
          }}
        >
          <Image
            src="/experience/ex-right-pc-bg.png"
            alt=""
            width={476}
            height={600}
            unoptimized
            quality={100}
            sizes="476px"
            className="pointer-events-none absolute inset-0 h-full w-full"
            style={{ objectFit: "fill" }}
            priority
          />

          <div
            className="EXPERIENCE-COPY absolute z-10 flex flex-col items-start"
            style={{ top: COPY.top, left: COPY.left }}
          >
            <p className="SECTION-TAG text-left text-forest">
              {experience.tag.before}
              <em>{experience.tag.article}</em>
              {experience.tag.after}
            </p>

            <h2
              className="EXPERIENCE-TITLE text-kr text-left text-[40px] font-semibold text-ink"
              style={{
                marginTop: COPY.gapTagTitle,
                lineHeight: TITLE_LEADING,
              }}
            >
              {experience.headlinePc[0]}
              <br />
              {experience.headlinePc[1]}
            </h2>

            <p
              className="EXPERIENCE-DESC text-kr text-left text-[17px] font-normal tracking-[-0.01em]"
              style={{
                marginTop: COPY.gapTitleDesc,
                lineHeight: DESC_LEADING,
                color: "rgba(28, 26, 25, 0.8)",
              }}
            >
              {experience.bodyPc[0]}
              <br />
              {experience.bodyPc[1]}
            </p>

            <button
              type="button"
              onClick={() => chatRef.current?.focusInput()}
              className="text-kr inline-flex cursor-pointer items-center justify-center border-0 bg-porcelain text-[16px] leading-none font-medium text-espresso uppercase transition-colors hover:bg-espresso hover:text-porcelain"
              style={{
                marginTop: COPY.gapDescBtn,
                width: BTN.width,
                height: BTN.height,
                borderRadius: BTN.radius,
              }}
            >
              {experience.kakaoDemo.label}
            </button>
          </div>
        </div>
      </div>

      {isDev ? (
        <div className="pointer-events-none absolute bottom-0 z-10 w-full pb-4">
          <div className="mx-auto w-[1440px]" style={{ paddingLeft: PAD_X }}>
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
