"use client";

import {
  FormEvent,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import { Wordmark } from "@/components/brand/Wordmark";
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
};

const GREETING =
  "안녕하세요, 헤어업이에요 😊 궁금한 거 편하게 물어보세요";

const FALLBACK =
  "잠시 연결이 불안정해요. 조금 뒤에 다시 말씀해 주세요.";

/** Experience 배치용 — 버튼 돌출 포함 외곽 */
export const IPHONE_MOCKUP = { width: 330, height: 678 } as const;

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
  function DemoChat({ onBooking }, ref) {
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

  const idle = !focused && !input && !pending && !limited;

  return (
    <div
      className="iphone-mockup relative shrink-0"
      style={{
        width: `${IPHONE_MOCKUP.width}px`,
        height: `${IPHONE_MOCKUP.height}px`,
      }}
      aria-label="헤어업 상담 데모"
    >
      <span
        className="iphone-btn iphone-btn-action absolute top-[108px] -left-[2px] h-[26px] w-[3px] rounded-l-[2px]"
        aria-hidden
      />
      <span
        className="iphone-btn absolute top-[162px] -left-[2px] h-[46px] w-[3px] rounded-l-[2px]"
        aria-hidden
      />
      <span
        className="iphone-btn absolute top-[220px] -left-[2px] h-[46px] w-[3px] rounded-l-[2px]"
        aria-hidden
      />
      <span
        className="iphone-btn absolute top-[178px] -right-[2px] h-[76px] w-[3px] rounded-r-[2px]"
        aria-hidden
      />

      <div className="iphone-frame absolute inset-0 rounded-[52px] p-[6px] shadow-[0_40px_80px_rgba(28,26,25,0.2),0_12px_28px_rgba(28,26,25,0.1)]">
        <div className="h-full w-full rounded-[46px] bg-[#0b0b0c] p-[7px]">
          <div className="demo-chat relative flex h-full min-h-0 flex-col overflow-hidden rounded-[39px] bg-[#b2c7d9]">
            <div
              className="pointer-events-none absolute top-[11px] left-1/2 z-30 h-[28px] w-[98px] -translate-x-1/2 rounded-full bg-black shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
              aria-hidden
            />

            <div className="relative z-20 h-[50px] shrink-0">
              <span className="absolute top-[19px] left-6 text-[13px] font-semibold leading-none tracking-tight text-ink tabular-nums">
                9:41
              </span>
              <div
                className="absolute top-[21px] right-6 flex items-center gap-[5px] text-ink"
                aria-hidden
              >
                <SignalIcon />
                <WifiIcon />
                <BatteryIcon />
              </div>
            </div>

            <header className="relative z-10 flex h-[44px] shrink-0 items-center border-b border-black/[0.06] bg-[#a8bfd4]/85 px-2 backdrop-blur-[2px]">
              <button
                type="button"
                tabIndex={-1}
                className="flex size-9 items-center justify-center text-[28px] leading-none text-ink/80"
                aria-hidden
              >
                ‹
              </button>
              <p className="absolute inset-x-10 flex items-center justify-center text-ink">
                <Wordmark width={78} />
              </p>
            </header>

            <div
              ref={listRef}
              className="demo-chat-list min-h-0 flex-1 overflow-y-auto overscroll-contain px-2.5 py-2.5"
            >
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
              className="flex shrink-0 items-center gap-2 bg-[#f5f5f5] px-2.5 py-2.5"
            >
              <span
                className="flex size-8 shrink-0 items-center justify-center text-[22px] leading-none text-ink/40"
                aria-hidden
              >
                +
              </span>
              <div
                className={["demo-chat-input-shell", idle ? "is-idle" : ""].join(
                  " ",
                )}
              >
                {idle ? (
                  <>
                    <span className="demo-chat-caret" aria-hidden />
                    <span className="demo-chat-input-hint text-kr">
                      메시지 입력
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
                  className="demo-chat-input-field text-kr w-full rounded-full border-0 bg-white px-3.5 py-2 text-[14px] leading-snug text-ink shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)] outline-none placeholder:text-ink/35 disabled:opacity-60"
                  autoComplete="off"
                />
              </div>
              <button
                type="submit"
                disabled={pending || limited || !input.trim()}
                className={[
                  "flex size-8 shrink-0 items-center justify-center rounded-full bg-[#fee500] text-ink transition-opacity disabled:opacity-35",
                  idle ? "animate-pulse" : "",
                ].join(" ")}
                aria-label="전송"
              >
                <SendArrow />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
});

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
        "flex items-end",
        mine ? "justify-end" : "justify-start",
        lead ? "mt-2" : "mt-0.5",
      ].join(" ")}
    >
      {!mine ? (
        <div className="mr-1.5 w-9 shrink-0 self-start">
          {showAvatar ? <HairUpAvatar /> : null}
        </div>
      ) : null}

      {mine && time ? (
        <time className="text-kr mr-1 mb-0.5 shrink-0 self-end text-[10px] leading-none text-ink/45">
          {time}
        </time>
      ) : null}

      <p
        className={[
          "demo-chat-bubble text-kr relative max-w-[70%] whitespace-pre-wrap break-words px-2.5 py-[7px] text-[13.5px] leading-[1.4] text-ink",
          mine ? "demo-chat-bubble-mine" : "demo-chat-bubble-kai",
          showAvatar || (mine && lead) ? "demo-chat-bubble-tail" : "",
        ].join(" ")}
      >
        {message.content}
      </p>

      {!mine && time ? (
        <time className="text-kr ml-1 mb-0.5 shrink-0 self-end text-[10px] leading-none text-ink/45">
          {time}
        </time>
      ) : null}
    </div>
  );
}

