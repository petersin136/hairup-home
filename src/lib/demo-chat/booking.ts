export type BookingGender = "M" | "W";

export type BookingPayload = {
  date: string;
  time: string;
  designer: string;
  services: string;
  name: string;
  gender: BookingGender;
  phone: string;
  request: string;
  total: number;
};

const BOOKING_RE = /\[\[BOOKING\]\]\s*([\s\S]*?)\s*\[\[\/BOOKING\]\]/i;

function ymd(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/**
 * 모델이 작년·과거 날짜를 넣어도 오늘 기준으로 보정.
 * 연도만 틀린 경우(같은 월일)는 올해로, 그래도 과거라면 오늘로.
 */
function normalizeBookingDate(date: string, now = new Date()): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date.trim());
  if (!match) return ymd(now);

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const currentYear = now.getFullYear();
  const today = ymd(now);

  let candidate = `${Math.max(year, currentYear)}-${match[2]}-${match[3]}`;

  const parsed = new Date(year, month - 1, day);
  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    return today;
  }

  if (candidate < today) {
    const thisYear = `${currentYear}-${match[2]}-${match[3]}`;
    candidate = thisYear >= today ? thisYear : today;
  }

  return candidate;
}

function normalizeBookingTime(time: string): string {
  const m = /^(\d{1,2}):(\d{2})$/.exec(time.trim());
  if (!m) return "15:00";
  const h = Math.min(23, Math.max(0, Number(m[1])));
  const min = Math.min(59, Math.max(0, Number(m[2])));
  return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
}

/** 응답에서 숨김 예약 블록을 떼고, 있으면 파싱된 페이로드도 반환 */
export function parseBookingReply(reply: string): {
  text: string;
  booking: BookingPayload | null;
} {
  const match = reply.match(BOOKING_RE);
  if (!match) return { text: reply.trim(), booking: null };

  const text = reply.replace(BOOKING_RE, "").trim();
  try {
    const rawJson = match[1]
      .trim()
      .replace(/,\s*}/, "}")
      .replace(/,\s*]/, "]");
    const raw = JSON.parse(rawJson) as Partial<BookingPayload> & {
      total?: number | string;
    };
    const total =
      typeof raw.total === "number"
        ? raw.total
        : typeof raw.total === "string"
          ? Number(String(raw.total).replace(/[^\d.]/g, ""))
          : NaN;
    if (
      typeof raw.date !== "string" ||
      typeof raw.time !== "string" ||
      !Number.isFinite(total)
    ) {
      return { text, booking: null };
    }

    const gender: BookingGender = raw.gender === "W" ? "W" : "M";
    return {
      text,
      booking: {
        date: normalizeBookingDate(raw.date),
        time: normalizeBookingTime(raw.time),
        designer: raw.designer || "카이",
        services: raw.services || "",
        name: raw.name || "고객",
        gender,
        phone: raw.phone || "",
        request: raw.request || "",
        total,
      },
    };
  } catch {
    return { text, booking: null };
  }
}
