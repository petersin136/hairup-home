"use client";

import {
  FormEvent,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import {
  type BookingPayload,
  parseBookingReply,
} from "@/lib/demo-chat/booking";

type Role = "assistant" | "user";

type ChatMessage = {
  id: string;
  role: Role;
  content: string;
  at: number;
};

export type DemoChatHandle = {
  ask: (text: string) => void;
};

type DemoChatProps = {
  onBooking?: (payload: BookingPayload) => void;
  /** 가로는 유지하고 세로만 약 절반 — 입력창은 화면 안에 유지 */
  compact?: boolean;
  /** 폰 프레임 없이 부모를 채움 — PC 대시보드 카드 */
  fill?: boolean;
};

/** 시안 카카오 채널 인사 */
const GREETING = "안녕하세요. 헤어업입니다.\n무엇을 도와드릴까요?";

const FALLBACK =
  "잠시 연결이 불안정해요. 조금 뒤에 다시 말씀해 주세요.";

/**
 * HU_TEST DETAIL_04 — PHONE MOCKUP SIZE 475 × 980
 * DETAIL_01 — PHONE-SCREEN-BG 435 × 946 · radius 62 · #C6D4DF
 * 프레임은 CSS(벡터) — PNG 확대·filter drop-shadow 뭉개짐 방지
 */
export const IPHONE_MOCKUP = { width: 475, height: 980 } as const;

/** 모바일: 가로는 동일, 세로는 짧게 + 하단 크롭 */
export const IPHONE_MOCKUP_COMPACT = {
  width: IPHONE_MOCKUP.width,
  height: Math.round(IPHONE_MOCKUP.height * 0.58),
  cropBottom: 24,
} as const;

const FRAME = {
  metal: 3,
  bezel: 10,
  radius: 72,
  screenRadius: 59,
} as const;

/** 찐한 회색 메탈 프레임 */
const METAL =
  "linear-gradient(145deg, #8a8a8a 0%, #6e6e6e 25%, #5a5a5a 50%, #747474 75%, #4e4e4e 100%)";
const METAL_BTN =
  "linear-gradient(180deg, #7a7a7a 0%, #5c5c5c 50%, #484848 100%)";

const WEEKDAYS = [
  "일요일",
  "월요일",
  "화요일",
  "수요일",
  "목요일",
  "금요일",
  "토요일",
] as const;

/** 채널 프로필 — 원형 아님, 카카오 스쿼클 + 제공 thumb */
const THUMB_SRC = "/experience/thumb.png";
/** 전송 버튼 — 노란 원 + 검정 ↑ */
const SEND_SRC = "/experience/upload_btn.png";

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function formatDatePill(d: Date) {
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 ${WEEKDAYS[d.getDay()]}`;
}

function formatStatusTime(d: Date) {
  const h = d.getHours() % 12 || 12;
  const m = d.getMinutes();
  return `${h}:${String(m).padStart(2, "0")}`;
}

function formatTime(at: number) {
  if (!at) return "";
  const d = new Date(at);
  const h = d.getHours();
  const m = d.getMinutes();
  const period = h < 12 ? "오전" : "오후";
  const h12 = h % 12 || 12;
  return `${period} ${h12}:${String(m).padStart(2, "0")}`;
}

export const DemoChat = forwardRef<DemoChatHandle, DemoChatProps>(
  function DemoChat({ onBooking, compact = false, fill = false }, ref) {
    const [messages, setMessages] = useState<ChatMessage[]>([
      { id: "greeting", role: "assistant", content: GREETING, at: 0 },
    ]);
    const [input, setInput] = useState("");
    const [pending, setPending] = useState(false);
    const [limited, setLimited] = useState(false);
    const [focused, setFocused] = useState(false);
    const [now, setNow] = useState<Date | null>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const field = useRef<HTMLInputElement>(null);
    const messagesRef = useRef(messages);
    const pendingRef = useRef(pending);
    const limitedRef = useRef(limited);
    const onBookingRef = useRef(onBooking);

    useEffect(() => {
      messagesRef.current = messages;
      pendingRef.current = pending;
      limitedRef.current = limited;
    }, [messages, pending, limited]);

    useEffect(() => {
      onBookingRef.current = onBooking;
    }, [onBooking]);

    useEffect(() => {
      if (process.env.NODE_ENV === "development") setLimited(false);
    }, []);

    useEffect(() => {
      setNow(new Date());
      const tick = window.setInterval(() => setNow(new Date()), 30_000);
      return () => window.clearInterval(tick);
    }, []);

    useEffect(() => {
      const timer = window.setTimeout(() => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === "greeting" && msg.at === 0
              ? { ...msg, at: Date.now() }
              : msg,
          ),
        );
      }, 0);
      return () => window.clearTimeout(timer);
    }, []);

    useEffect(() => {
      const list = listRef.current;
      if (!list) return;
      list.scrollTop = list.scrollHeight;
    }, [messages, pending]);

    const sendText = async (raw: string) => {
      const text = raw.trim();
      if (!text || pendingRef.current || limitedRef.current) return;

      const next: ChatMessage[] = [
        ...messagesRef.current,
        { id: uid(), role: "user", content: text, at: Date.now() },
      ];
      setMessages(next);
      setInput("");
      setPending(true);

      try {
        const res = await fetch("/api/demo-chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: next
              .filter((m) => m.id !== "greeting")
              .map(({ role, content }) => ({ role, content })),
          }),
        });

        const data = (await res.json()) as {
          reply?: string;
          error?: string;
          limited?: boolean;
        };

        if (
          process.env.NODE_ENV !== "development" &&
          (res.status === 429 || data.limited)
        ) {
          setLimited(true);
        }

        const reply =
          data.reply?.trim() ||
          (res.ok ? FALLBACK : data.error?.trim() || FALLBACK);

        const { text: visible, booking } = parseBookingReply(reply);

        setMessages((prev) => [
          ...prev,
          {
            id: uid(),
            role: "assistant",
            content: visible || FALLBACK,
            at: Date.now(),
          },
        ]);

        if (booking) onBookingRef.current?.(booking);
      } catch {
        setMessages((prev) => [
          ...prev,
          { id: uid(), role: "assistant", content: FALLBACK, at: Date.now() },
        ]);
      } finally {
        setPending(false);
        field.current?.focus({ preventScroll: true });
      }
    };

    useImperativeHandle(ref, () => ({
      ask: (text: string) => {
        void sendText(text);
      },
    }));

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      void sendText(input);
    };

    const hasDraft = Boolean(input.trim());
    const showSend = hasDraft || focused;
    const idle = !focused && !input && !pending && !limited;
    const mockupHeight = compact
      ? IPHONE_MOCKUP_COMPACT.height
      : IPHONE_MOCKUP.height;
    const frameRadius = FRAME.radius;
    const screenR = FRAME.screenRadius;
    const outerRadius = compact
      ? `${frameRadius}px ${frameRadius}px 0 0`
      : `${frameRadius}px`;
    const bezelRadius = compact
      ? `${frameRadius - FRAME.metal}px ${frameRadius - FRAME.metal}px 0 0`
      : `${frameRadius - FRAME.metal}px`;
    const screenRadius = compact
      ? `${screenR}px ${screenR}px 0 0`
      : `${screenR}px`;

    const chatScreen = (
            <div
              className="demo-chat relative flex h-full min-h-0 w-full flex-col overflow-hidden bg-[#C6D4DF]"
              style={{ borderRadius: fill ? undefined : screenRadius }}
            >
              {/* Status + Dynamic Island — 시간·안테나·배터리 레퍼런스 스케일 */}
              {fill ? null : (
              <div className="relative z-20 h-[54px] shrink-0">
                <div
                  className="pointer-events-none absolute top-[12px] left-1/2 z-30 flex h-[36px] w-[128px] -translate-x-1/2 items-center rounded-full bg-black pl-[15px]"
                  aria-hidden
                >
                  <span className="size-[11px] rounded-full bg-[#1a1a1a] ring-1 ring-[#2a2a2a]" />
                </div>
                <span
                  className="absolute top-[27px] left-[42px] text-[21px] font-semibold leading-none tracking-[-0.03em] text-ink tabular-nums"
                  suppressHydrationWarning
                >
                  {now ? formatStatusTime(now) : ""}
                </span>
                <div
                  className="absolute top-[25px] right-[42px] flex items-center gap-[6px] text-ink"
                  aria-hidden
                >
                  <SignalIcon />
                  <span className="font-latin text-[14px] font-semibold leading-none tracking-tight">
                    5G
                  </span>
                  <BatteryIcon />
                </div>
              </div>
              )}

              {/* 채널 헤더 — 타이틀 중앙 · 구분선 없음 */}
              <header className="relative z-10 flex h-[54px] shrink-0 items-center bg-[#C6D4DF] px-0.5">
                <div className="relative z-10 flex shrink-0 items-center">
                  <span
                    className="flex size-10 items-center justify-center text-ink"
                    aria-hidden
                  >
                    <BackChevron />
                  </span>
                  <span
                    className="font-latin text-[17px] font-medium leading-none text-ink"
                    aria-hidden
                  >
                    1
                  </span>
                </div>

                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-[20px] font-semibold leading-[1.15] tracking-[-0.01em] text-ink">
                    <span className="font-latin">hair up</span>
                    <span className="text-kr ml-[3px]">헤어업</span>
                  </p>
                  <p className="text-kr mt-[3px] text-[14px] leading-none text-[#6B6B6B]">
                    @hairup 카카오톡 채널
                  </p>
                </div>

                <div className="relative z-10 ml-auto flex shrink-0 items-center pr-0.5">
                  <span
                    className="flex size-12 items-center justify-center text-ink"
                    aria-hidden
                  >
                    <SearchIcon />
                  </span>
                  <span
                    className="flex size-11 items-center justify-center text-ink"
                    aria-hidden
                  >
                    <MenuIcon />
                  </span>
                </div>
              </header>

              <div
                ref={listRef}
                className="demo-chat-list min-h-0 flex-1 overflow-y-auto overscroll-y-auto px-3 py-3"
              >
                <div className="mb-4 flex justify-center">
                  <span
                    className="text-kr inline-block rounded-[19px] px-[18px] py-2 text-[16px] leading-none"
                    style={{
                      backgroundColor: "rgba(28, 26, 25, 0.07)",
                      color: "#3D3D3D",
                    }}
                  >
                    {now ? formatDatePill(now) : "\u00a0"}
                  </span>
                </div>
                <div className="flex flex-col">
                  {messages.map((message, index) => {
                    const prev = messages[index - 1];
                    const lead = !prev || prev.role !== message.role;
                    const showAvatar = message.role === "assistant" && lead;

                    return (
                      <BubbleRow
                        key={message.id}
                        message={message}
                        lead={lead}
                        showAvatar={showAvatar}
                      />
                    );
                  })}
                  {pending ? <TypingIndicator /> : null}
                </div>
              </div>

              <form
                onSubmit={onSubmit}
                className="relative flex shrink-0 items-center justify-center gap-2 bg-[#C6D4DF] px-[17px] pt-2"
                style={{ paddingBottom: fill ? 20 : compact ? 12 : 52 }}
              >
                <div
                  className={[
                    "demo-chat-input-shell flex h-[68px] w-full items-center gap-3 rounded-[34px] bg-[#3F4042] px-3",
                    fill ? "max-w-[720px]" : "max-w-[402px]",
                    idle ? "is-idle" : "",
                  ].join(" ")}
                >
                  <PlusButton />
                  <div className="relative min-w-0 flex-1">
                    {idle ? (
                      <>
                        <span className="demo-chat-caret demo-chat-caret-light" aria-hidden />
                        <span className="demo-chat-input-hint text-kr">
                          메세지 입력
                        </span>
                      </>
                    ) : null}
                    <input
                      ref={field}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onFocus={() => setFocused(true)}
                      onBlur={() => setFocused(false)}
                      disabled={pending || limited}
                      maxLength={500}
                      placeholder={limited ? "오늘 체험이 끝났어요" : ""}
                      aria-label="메세지 입력"
                      className="demo-chat-input-field text-kr w-full border-0 bg-transparent py-2 pr-1 text-[18px] font-normal leading-snug text-[#EBEBEB] caret-[#007AFF] outline-none placeholder:text-[rgba(235,235,235,0.25)] disabled:opacity-60"
                      autoComplete="off"
                    />
                  </div>
                  {showSend ? (
                    <button
                      type="submit"
                      disabled={pending || limited || !hasDraft}
                      className="shrink-0 transition-opacity disabled:opacity-35"
                      aria-label="전송"
                    >
                      <SendButton />
                    </button>
                  ) : null}
                </div>
                {!fill && !compact ? (
                  <span
                    className="pointer-events-none absolute bottom-[14px] left-1/2 h-[5px] w-[126px] -translate-x-1/2 rounded-full bg-ink/20"
                    aria-hidden
                  />
                ) : null}
              </form>
              {compact && !fill ? (
                <div className="h-[20px] shrink-0 bg-[#C6D4DF]" aria-hidden />
              ) : null}
            </div>
    );

    if (fill) {
      return (
        <div className="h-full min-h-0 w-full" aria-label="헤어업 상담 데모">
          {chatScreen}
        </div>
      );
    }

    return (
      <div
        className="iphone-mockup relative shrink-0"
        style={{
          width: `${IPHONE_MOCKUP.width}px`,
          height: `${mockupHeight}px`,
          /* filter drop-shadow 금지 — 레이어 래스터화로 텍스트·아이콘이 뭉개짐 */
          boxShadow: compact
            ? "0 16px 32px rgba(28,26,25,0.14)"
            : "0 28px 56px rgba(28,26,25,0.18), 0 8px 20px rgba(28,26,25,0.1)",
          borderRadius: outerRadius,
        }}
        aria-label="헤어업 상담 데모"
      >
        <span
          className="pointer-events-none absolute top-[148px] -left-[2.5px] h-[26px] w-[3px] rounded-l-[1px]"
          style={{ background: METAL_BTN }}
          aria-hidden
        />
        <span
          className="pointer-events-none absolute top-[198px] -left-[2.5px] h-[50px] w-[3px] rounded-l-[1px]"
          style={{ background: METAL_BTN }}
          aria-hidden
        />
        {!compact ? (
          <span
            className="pointer-events-none absolute top-[256px] -left-[2.5px] h-[50px] w-[3px] rounded-l-[1px]"
            style={{ background: METAL_BTN }}
            aria-hidden
          />
        ) : null}
        <span
          className="pointer-events-none absolute top-[220px] -right-[2.5px] h-[84px] w-[3px] rounded-r-[1px]"
          style={{ background: METAL_BTN }}
          aria-hidden
        />

        <div
          className="absolute inset-0"
          style={{
            borderRadius: outerRadius,
            padding: compact
              ? `${FRAME.metal}px ${FRAME.metal}px 0`
              : `${FRAME.metal}px`,
            background: METAL,
            boxShadow: compact
              ? "inset 0 1px 0 rgba(255,255,255,0.35)"
              : "inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(0,0,0,0.18)",
          }}
        >
          <div
            className="h-full w-full bg-[#0a0a0a]"
            style={{
              borderRadius: bezelRadius,
              padding: compact
                ? `${FRAME.bezel}px ${FRAME.bezel}px 0`
                : `${FRAME.bezel}px`,
            }}
          >
            {chatScreen}
          </div>
        </div>
      </div>
    );
  },
);

function BubbleRow({
  message,
  lead,
  showAvatar,
}: {
  message: ChatMessage;
  lead: boolean;
  showAvatar: boolean;
}) {
  const mine = message.role === "user";
  const time = formatTime(message.at);

  return (
    <div
      className={[
        "flex",
        mine ? "justify-end" : "justify-start",
        lead ? "mt-3" : "mt-1",
      ].join(" ")}
    >
      {!mine ? (
        <div className="mr-2 w-10 shrink-0 self-start">
          {showAvatar ? <HairUpAvatar /> : null}
        </div>
      ) : null}

      <div
        className={[
          "flex max-w-[72%] flex-col",
          mine ? "items-end" : "items-start",
        ].join(" ")}
      >
        {/* DETAIL_01 · CHAT-SENDER-NAME 14px #3D3D3D mb 4 */}
        {!mine && showAvatar ? (
          <p
            className="text-kr mb-1 text-[14px] font-normal leading-none"
            style={{ color: "#3D3D3D" }}
          >
            헤어업
          </p>
        ) : null}
        <div className={["flex items-end", mine ? "flex-row-reverse" : ""].join(" ")}>
          {/* DETAIL_01 · bubble #1C1A19 · r14 · pad 12 16 · tail 12×12 */}
          <p
            className={[
              "demo-chat-bubble text-kr relative whitespace-pre-wrap break-words px-4 py-3 text-[15px] leading-[1.45]",
              mine
                ? "demo-chat-bubble-mine text-ink"
                : "demo-chat-bubble-kai text-porcelain",
              showAvatar || (mine && lead) ? "demo-chat-bubble-tail" : "",
            ].join(" ")}
          >
            {message.content}
          </p>
          {time ? (
            <time
              className={[
                "text-kr mb-0.5 shrink-0 self-end text-[12px] leading-none",
                mine ? "mr-1.5" : "ml-1.5",
              ].join(" ")}
              style={{ color: "#868686" }}
            >
              {time}
            </time>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function HairUpAvatar() {
  return (
    <img
      src={THUMB_SRC}
      alt=""
      width={40}
      height={40}
      className="demo-chat-thumb size-10 shrink-0 bg-black object-cover"
      draggable={false}
      aria-hidden
    />
  );
}

function TypingIndicator() {
  return (
    <div
      className="mt-3 flex items-end justify-start"
      aria-label="헤어업이 입력 중"
    >
      <div className="mr-2 w-10 shrink-0 self-start">
        <HairUpAvatar />
      </div>
      <div className="flex flex-col items-start">
        <p
          className="text-kr mb-1 text-[14px] font-normal leading-none"
          style={{ color: "#3D3D3D" }}
        >
          헤어업
        </p>
        <div className="demo-chat-bubble demo-chat-bubble-kai demo-chat-bubble-tail flex items-center gap-[4px] px-4 py-3">
          <span className="demo-chat-dot size-[5px] rounded-full bg-porcelain/55" />
          <span className="demo-chat-dot size-[5px] rounded-full bg-porcelain/55 [animation-delay:140ms]" />
          <span className="demo-chat-dot size-[5px] rounded-full bg-porcelain/55 [animation-delay:280ms]" />
        </div>
      </div>
    </div>
  );
}

function SignalIcon() {
  return (
    <svg width="21" height="13" viewBox="0 0 21 13" fill="currentColor">
      <rect x="0" y="9" width="3.2" height="4" rx="0.7" opacity="0.35" />
      <rect x="5.2" y="6.2" width="3.2" height="6.8" rx="0.7" opacity="0.55" />
      <rect x="10.4" y="3.2" width="3.2" height="9.8" rx="0.7" opacity="0.85" />
      <rect x="15.6" y="0" width="3.2" height="13" rx="0.7" />
    </svg>
  );
}

function BatteryIcon() {
  /* ref: 검정 채움 + 흰 100 + 우측 그린 도트 */
  return (
    <svg width="36" height="15" viewBox="0 0 36 15" fill="none" aria-hidden>
      <rect x="0" y="1.5" width="28" height="12" rx="3" fill="#1C1A19" />
      <text
        x="14"
        y="11"
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize="9.5"
        fontWeight="700"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        100
      </text>
      <circle cx="32.5" cy="7.5" r="2.2" fill="#34C759" />
    </svg>
  );
}

function BackChevron() {
  return (
    <svg width="13" height="22" viewBox="0 0 13 22" fill="none" aria-hidden>
      <path
        d="M11 2 2 11l9 9"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
      <circle cx="12.2" cy="12.2" r="7.8" stroke="currentColor" strokeWidth="2.2" />
      <path
        d="M18.2 18.2 25 25"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="24" height="18" viewBox="0 0 24 18" fill="currentColor" aria-hidden>
      <rect x="0" y="0" width="24" height="2.2" rx="1.1" />
      <rect x="0" y="7.9" width="24" height="2.2" rx="1.1" />
      <rect x="0" y="15.8" width="24" height="2.2" rx="1.1" />
    </svg>
  );
}

function PlusButton() {
  return (
    <span
      className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#2c2c2e]"
      aria-hidden
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M8 3.25v9.5M3.25 8h9.5"
          stroke="#F5F5F5"
          strokeWidth="1.7"
          strokeLinecap="square"
        />
      </svg>
    </span>
  );
}

function SendButton() {
  return (
    <img
      src={SEND_SRC}
      alt=""
      width={36}
      height={36}
      className="size-9 shrink-0"
      draggable={false}
      aria-hidden
    />
  );
}