function HairUpAvatar() {
  return (
    <span
      className="flex size-9 items-center justify-center overflow-hidden rounded-full bg-ink px-1.5 text-porcelain"
      aria-hidden
    >
      <Wordmark width={28} />
    </span>
  );
}

function TypingIndicator() {
  return (
    <div
      className="mt-2 flex items-end justify-start"
      aria-label="헤어업이 입력 중"
    >
      <div className="mr-1.5 w-9 shrink-0 self-start">
        <HairUpAvatar />
      </div>
      <div className="demo-chat-bubble demo-chat-bubble-kai demo-chat-bubble-tail flex items-center gap-[4px] px-3 py-2.5">
        <span className="demo-chat-dot size-[5px] rounded-full bg-ink/45" />
        <span className="demo-chat-dot size-[5px] rounded-full bg-ink/45 [animation-delay:140ms]" />
        <span className="demo-chat-dot size-[5px] rounded-full bg-ink/45 [animation-delay:280ms]" />
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

function WifiIcon() {
  return (
    <svg width="14" height="10" viewBox="0 0 14 10" fill="currentColor">
      <path
        d="M7 8.6a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2Zm0-3.2c1.3 0 2.5.5 3.4 1.3l-1.1 1.1A3.1 3.1 0 0 0 7 7a3.1 3.1 0 0 0-2.3.8L3.6 6.7A4.7 4.7 0 0 1 7 5.4Zm0-3.1c2.2 0 4.2.9 5.7 2.3L11.6 5.7A6.3 6.3 0 0 0 7 3.8a6.3 6.3 0 0 0-4.6 1.9L1.3 4.6A8.4 8.4 0 0 1 7 2.3Z"
        opacity="0.95"
      />
    </svg>
  );
}

function BatteryIcon() {
  return (
    <svg width="24" height="11" viewBox="0 0 24 11" fill="none">
      <rect
        x="0.5"
        y="0.5"
        width="19"
        height="10"
        rx="2.5"
        stroke="currentColor"
        strokeOpacity="0.45"
      />
      <rect x="2" y="2" width="14" height="7" rx="1.2" fill="currentColor" />
      <path
        d="M21 3.5v4a1.6 1.6 0 0 0 0-4Z"
        fill="currentColor"
        opacity="0.45"
      />
    </svg>
  );
}

function SendArrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M7 11.5V2.5M7 2.5 3.5 6M7 2.5 10.5 6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
