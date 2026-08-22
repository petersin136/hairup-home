"use client";

import { FormEvent, useState } from "react";

import { footer } from "@/content/site";
import { GUIDEBOOK_EMAIL_SUBJECT } from "@/lib/guidebook-email";

/**
 * 15-D · 18-D 뉴스레터.
 *
 * 입력 줄: 텍스트 → 16 → 밑줄 → 16 → 고지.
 * Send me PDF 는 밑줄 오른쪽 끝에서 70px 안쪽 (레퍼런스 픽셀 실측).
 */
const SEND_INSET = 70;

type Status = "idle" | "sending" | "success" | "error";

export function FooterNewsletter({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const filled = email.trim().length > 0;
  const busy = status === "sending";
  const canSubmit = filled && !busy;
  const sendInset = compact ? 0 : SEND_INSET;

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
          subject: GUIDEBOOK_EMAIL_SUBJECT,
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
      <h2
        className={[
          "font-display font-medium leading-none text-ink",
          compact ? "text-[22px]" : "text-[26px]",
        ].join(" ")}
      >
        {footer.newsletter.title}
      </h2>

      <p
        className={[
          "text-kr font-normal text-ink",
          compact
            ? "mt-[25px] text-[15px] leading-[25px]"
            : "mt-[26px] text-[16px]",
        ].join(" ")}
        style={compact ? undefined : { lineHeight: 1.69 }}
      >
        {footer.newsletter.body.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </p>

      <form
        onSubmit={onSubmit}
        className={compact ? "mt-[51px]" : "mt-[50px]"}
        noValidate
      >
        <div
          className={[
            "relative flex items-center",
            compact ? "h-[18px]" : "h-[26px]",
          ].join(" ")}
          style={{ marginBottom: compact ? 10 : 16 }}
        >
          <label
            className="sr-only"
            htmlFor={compact ? "footer-email-mobile" : "footer-email"}
          >
            이메일
          </label>
          <input
            id={compact ? "footer-email-mobile" : "footer-email"}
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
            className={[
              "min-w-0 flex-1 bg-transparent font-display font-normal leading-none text-ink outline-none placeholder:text-stone/60 disabled:opacity-60",
              compact ? "text-[18px]" : "text-[26px]",
            ].join(" ")}
            style={{ paddingRight: sendInset + (compact ? 108 : 110) }}
          />
          <button
            type="submit"
            disabled={!canSubmit}
            aria-busy={busy}
            className={[
              "absolute top-1/2 -translate-y-1/2 font-latin font-normal leading-none transition-all duration-150",
              compact ? "text-[14px]" : "text-[16px]",
              canSubmit
                ? "cursor-pointer text-stone hover:text-ink active:scale-95 active:text-ink"
                : "cursor-default text-stone/60",
              busy ? "opacity-70" : "",
            ].join(" ")}
            style={{ right: sendInset }}
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
