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
 * THE EXPERIENCE — PC 시안
 *
 * 좌우 여백 30 · 카드 간격 24 · 세로 패딩 80
 * .DASHBOARD-CARD      880×600 · r 10 · AI 채팅 모션
 * .DASHBOARD-SUB-CARD  476×600 · r 10 · 원본 그레인 BG
 *
 * .EXPERIENCE-TAG    Playfair 13/500 · #2C3A2E · tracking 0.025em
 * .EXPERIENCE-TITLE  Noto 40/600 · lh 1.375 · #1C1A19
 * .EXPERIENCE-DESC   Noto 17/400 · lh 1.588 · tracking -0.01em · rgba(28,26,25,0.8)
 * 서브카드 좌표는 시안 시각 아웃라인 (tag→title 42 · title→desc 36 · desc→btn 55)
 *
 * .BTN-KAKAO-DEMO  232×55 · r 4 · #FAF8F5 / #352923 · hover 반전
 */
const PAD_X = 30;
const PAD_Y = 80;
const GAP = 24;
const CARD = { width: 880, height: 600, radius: 10 } as const;
const SUB = { width: 476, height: 600, radius: 10 } as const;
const PAD_LEFT = 50;
const TAG_TOP = 132;
const TITLE_TOP = 183;
const TITLE_LEADING = 1.375;
const DESC_TOP = 313;
const DESC_LEADING = 1.588;
const BTN_TOP = 414;

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
          paddingTop: PAD_Y,
          paddingBottom: PAD_Y,
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

          {/* .EXPERIENCE-TAG */}
          <p
            className="absolute z-10 font-display text-left text-[13px] font-medium leading-none tracking-[0.025em] text-forest"
            style={{ top: TAG_TOP, left: PAD_LEFT }}
          >
            {experience.tag}
          </p>

          {/* .EXPERIENCE-TITLE */}
          <h2
            className="text-kr absolute z-10 text-left text-[40px] font-semibold whitespace-nowrap text-ink"
            style={{
              top: TITLE_TOP,
              left: PAD_LEFT,
              lineHeight: TITLE_LEADING,
            }}
          >
            {experience.headlinePc.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>

          {/* .EXPERIENCE-DESC */}
          <p
            className="text-kr absolute z-10 text-left text-[17px] font-normal tracking-[-0.01em] whitespace-nowrap"
            style={{
              top: DESC_TOP,
              left: PAD_LEFT,
              lineHeight: DESC_LEADING,
              color: "rgba(28, 26, 25, 0.8)",
            }}
          >
            {experience.bodyPc.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>

          {/* .BTN-KAKAO-DEMO */}
          <a
            href={experience.kakaoDemo.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-kr absolute z-10 inline-flex cursor-pointer items-center justify-center bg-porcelain text-[16px] leading-none font-medium text-espresso no-underline uppercase transition-colors hover:bg-espresso hover:text-porcelain"
            style={{
              top: BTN_TOP,
              left: PAD_LEFT,
              width: 232,
              height: 55,
              borderRadius: 4,
            }}
          >
            {experience.kakaoDemo.label}
          </a>
        </div>
      </div>

      {isDev ? (
        <div className="pointer-events-none absolute bottom-0 z-10 w-full pb-4">
          <div
            className="mx-auto w-[1440px]"
            style={{ paddingLeft: PAD_X }}
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
