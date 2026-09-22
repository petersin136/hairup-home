"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

import { Wordmark } from "@/components/brand/Wordmark";

/**
 * PC 비밀번호 찾기 — hu_admin_detail_08~12_pc
 * 모바일은 이번 범위 밖.
 */
export function AdminFindPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [accountError, setAccountError] = useState<string | null>(null);

  const canSubmit = email.trim().length > 0;
  const isActive = canSubmit && !sent;

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || sent) return;

    /* API 연동 전 UI 데모:
     * 1차 제출 → 미등록 계정 에러(detail_12)
     * 에러 상태 재제출 → 발송 완료(detail_11) */
    if (accountError) {
      setAccountError(null);
      setSent(true);
      return;
    }
    setAccountError(
      "등록되지 않은 계정입니다. 이메일을 다시 확인해 주세요.",
    );
  }

  return (
    <div className="AUTH-WRAPPER">
      <form className="AUTH-CARD" noValidate onSubmit={onSubmit}>
        <Wordmark width={151} className="LOGO" />

        <p className="AUTH-DESC">
          가입 시 등록한 이메일 주소를 입력해 주세요.
          <br />
          비밀번호를 재설정할 수 있는 링크를 보내드립니다.
        </p>

        <input
          className={
            accountError ? "INPUT-FIELD IS-ERROR" : "INPUT-FIELD"
          }
          type="email"
          name="email"
          autoComplete="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (accountError) setAccountError(null);
          }}
          readOnly={sent}
          aria-label="이메일"
          aria-invalid={accountError ? true : undefined}
          aria-describedby={accountError ? "find-password-error" : undefined}
        />

        {accountError ? (
          <div className="INPUT-ERROR" role="alert">
            <InputErrorIcon />
            <p className="INPUT-ERROR-MSG" id="find-password-error">
              {accountError}
            </p>
          </div>
        ) : sent ? (
          <p className="RESET-SENT-MSG">
            입력하신 이메일로 재설정 링크를 전송했습니다.
            <br />
            메일함을 확인하고 24시간 이내에 변경을 완료해 주세요.
          </p>
        ) : null}

        <button
          type="submit"
          className={isActive ? "BTN-SUBMIT IS-ACTIVE" : "BTN-SUBMIT"}
          disabled={!isActive}
        >
          {sent ? "발송 완료" : "인증 메일 발송"}
        </button>

        <Link className="LINK-BACK" href="/admin/login">
          로그인으로 돌아가기
        </Link>
      </form>

      <p className="COPYRIGHT">© hair up. All rights reserved.</p>
    </div>
  );
}

/** hu_admin_detail_12_pc · .INPUT-ERROR-ICON 19×19 */
function InputErrorIcon() {
  return (
    <svg
      className="INPUT-ERROR-ICON"
      width="19"
      height="19"
      viewBox="0 0 19 19"
      aria-hidden
    >
      <circle cx="9.5" cy="9.5" r="9.5" />
      <rect x="8.5" y="4.5" width="2" height="6.5" rx="1" fill="#fff" />
      <rect x="8.5" y="13" width="2" height="2" rx="1" fill="#fff" />
    </svg>
  );
}
