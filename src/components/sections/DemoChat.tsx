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
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === "greeting" && msg.at === 0
          ? { ...msg, at: Date.now() }
          : msg,
      ),
    );
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
    <div className="demo-chat flex h-full min-h-0 flex-col overflow-hidden rounded-[inherit] bg-[#b2c7d9]">
      <header className="flex shrink-0 items-center gap-3 border-b border-black/[0.06] bg-[#a8bfd4]/90 px-5 py-3.5 backdrop-blur-[2px]">
        <span
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-ink font-display text-[13px] font-medium text-porcelain"
          aria-hidden
        >
          K
        </span>
        <div className="min-w-0 leading-tight">
          <p className="font-display text-[15px] font-medium tracking-[0.02em] text-ink">
            Kai
          </p>
          <p className="mt-0.5 font-latin text-[10px] font-medium tracking-[0.1em] text-ink/55 uppercase">
            hair up · demo
          </p>
        </div>
      </header>

      <div
        ref={listRef}
        className="demo-chat-list min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-4"
      >
        <div className="flex flex-col">
          {messages.map((message, index) => {
            const prev = messages[index - 1];
            const lead =
              !prev || prev.role !== message.role;
            const showAvatar =
              message.role === "assistant" && lead;

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
        className="shrink-0 border-t border-black/[0.06] bg-[#a8bfd4]/90 px-3 py-3 backdrop-blur-[2px]"
      >
        <div className="flex items-center gap-2 rounded-[18px] bg-white/92 px-3.5 py-2 shadow-[inset_0_0_0_1px_rgba(28,26,25,0.05)]">
          <input
            ref={field}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={pending || limited}
            maxLength={500}
            placeholder={
              limited
                ? "오늘 체험이 끝났어요"
                : "스타일, 가격, 예약… 무엇이든 물어보세요"
            }
            className="text-kr min-w-0 flex-1 bg-transparent text-[14px] leading-snug text-ink outline-none placeholder:text-ink/35 disabled:opacity-60"
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={pending || limited || !input.trim()}
            className="rounded-btn shrink-0 bg-ink px-3 py-1.5 font-latin text-[11px] font-medium tracking-[0.12em] text-porcelain uppercase transition-opacity disabled:opacity-35"
          >
            Send
          </button>
        </div>
      </form>
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
        lead ? "mt-2.5" : "mt-1",
      ].join(" ")}
    >
      {!mine ? (
        <div className="mr-2 w-8 shrink-0 self-start">
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
        <time className="text-kr mr-1.5 mb-0.5 shrink-0 text-[10px] leading-none text-ink/45">
          {time}
        </time>
      ) : null}

      <p
        className={[
          "demo-chat-bubble text-kr relative max-w-[72%] whitespace-pre-wrap break-words px-3.5 py-[9px] text-[14px] leading-[1.45] text-ink",
          mine ? "demo-chat-bubble-mine" : "demo-chat-bubble-kai",
          showAvatar || (mine && lead) ? "demo-chat-bubble-tail" : "",
        ].join(" ")}
      >
        {message.content}
      </p>

      {!mine && time ? (
        <time className="text-kr ml-1.5 mb-0.5 shrink-0 text-[10px] leading-none text-ink/45">
          {time}
        </time>
      ) : null}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div
      className="mt-2.5 flex items-end justify-start"
      aria-label="카이가 입력 중"
    >
      <div className="mr-2 w-8 shrink-0 self-start">
        <span
          className="flex size-8 items-center justify-center rounded-full bg-ink font-display text-[11px] font-medium text-porcelain"
          aria-hidden
        >
          K
        </span>
      </div>
      <div className="demo-chat-bubble demo-chat-bubble-kai demo-chat-bubble-tail flex items-center gap-[5px] px-3.5 py-3">
        <span className="demo-chat-dot size-[5px] rounded-full bg-ink/45" />
        <span className="demo-chat-dot size-[5px] rounded-full bg-ink/45 [animation-delay:140ms]" />
        <span className="demo-chat-dot size-[5px] rounded-full bg-ink/45 [animation-delay:280ms]" />
      </div>
    </div>
  );
}
