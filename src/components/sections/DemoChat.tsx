"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type Role = "assistant" | "user";

type ChatMessage = {
  id: string;
  role: Role;
  content: string;
  at: number;
};

const GREETING =
  "안녕하세요, 헤어업 카이예요 😊 궁금한 거 편하게 물어보세요";

const FALLBACK =
  "잠시 연결이 불안정해요. 조금 뒤에 다시 말씀해 주세요.";

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

export function DemoChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "greeting", role: "assistant", content: GREETING, at: 0 },
  ]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [limited, setLimited] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLInputElement>(null);

  /* 인사 시각은 마운트 후에만 채워 hydration mismatch 를 피합니다. */
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

  /* 페이지 전체가 아니라 채팅 리스트 안에서만 맨 아래로 이동합니다. */
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    list.scrollTop = list.scrollHeight;
  }, [messages, pending]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void send();
  };

  const send = async () => {
    const text = input.trim();
    if (!text || pending || limited) return;

    const next: ChatMessage[] = [
      ...messages,
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

      if (res.status === 429 || data.limited) {
        setLimited(true);
      }

      const reply =
        data.reply?.trim() ||
        (res.ok ? FALLBACK : data.error?.trim() || FALLBACK);

      setMessages((prev) => [
        ...prev,
        { id: uid(), role: "assistant", content: reply, at: Date.now() },
      ]);
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

  return (
    <div
      className="iphone-mockup relative h-[620px] w-[302px] shrink-0 rounded-[55px] border-[12px] border-[#1a1a1a] bg-[#1a1a1a] shadow-[0_32px_64px_rgba(28,26,25,0.22),0_8px_20px_rgba(28,26,25,0.12)]"
      aria-label="헤어업 카이 상담 데모"
    >
      {/* 화면 */}
      <div className="demo-chat relative flex h-full min-h-0 flex-col overflow-hidden rounded-[43px] bg-[#b2c7d9]">
        {/* Dynamic Island */}
        <div
          className="pointer-events-none absolute top-[10px] left-1/2 z-30 h-[27px] w-[96px] -translate-x-1/2 rounded-full bg-black"
          aria-hidden
        />

        {/* iOS 상태바 */}
        <div className="relative z-20 flex h-[46px] shrink-0 items-end justify-between px-5 pb-[7px] text-[12px] font-semibold tracking-tight text-ink">
          <span className="tabular-nums">9:41</span>
          <div className="flex items-center gap-[5px]" aria-hidden>
            <SignalIcon />
            <WifiIcon />
            <BatteryIcon />
          </div>
        </div>

        {/* 카카오톡 헤더 */}
        <header className="relative z-10 flex h-[44px] shrink-0 items-center border-b border-black/[0.06] bg-[#a8bfd4]/85 px-2 backdrop-blur-[2px]">
          <button
            type="button"
            tabIndex={-1}
            className="flex size-9 items-center justify-center text-[28px] leading-none text-ink/80"
            aria-hidden
          >
            ‹
          </button>
          <p className="text-kr absolute inset-x-10 truncate text-center text-[16px] font-semibold text-ink">
            카이 · 헤어업
          </p>
        </header>

        {/* 대화 */}
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

        {/* 입력창 */}
        <form
          onSubmit={onSubmit}
          className="flex shrink-0 items-center gap-2 bg-[#f5f5f5] px-2.5 py-2"
        >
          <span
            className="flex size-8 shrink-0 items-center justify-center text-[22px] leading-none text-ink/40"
            aria-hidden
          >
            +
          </span>
          <input
            ref={field}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={pending || limited}
            maxLength={500}
            placeholder={limited ? "오늘 체험이 끝났어요" : "메시지 입력"}
            className="text-kr min-w-0 flex-1 rounded-full border-0 bg-white px-3.5 py-2 text-[14px] leading-snug text-ink shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)] outline-none placeholder:text-ink/35 disabled:opacity-60"
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={pending || limited || !input.trim()}
            className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#fee500] text-ink transition-opacity disabled:opacity-35"
            aria-label="전송"
          >
            <SendArrow />
          </button>
        </form>
      </div>
    </div>
  );
}

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
        <div className="mr-1.5 w-8 shrink-0 self-start">
          {showAvatar ? (
            <span
              className="flex size-8 items-center justify-center rounded-full bg-ink font-display text-[11px] font-medium text-porcelain"
              aria-hidden
            >
              K
            </span>
          ) : null}
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

function TypingIndicator() {
  return (
    <div
      className="mt-2 flex items-end justify-start"
      aria-label="카이가 입력 중"
    >
      <div className="mr-1.5 w-8 shrink-0 self-start">
        <span
          className="flex size-8 items-center justify-center rounded-full bg-ink font-display text-[11px] font-medium text-porcelain"
          aria-hidden
        >
          K
        </span>
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
