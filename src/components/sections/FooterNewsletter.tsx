"use client";

import { FormEvent, useState } from "react";

import { GlyphLines } from "@/components/copy/GlyphLines";
import { footer } from "@/content/site";
import { GUIDEBOOK_EMAIL_SUBJECT } from "@/lib/guidebook-email";

/**
 * Footer 뉴스레터 — hu_FOOTER PC · hu_cta_banner_footer_m
 * title→desc 26 · desc→input 50 · line→notice 16
 */
type Status = "idle" | "sending" | "success" | "error";

export function FooterNewsletter({
  compact = false,
  mobile = false,
}: {
  compact?: boolean;
  mobile?: boolean;
}) {
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
          subject: GUIDEBOOK_EMAIL_SUBJECT,
          attachGuidebook: true,
        }),
      });

      const payload = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "발송에 실패했습니다.");
      }

      setStatus("success");
      setMessage(footer.newsletter.success);
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

  if (mobile) {
    return (
      <div className="M-FOOTER-NEWS">
        <h2 className="M-FOOTER-NEWS-TITLE">{footer.newsletter.title}</h2>
        <p className="M-FOOTER-NEWS-DESC">
          <GlyphLines lines={footer.newsletter.body} />
        </p>
        <form onSubmit={onSubmit} className="M-FOOTER-NEWS-FORM" noValidate>
          <div className="M-FOOTER-NEWS-INPUT-ROW">
            <label className="sr-only" htmlFor="footer-email-mobile">
              이메일
            </label>
            <input
              id="footer-email-mobile"
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
              className="M-FOOTER-NEWS-INPUT"
            />
            <button
              type="submit"
              disabled={!canSubmit}
              aria-busy={busy}
              className={[
                "M-FOOTER-NEWS-SUBMIT",
                canSubmit ? "is-filled" : "",
                busy ? "is-busy" : "",
              ].join(" ")}
            >
              {busy ? "Sending…" : footer.newsletter.submit}
            </button>
          </div>
          <div className="M-FOOTER-NEWS-LINE" />
          <p
            className={[
              "M-FOOTER-NEWS-NOTICE",
              status === "success"
                ? "is-success"
                : status === "error"
                  ? "is-error"
                  : "",
            ].join(" ")}
            role={
              status === "error"
                ? "alert"
                : status === "success"
                  ? "status"
                  : undefined
            }
            aria-live="polite"
          >
            {message || footer.newsletter.notice.replace(/^\*\s*/, "• ")}
          </p>
        </form>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="w-full">
        <h2 className="font-display text-[22px] font-medium leading-none text-ink">
          {footer.newsletter.title}
        </h2>
        <p className="text-kr mt-[25px] text-[15px] leading-[25px] font-normal text-ink">
          <GlyphLines lines={footer.newsletter.body} />
        </p>
        <form onSubmit={onSubmit} className="mt-[51px]" noValidate>
          <div className="relative mb-[10px] flex h-[18px] items-center">
            <label className="sr-only" htmlFor="footer-email-mobile">
              이메일
            </label>
            <input
              id="footer-email-mobile"
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
              className="min-w-0 flex-1 bg-transparent font-display text-[18px] font-normal leading-none text-ink outline-none placeholder:text-stone/60 disabled:opacity-60"
              style={{ paddingRight: 108 }}
            />
            <button
              type="submit"
              disabled={!canSubmit}
              aria-busy={busy}
              className={[
                "absolute top-1/2 right-0 -translate-y-1/2 font-latin text-[14px] font-normal leading-none transition-all duration-150",
                canSubmit
                  ? "cursor-pointer text-stone hover:text-ink"
                  : "cursor-default text-stone/60",
                busy ? "opacity-70" : "",
              ].join(" ")}
            >
              {busy ? "Sending…" : footer.newsletter.submit}
            </button>
          </div>
          <div className="h-px w-full bg-ink" />
          <p
            className={[
              "text-kr mt-[16px] text-[12px] font-normal leading-none",
              status === "success"
                ? "text-forest"
                : status === "error"
                  ? "text-red-700"
                  : "text-stone",
            ].join(" ")}
            role={
              status === "error"
                ? "alert"
                : status === "success"
                  ? "status"
                  : undefined
            }
            aria-live="polite"
          >
            {message || footer.newsletter.notice}
          </p>
        </form>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="NEED_MORE_DETAILS_">{footer.newsletter.title}</h2>

      <p className="SUB_DESCRIPTION" style={{ marginTop: 26 }}>
        <GlyphLines lines={footer.newsletter.body} />
      </p>

      <form onSubmit={onSubmit} style={{ marginTop: 50 }} noValidate>
        <div
          className="relative flex items-center"
          style={{ height: 26, marginBottom: 16 }}
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
            className="E_MAIL min-w-0 flex-1 bg-transparent outline-none disabled:opacity-60"
            style={{ paddingRight: 120 }}
          />
          <button
            type="submit"
            disabled={!canSubmit}
            aria-busy={busy}
            className={[
              "가이드북_받기 absolute top-1/2 -translate-y-1/2 border-0 bg-transparent p-0",
              filled ? "is-filled" : "",
              busy ? "opacity-70" : "",
            ].join(" ")}
            style={{ right: 0 }}
          >
            {busy ? "보내는 중…" : footer.newsletter.submit}
          </button>
        </div>

        <div className="SHAPE_1" />

        <p
          className={
            status === "success"
              ? "NOTICE_SUCCESS_TEXT"
              : status === "error"
                ? "NOTICE_TEXT text-red-700"
                : "NOTICE_TEXT"
          }
          style={{ marginTop: 16 }}
          role={
            status === "error"
              ? "alert"
              : status === "success"
                ? "status"
                : undefined
          }
          aria-live="polite"
        >
          {message || footer.newsletter.notice}
        </p>
      </form>
    </div>
  );
}
