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

export function FooterNewsletter() {
  const [email, setEmail] = useState("");
  const filled = email.trim().length > 0;

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!filled) return;
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

      <form onSubmit={onSubmit} className="mt-[50px]">
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
            onChange={(e) => setEmail(e.target.value)}
            placeholder={footer.newsletter.placeholder}
            autoComplete="email"
            className="min-w-0 flex-1 bg-transparent font-display text-[26px] font-normal leading-none text-ink outline-none placeholder:text-stone/60"
            style={{ paddingRight: SEND_INSET + 110 }}
          />
          <button
            type="submit"
            disabled={!filled}
            className={[
              "absolute top-1/2 -translate-y-1/2 font-latin text-[16px] font-normal leading-none transition-colors duration-200",
              filled
                ? "text-stone hover:text-ink"
                : "cursor-default text-stone/60",
            ].join(" ")}
            style={{ right: SEND_INSET }}
          >
            {footer.newsletter.submit}
          </button>
        </div>

        {/* .SHAPE_1 — 658 전체 밑줄 */}
        <div className="h-px w-full bg-ink" />

        {/* 밑줄 → 고지 16 */}
        <p className="text-kr mt-[16px] text-[12px] font-normal leading-none text-stone">
          {footer.newsletter.notice}
        </p>
      </form>
    </div>
  );
}
