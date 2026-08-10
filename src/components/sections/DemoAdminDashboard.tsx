"use client";

import { useEffect, useMemo, useState } from "react";

import {
  type DemoBooking,
  formatBookingDate,
  formatWon,
} from "@/lib/demo-chat/booking";

type Props = {
  bookings: DemoBooking[];
  onBookingOpened: (id: string) => void;
  onClose?: () => void;
};

export function DemoAdminDashboard({
  bookings,
  onBookingOpened,
  onClose,
}: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hintId, setHintId] = useState<string | null>(null);
  const [veilOpen, setVeilOpen] = useState(false);

  const selected = useMemo(
    () => bookings.find((b) => b.id === selectedId) ?? null,
    [bookings, selectedId],
  );

  useEffect(() => {
    const newest = bookings.find((b) => b.isNew);
    if (newest) setHintId(newest.id);
  }, [bookings]);

  useEffect(() => {
    const start = window.setTimeout(() => setVeilOpen(true), 20);
    return () => window.clearTimeout(start);
  }, []);

  /* 오버레이가 휠을 가로채지 않도록 — 페이지 스크롤로 전달 */
  useEffect(() => {
    if (!veilOpen) return;
    const el = document.getElementById("salon-desk");
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      window.scrollBy({ top: e.deltaY, left: 0 });
    };

    el.addEventListener("wheel", onWheel, { passive: true });
    return () => el.removeEventListener("wheel", onWheel);
  }, [veilOpen]);

  const pendingCount = bookings.length;
  const pendingRevenue = bookings.reduce((sum, b) => sum + b.total, 0);
  const nextBooking = pickNextBooking(bookings);

  const openCard = (id: string) => {
    setSelectedId(id);
    if (hintId === id) setHintId(null);
    onBookingOpened(id);
  };

  return (
    <div
      id="salon-desk"
      className={["desk-veil", veilOpen ? "is-open" : ""].join(" ")}
      role="region"
      aria-label="예약 현황 미리보기"
    >
      <div className="desk-veil-content mx-auto flex min-h-full w-full max-w-[1440px] flex-col justify-center px-[120px] py-16">
        <div className="flex items-start justify-between gap-8">
          <div className="max-w-[620px]">
            <p className="font-display text-[13px] font-medium tracking-[0.14em] text-gold uppercase">
              Admin Preview
            </p>
            <h3 className="text-kr mt-3 text-[34px] font-bold tracking-[-0.02em] text-white drop-shadow-[0_1px_12px_rgba(0,0,0,0.45)]">
              예약이 이렇게 반영됩니다
            </h3>
            <p className="text-kr mt-3 text-[16px] leading-[1.7] text-white/80 drop-shadow-[0_1px_8px_rgba(0,0,0,0.4)]">
              이렇게 예약을 확정하시면, 고객님의 관리자 페이지에 예약 현황이
              실시간으로 업데이트됩니다.
            </p>
          </div>
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 cursor-pointer rounded-[2px] border border-white/25 px-3 py-2 font-display text-[11px] tracking-[0.1em] text-white/70 uppercase transition-colors hover:border-white/50 hover:text-white"
            >
              Close ×
            </button>
          ) : null}
        </div>

        <div className="mt-10 grid grid-cols-3 gap-4">
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

        <div className="mt-10">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="font-display text-[12px] font-medium tracking-[0.1em] text-gold uppercase">
                Pending confirmation
              </p>
              <h4 className="text-kr mt-2 text-[20px] font-bold text-white drop-shadow-[0_1px_10px_rgba(0,0,0,0.4)]">
                확정 대기
              </h4>
            </div>
            {hintId ? (
              <p className="text-kr text-[14px] text-gold">
                방금 예약이 잡혔어요, 클릭해서 확인해보세요 👆
              </p>
            ) : null}
          </div>

          <ul className="mt-6 flex flex-col gap-2.5">
            {bookings.map((booking) => (
              <li key={booking.id}>
                <button
                  type="button"
                  onClick={() => openCard(booking.id)}
                  className={[
                    "booking-card text-kr group flex w-full cursor-pointer items-center gap-6 rounded-[6px] border border-white/35 bg-white/75 px-5 py-4 text-left backdrop-blur-[6px] transition-[transform,background-color,border-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-gold/55 hover:bg-white/95 hover:shadow-[0_10px_28px_rgba(0,0,0,0.28)]",
                    booking.isNew ? "border-gold/55 ring-1 ring-gold/45" : "",
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
                  <span className="shrink-0 font-latin text-[13px] text-gold opacity-60 transition-opacity group-hover:opacity-100">
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
    </div>
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
    <div className="rounded-[6px] border border-white/40 bg-white/75 px-6 py-5 shadow-[0_12px_40px_rgba(0,0,0,0.22)] backdrop-blur-[6px]">
      <p className="font-display text-[11px] font-medium tracking-[0.12em] text-stone uppercase">
        {label}
      </p>
      <p className="text-kr mt-2.5 text-[24px] font-bold tracking-[-0.02em] text-ink">
        {value}
        {suffix ? (
          <span className="ml-1 text-[14px] font-medium text-body">{suffix}</span>
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
      className="booking-modal-backdrop fixed inset-0 z-[80] flex items-center justify-center bg-black/50 px-6"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="booking-modal relative w-full max-w-[480px] rounded-[6px] bg-porcelain p-10 shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
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
