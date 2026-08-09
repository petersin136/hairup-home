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
};

/** 시안 카카오 채널 인사 */
const GREETING = "안녕하세요. 헤어업입니다. 무엇을 도와드릴까요?";

const FALLBACK =
  "잠시 연결이 불안정해요. 조금 뒤에 다시 말씀해 주세요.";

/**
 * HU_TEST — 디자이너 phon_mockup.png (519×1024) 기준
 * 디스플레이 폭 475 · 화면 구멍 실측 inset
 */
const MOCKUP_SRC = { w: 519, h: 1024 } as const;
/** 화면 구멍 (PNG px) */
const SCREEN_HOLE = { left: 31, top: 31, right: 30, bottom: 35 } as const;

export const IPHONE_MOCKUP = {
  width: 475,
  /** HU_TEST 시안 475×980 — 프레임 PNG는 약간 세로 스트레치 */
  height: 980,
} as const;

/** 모바일: 가로는 동일, 세로는 짧게 + 하단 크롭 */
export const IPHONE_MOCKUP_COMPACT = {
  width: IPHONE_MOCKUP.width,
  height: Math.round(IPHONE_MOCKUP.height * 0.58),
  cropBottom: 24,
} as const;

const DATE_PILL = "2026년 8월 7일 금요일";

const ASSETS = {
  frame: "/experience/phon_mockup_frame.png",
  thumb: "/experience/thumb.png",
  plus: "/experience/icon_plus.png",
  send: "/experience/upload_btn.png",
} as const;

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
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
  function DemoChat({ onBooking, compact = false }, ref) {
    const [messages, setMessages] = useState<ChatMessage[]>([
      { id: "greeting", role: "assistant", content: GREETING, at: 0 },
    ]);
    const [input, setInput] = useState("");
    const [pending, setPending] = useState(false);
    const [limited, setLimited] = useState(false);
    const [focused, setFocused] = useState(false);
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
    const scaleX = IPHONE_MOCKUP.width / MOCKUP_SRC.w;
    const scaleY = mockupHeight / MOCKUP_SRC.h;
    const screenStyle = compact
      ? {
          left: SCREEN_HOLE.left * scaleX,
          top: SCREEN_HOLE.top * scaleY,
          right: SCREEN_HOLE.right * scaleX,
          bottom: 0,
          borderRadius: `${48 * scaleX}px ${48 * scaleX}px 0 0`,
        }
      : {
          left: SCREEN_HOLE.left * scaleX,
          top: SCREEN_HOLE.top * scaleY,
          right: SCREEN_HOLE.right * scaleX,
          bottom: SCREEN_HOLE.bottom * scaleY,
          borderRadius: `${48 * scaleX}px`,
        };

    return (
      <div
        className="iphone-mockup relative shrink-0"
        style={{
          width: `${IPHONE_MOCKUP.width}px`,
          height: `${mockupHeight}px`,
          filter: compact
            ? "drop-shadow(0 16px 32px rgba(28,26,25,0.14))"
            : "drop-shadow(0 28px 56px rgba(28,26,25,0.18)) drop-shadow(0 8px 20px rgba(28,26,25,0.1))",
        }}
        aria-label="헤어업 상담 데모"
      >
        <div
          className="demo-chat absolute z-0 flex min-h-0 flex-col overflow-hidden bg-[#C6D4DF]"
          style={screenStyle}
        >
          <div
            className="pointer-events-none absolute top-[10px] left-1/2 z-30 h-[32px] w-[112px] -translate-x-1/2 rounded-full bg-black"
            aria-hidden
          />

          <div className="relative z-20 h-[52px] shrink-0">
            <span className="absolute top-[16px] left-5 text-[14px] font-semibold leading-none tracking-tight text-ink tabular-nums">
              5:30
            </span>
            <div
              className="absolute top-[15px] right-4 flex items-center gap-[5px] text-ink"
              aria-hidden
            >
              <SignalIcon />
              <span className="font-latin text-[11px] font-semibold leading-none tracking-tight">
                5G
              </span>
              <BatteryIcon />
              <span className="font-latin text-[11px] font-semibold leading-none tabular-nums">
                100
              </span>
            </div>
          </div>

          <header className="relative z-10 flex h-[52px] shrink-0 items-center gap-1.5 border-b border-black/[0.06] bg-[#b7c9d9]/92 px-1.5 backdrop-blur-[2px]">
            <span
              className="flex size-8 shrink-0 items-center justify-center text-[28px] leading-none text-ink/75"
              aria-hidden
            >
              ‹
            </span>
            <span
              className="font-latin w-3 shrink-0 text-center text-[22px] font-light leading-none text-ink/45"
              aria-hidden
            >
              1
            </span>
            <div className="min-w-0 flex-1 -translate-y-px">
              <p className="truncate text-[15px] leading-[1.15] text-[#3D3D3D]">
                <span className="font-latin font-normal tracking-tight">
                  hair up
                </span>
                <span className="text-kr ml-1 font-medium">헤어업</span>
              </p>
              <p className="text-kr mt-0.5 truncate text-[11px] leading-[1.1] text-ink/45">
                @hairup 카카오톡 채널
              </p>
            </div>
            <span
              className="flex size-8 shrink-0 items-center justify-center text-ink/70"
              aria-hidden
            >
              <SearchIcon />
            </span>
            <span
              className="flex size-8 shrink-0 items-center justify-center text-ink/70"
              aria-hidden
            >
              <MenuIcon />
            </span>
          </header>

          <div
            ref={listRef}
            className="demo-chat-list min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-3"
          >
            <div className="mb-4 flex justify-center">
              <span
                className="text-kr inline-block rounded-[19px] px-[18px] py-2 text-[16px] leading-none"
                style={{
                  backgroundColor: "rgba(28, 26, 25, 0.07)",
                  color: "#3D3D3D",
                }}
              >
                {DATE_PILL}
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
            style={{ paddingBottom: compact ? 12 : 52 }}
          >
            <div
              className={[
                "demo-chat-input-shell flex h-[68px] w-full max-w-[402px] items-center gap-3 rounded-[34px] bg-[#3F4042] px-3",
                idle ? "is-idle" : "",
              ].join(" ")}
            >
              <img
                src={ASSETS.plus}
                alt=""
                width={36}
                height={36}
                className="size-9 shrink-0"
                draggable={false}
              />
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
                  <img
                    src={ASSETS.send}
                    alt=""
                    width={36}
                    height={36}
                    className="size-9"
                    draggable={false}
                  />
                </button>
              ) : null}
            </div>
            {!compact ? (
              <span
                className="pointer-events-none absolute bottom-[14px] left-1/2 h-[5px] w-[126px] -translate-x-1/2 rounded-full bg-ink/20"
                aria-hidden
              />
            ) : null}
          </form>
          {compact ? (
            <div className="h-[20px] shrink-0 bg-[#C6D4DF]" aria-hidden />
          ) : null}
        </div>

        <img
          src={ASSETS.frame}
          alt=""
          className="pointer-events-none absolute inset-0 z-20 h-full w-full select-none object-fill"
          draggable={false}
        />
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
  /** 시안 첫 인사 타임스탬프 */
  const time =
    message.id === "greeting" ? "오후 5:14" : formatTime(message.at);

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
      src={ASSETS.thumb}
      alt=""
      width={40}
      height={40}
      className="size-10 rounded-full object-cover"
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
    <svg width="16" height="10" viewBox="0 0 16 10" fill="currentColor">
      <rect x="0" y="7" width="2.5" height="3" rx="0.5" opacity="0.35" />
      <rect x="4" y="5" width="2.5" height="5" rx="0.5" opacity="0.55" />
      <rect x="8" y="2.5" width="2.5" height="7.5" rx="0.5" opacity="0.75" />
      <rect x="12" y="0" width="2.5" height="10" rx="0.5" />
    </svg>
  );
}

function BatteryIcon() {
  return (
    <svg width="22" height="11" viewBox="0 0 24 11" fill="none">
      <rect
        x="0.5"
        y="0.5"
        width="19"
        height="10"
        rx="2.5"
        stroke="currentColor"
        strokeOpacity="0.45"
      />
      <rect x="2" y="2" width="16" height="7" rx="1.2" fill="currentColor" />
      <path
        d="M21 3.5v4a1.6 1.6 0 0 0 0-4Z"
        fill="currentColor"
        opacity="0.45"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="5.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12.2 12.2 15 15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="18" height="14" viewBox="0 0 18 14" fill="currentColor" aria-hidden>
      <rect x="0" y="0" width="18" height="1.6" rx="0.8" />
      <rect x="0" y="6" width="18" height="1.6" rx="0.8" />
      <rect x="0" y="12" width="18" height="1.6" rx="0.8" />
    </svg>
  );
}
