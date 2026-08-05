"use client";

import { FormEvent, useState } from "react";

import { footer } from "@/content/site";

/**
 * 15-D · 18-D 뉴스레터.
 *
 * 입력 줄: 텍스트 → 16 → 밑줄 → 16 → 고지.
 * Send me PDF 는 밑줄 오른쪽 끝에서 70px 안쪽 (레퍼런스 픽셀 실측).
 */
const SEND_INSET = 70;

type Status = "idle" | "sending" | "success" | "error";

export function FooterNewsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const filled = email.trim().length > 0;
  const busy = status === "sending";
  const canSubmit = filled && !busy;

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;

    const to = email.trim();
    setStatus("sending");
    setMessage("가이드북을 보내는 중입니다…");

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to,
          subject: "헤어업 가이드북을 보내드립니다",
          html: `
            <p>안녕하세요, 헤어업입니다.</p>
            <p>요청하신 상세 가이드북 PDF를 첨부해 드립니다.</p>
            <p>확인해 보시고 궁금한 점이 있으시면 언제든 연락 주세요.</p>
            <p style="margin-top:24px;color:#6c6864;font-size:12px;">Hair up · Automated Salon AI</p>
          `,
          attachGuidebook: true,
        }),
      });

      const payload = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "발송에 실패했습니다.");
      }

      setStatus("success");
      setMessage("가이드북을 보내드렸습니다. 메일함을 확인해 주세요.");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "발송에 실패했습니다. 잠시 후 다시 시도해 주세요.",
      );
    }
  };

  return (
    <div className="w-full">
      <h2 className="font-display text-[26px] font-medium leading-none text-ink">
        {footer.newsletter.title}
      </h2>

      <p
        className="text-kr mt-[26px] text-[16px] font-normal text-ink"
        style={{ lineHeight: 1.69 }}
      >
        {footer.newsletter.body.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </p>

      <form onSubmit={onSubmit} className="mt-[50px]" noValidate>
        {/* 텍스트 행 — 밑줄과 16px 띄움 */}
        <div
          className="relative flex h-[26px] items-center"
          style={{ marginBottom: 16 }}
        >
          <label className="sr-only" htmlFor="footer-email">
            이메일
          </label>
          <input
            id="footer-email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status === "success" || status === "error") {
                setStatus("idle");
                setMessage("");
              }
            }}
            placeholder={footer.newsletter.placeholder}
            autoComplete="email"
            disabled={busy}
            className="min-w-0 flex-1 bg-transparent font-display text-[26px] font-normal leading-none text-ink outline-none placeholder:text-stone/60 disabled:opacity-60"
            style={{ paddingRight: SEND_INSET + 110 }}
          />
          <button
            type="submit"
            disabled={!canSubmit}
            aria-busy={busy}
            className={[
              "absolute top-1/2 -translate-y-1/2 font-latin text-[16px] font-normal leading-none transition-all duration-150",
              canSubmit
                ? "cursor-pointer text-stone hover:text-ink active:scale-95 active:text-ink"
                : "cursor-default text-stone/60",
              busy ? "opacity-70" : "",
            ].join(" ")}
            style={{ right: SEND_INSET }}
          >
            {busy ? "Sending…" : footer.newsletter.submit}
          </button>
        </div>

        {/* .SHAPE_1 — 658 전체 밑줄 */}
        <div className="h-px w-full bg-ink" />

        {/* 밑줄 → 고지 16 · 상태 메시지 */}
        <p
          className={[
            "text-kr mt-[16px] text-[12px] font-normal leading-none",
            status === "success"
              ? "text-forest"
              : status === "error"
                ? "text-red-700"
                : "text-stone",
          ].join(" ")}
          role={status === "error" ? "alert" : status === "success" ? "status" : undefined}
          aria-live="polite"
        >
          {message || footer.newsletter.notice}
        </p>
      </form>
    </div>
  );
}
