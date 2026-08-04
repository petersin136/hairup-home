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

export type DemoBooking = BookingPayload & {
  id: string;
  deposit: number;
  /** 채팅으로 막 들어온 예약 — 지니 애니메이션용 */
  isNew?: boolean;
};

const BOOKING_RE = /\[\[BOOKING\]\]\s*([\s\S]*?)\s*\[\[\/BOOKING\]\]/i;

export function depositFromTotal(total: number) {
  const tenPercent = Math.round((total * 0.1) / 100) * 100;
  return Math.max(10000, tenPercent);
}

export function ymd(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function addDays(d: Date, n: number) {
  const next = new Date(d);
  next.setDate(next.getDate() + n);
  return next;
}

/**
 * 모델이 작년·과거 날짜를 넣어도 오늘 기준으로 보정.
 * 연도만 틀린 경우(같은 월일)는 올해로, 그래도 과거라면 오늘로.
 */
export function normalizeBookingDate(date: string, now = new Date()): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date.trim());
  if (!match) return ymd(now);

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const currentYear = now.getFullYear();
  const today = ymd(now);

  let candidate = `${Math.max(year, currentYear)}-${match[2]}-${match[3]}`;

  // 유효하지 않은 달력 날짜면 오늘
  const parsed = new Date(year, month - 1, day);
  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    return today;
  }

  // 올해로 맞춘 뒤에도 과거면 오늘
  if (candidate < today) {
    const thisYear = `${currentYear}-${match[2]}-${match[3]}`;
    candidate = thisYear >= today ? thisYear : today;
  }

  return candidate;
}

export function normalizeBookingTime(time: string): string {
  const m = /^(\d{1,2}):(\d{2})$/.exec(time.trim());
  if (!m) return "15:00";
  const h = Math.min(23, Math.max(0, Number(m[1])));
  const min = Math.min(59, Math.max(0, Number(m[2])));
  return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
}

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

export function toDemoBooking(
  payload: BookingPayload,
  opts?: { isNew?: boolean; id?: string },
): DemoBooking {
  return {
    ...payload,
    date: normalizeBookingDate(payload.date),
    time: normalizeBookingTime(payload.time),
    id: opts?.id ?? `bk-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    deposit: depositFromTotal(payload.total),
    isNew: opts?.isNew,
  };
}

/** 방문자가 처음 봐도 대시보드 형태가 보이게 넣는 샘플 (오늘·내일 기준) */
export function createSampleBookings(now = new Date()): DemoBooking[] {
  const today = ymd(now);
  const tomorrow = ymd(addDays(now, 1));

  return [
    toDemoBooking(
      {
        date: today,
        time: "14:00",
        designer: "카이",
        services: "여성 컷, 뿌리염색",
        name: "이수연",
        gender: "W",
        phone: "01098765432",
        request: "앞머리만 조금 더 짧게",
        total: 113000,
      },
      { id: "sample-1" },
    ),
    toDemoBooking(
      {
        date: today,
        time: "16:30",
        designer: "카이",
        services: "디지털펌",
        name: "박민준",
        gender: "M",
        phone: "01055556666",
        request: "",
        total: 180000,
      },
      { id: "sample-2" },
    ),
    toDemoBooking(
      {
        date: tomorrow,
        time: "11:00",
        designer: "카이",
        services: "전체염색, 단백질 트리트먼트",
        name: "최유진",
        gender: "W",
        phone: "01022223333",
        request: "밝은 브라운으로",
        total: 190000,
      },
      { id: "sample-3" },
    ),
  ];
}

export function formatWon(n: number) {
  return `${n.toLocaleString("ko-KR")}원`;
}

export function formatBookingDate(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  if (!y || !m || !d) return date;
  return `${y}.${String(m).padStart(2, "0")}.${String(d).padStart(2, "0")}`;
}
