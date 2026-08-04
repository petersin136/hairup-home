"use client";

import { useEffect, useMemo, useState } from "react";

import {
  type DemoBooking,
  formatBookingDate,
  formatWon,
} from "@/lib/demo-chat/booking";

type Props = {
  bookings: DemoBooking[];
  /** 첫 등장 시에만 위에서 아래로 페이드인 */
  animateIn?: boolean;
  onBookingOpened: (id: string) => void;
};

export function DemoAdminDashboard({
  bookings,
  animateIn = false,
  onBookingOpened,
}: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hintId, setHintId] = useState<string | null>(null);
  const [visible, setVisible] = useState(!animateIn);

  const selected = useMemo(
    () => bookings.find((b) => b.id === selectedId) ?? null,
    [bookings, selectedId],
  );

  useEffect(() => {
    const newest = bookings.find((b) => b.isNew);
    if (newest) setHintId(newest.id);
  }, [bookings]);

  useEffect(() => {
    if (!animateIn) {
      setVisible(true);
      return;
    }

    setVisible(false);
    const showT = window.setTimeout(() => setVisible(true), 30);
    const scrollT = window.setTimeout(() => {
      document.getElementById("salon-desk")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 80);

    return () => {
      window.clearTimeout(showT);
      window.clearTimeout(scrollT);
    };
  }, [animateIn]);

  const pendingCount = bookings.length;
  const pendingRevenue = bookings.reduce((sum, b) => sum + b.total, 0);
  const nextBooking = pickNextBooking(bookings);

  const openCard = (id: string) => {
    setSelectedId(id);
    if (hintId === id) setHintId(null);
    onBookingOpened(id);
  };

  return (
    <section
      id="salon-desk"
      className={[
        "desk-reveal w-full bg-mist",
        visible ? "is-visible" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="mx-auto w-full max-w-[1440px] px-[120px] py-20">
        <p className="font-display text-[13px] font-medium tracking-[0.12em] text-gold uppercase">
          Live Admin Preview
        </p>
        <h3 className="mt-3 font-display text-[32px] font-medium tracking-[-0.02em] text-ink">
          Salon Desk
        </h3>
        <p className="text-kr mt-3 max-w-[520px] text-[16px] leading-relaxed text-body">
          방금 확정된 예약이 관리자 화면에 실시간으로 반영됐어요.
        </p>

        <div className="mt-12 grid grid-cols-3 gap-6">
          <Metric
            label="Pending bookings"
            value={`${pendingCount}`}
            suffix="건"
          />
          <Metric
            label="Expected revenue"
            value={formatWon(pendingRevenue)}
          />
          <Metric
            label="Next appointment"
            value={
              nextBooking
                ? `${formatBookingDate(nextBooking.date)} ${nextBooking.time}`
                : "—"
            }
          />
        </div>

        <div className="mt-16">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="font-display text-[12px] font-medium tracking-[0.1em] text-gold uppercase">
                Pending confirmation
              </p>
              <h4 className="text-kr mt-2 text-[22px] font-bold text-ink">
                확정 대기
              </h4>
            </div>
            {hintId ? (
              <p className="text-kr text-[14px] text-gold">
                방금 예약이 잡혔어요, 클릭해서 확인해보세요 👆
              </p>
            ) : null}
          </div>

          <ul className="mt-8 flex flex-col gap-3">
            {bookings.map((booking) => (
              <li key={booking.id}>
                <button
                  type="button"
                  onClick={() => openCard(booking.id)}
                  className={[
                    "text-kr group flex w-full items-center gap-6 rounded-[6px] border border-ink/[0.08] bg-porcelain px-6 py-5 text-left transition-colors hover:border-gold/40",
                    booking.isNew ? "ring-1 ring-gold/50" : "",
                  ].join(" ")}
                >
                  <span className="w-[120px] shrink-0 font-latin text-[14px] tracking-wide text-ink">
                    {formatBookingDate(booking.date)}
                  </span>
                  <span className="w-[64px] shrink-0 font-latin text-[14px] text-ink">
                    {booking.time}
                  </span>
                  <span className="w-[88px] shrink-0 font-medium text-ink">
                    {booking.name}
                  </span>
                  <span className="w-[72px] shrink-0 text-body">
                    {booking.designer}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-body">
                    {booking.services}
                  </span>
                  <span className="shrink-0 font-latin text-[13px] text-gold opacity-0 transition-opacity group-hover:opacity-100">
                    View →
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {selected ? (
        <BookingDetailModal
          booking={selected}
          onClose={() => setSelectedId(null)}
        />
      ) : null}
    </section>
  );
}

function Metric({
  label,
  value,
  suffix,
}: {
  label: string;
  value: string;
  suffix?: string;
}) {
  return (
    <div className="rounded-[6px] border border-ink/[0.08] bg-porcelain px-7 py-6">
      <p className="font-display text-[11px] font-medium tracking-[0.12em] text-stone uppercase">
        {label}
      </p>
      <p className="text-kr mt-3 text-[28px] font-bold tracking-[-0.02em] text-ink">
        {value}
        {suffix ? (
          <span className="ml-1 text-[16px] font-medium text-body">{suffix}</span>
        ) : null}
      </p>
    </div>
  );
}

function BookingDetailModal({
  booking,
  onClose,
}: {
  booking: DemoBooking;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const rows: { label: string; value: string }[] = [
    { label: "날짜", value: formatBookingDate(booking.date) },
    { label: "시간", value: booking.time },
    { label: "디자이너", value: booking.designer },
    { label: "시술", value: booking.services || "—" },
    { label: "고객명", value: booking.name },
    { label: "성별", value: booking.gender === "W" ? "여" : "남" },
    { label: "전화", value: booking.phone || "—" },
    { label: "요청사항", value: booking.request || "—" },
    { label: "총 금액", value: formatWon(booking.total) },
    { label: "예약금 (10%, 최소 1만)", value: formatWon(booking.deposit) },
  ];

  return (
    <div
      className="booking-modal-backdrop fixed inset-0 z-[80] flex items-center justify-center bg-ink/35 px-6"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="booking-modal relative w-full max-w-[480px] rounded-[6px] bg-porcelain p-10 shadow-[0_24px_80px_rgba(28,26,25,0.25)]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal
        aria-labelledby="booking-detail-title"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 flex size-8 items-center justify-center text-[22px] leading-none text-body transition-colors hover:text-ink"
          aria-label="닫기"
        >
          ×
        </button>

        <p className="font-display text-[12px] font-medium tracking-[0.14em] text-gold uppercase">
          Booking Detail
        </p>
        <h4
          id="booking-detail-title"
          className="mt-2 font-display text-[28px] font-medium tracking-[-0.02em] text-ink"
        >
          Reservation
        </h4>

        <dl className="mt-8 flex flex-col gap-4 border-t border-ink/[0.08] pt-6">
          {rows.map((row) => (
            <div
              key={row.label}
              className="text-kr flex items-start justify-between gap-6"
            >
              <dt className="shrink-0 text-[13px] text-stone">{row.label}</dt>
              <dd className="text-right text-[15px] font-medium text-ink">
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

function pickNextBooking(bookings: DemoBooking[]) {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const stamp = `${y}-${m}-${day}${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  const sorted = [...bookings].sort((a, b) =>
    `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`),
  );
  return (
    sorted.find((b) => `${b.date}${b.time}` >= stamp) ?? sorted[0] ?? null
  );
}
