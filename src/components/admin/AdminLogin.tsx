"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

import { Wordmark } from "@/components/brand/Wordmark";

/**
 * PC 관리자 로그인 — hu_admin_detail 간격 + detail_02~07_pc CSS
 * 모바일은 이번 범위 밖.
 */
export function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keep, setKeep] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  function validateEmail(value: string): string | null {
    const trimmed = value.trim();
    if (!trimmed) return null;
    /* 시안 카피: 올바른 이메일 형식 */
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
    return ok ? null : "올바른 이메일 형식을 입력해 주세요.";
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formatError = validateEmail(email);
    if (formatError) {
      setEmailError(formatError);
      setLoginError(null);
      return;
    }
    setEmailError(null);
    /* API 연동 전 — 형식 OK 시 로그인 실패 안내(detail_07) UI 표시 */
    setLoginError("이메일 또는 비밀번호를 확인해주세요.");
  }

  function clearLoginError() {
    if (loginError) setLoginError(null);
  }

  return (
    <div className="ADMIN-LOGIN-WRAPPER">
      <form className="ADMIN-LOGIN-CARD" noValidate onSubmit={onSubmit}>
        <Wordmark width={151} className="ADMIN-LOGIN-LOGO-SVG" />

        <p className="ADMIN-LOGIN-DESC">
          헤어업 파트너를 위한 관리자 공간입니다.
          <br />
          발급받은 계정으로 로그인해 주세요.
        </p>

        <div className="ADMIN-LOGIN-FIELDS">
          <div className="ADMIN-LOGIN-FIELD">
            <div className="ADMIN-LOGIN-INPUT-ROW">
              <input
                className={
                  emailError ? "INPUT-FIELD IS-ERROR" : "INPUT-FIELD"
                }
                type="email"
                name="email"
                autoComplete="email"
                placeholder="이메일"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError(null);
                  clearLoginError();
                }}
                aria-label="이메일"
                aria-invalid={emailError ? true : undefined}
                aria-describedby={emailError ? "email-error" : undefined}
              />
              {emailError ? <InputErrorIcon /> : null}
            </div>
            {emailError ? (
              <p className="INPUT-ERROR-MSG" id="email-error" role="alert">
                {emailError}
              </p>
            ) : null}
          </div>

          <div className="ADMIN-LOGIN-FIELD">
            <div className="ADMIN-LOGIN-INPUT-ROW">
              <input
                className="INPUT-FIELD"
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="current-password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearLoginError();
                }}
                aria-label="비밀번호"
              />
              <button
                type="button"
                className="INPUT-PASSWORD-TOGGLE"
                aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                aria-pressed={showPassword}
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? <PasswordEyeOffIcon /> : <PasswordEyeIcon />}
              </button>
            </div>
          </div>
        </div>

        {loginError ? (
          <div className="LOGIN-ERROR" role="alert">
            <LoginErrorIcon />
            <p className="LOGIN-ERROR-MSG">{loginError}</p>
          </div>
        ) : null}

        <label className="KEEP-LOGIN-LABEL">
          <input
            className="CHECKBOX-CUSTOM"
            type="checkbox"
            checked={keep}
            onChange={(e) => setKeep(e.target.checked)}
          />
          로그인 유지
        </label>

        <button type="submit" className="BTN-ADMIN-LOGIN">
          로그인
        </button>

        <div className="ADMIN-LOGIN-LINKS">
          <Link className="ADMIN-LOGIN-LINK" href="/admin/find-password">
            비밀번호 찾기
          </Link>
          <Link className="ADMIN-LOGIN-LINK" href="/">
            웹사이트 바로가기
          </Link>
        </div>
      </form>

      <p className="ADMIN-FOOTER-COPYRIGHT">© hair up. All rights reserved.</p>
    </div>
  );
}

/** hu_admin_detail_04_pc · .INPUT-ERROR-ICON 20×20 */
function InputErrorIcon() {
  return (
    <svg
      className="INPUT-ERROR-ICON"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      aria-hidden
    >
      <circle cx="10" cy="10" r="10" />
      <rect x="9" y="5" width="2" height="7" rx="1" fill="#fff" />
      <rect x="9" y="14" width="2" height="2" rx="1" fill="#fff" />
    </svg>
  );
}

/** hu_admin_detail_07_pc · .LOGIN-ERROR-ICON 19×19 */
function LoginErrorIcon() {
  return (
    <svg
      className="LOGIN-ERROR-ICON"
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

/** hu_admin_detail_05_pc · .INPUT-PASSWORD-ICON width 18 · fill #8E8E8E */
function PasswordEyeIcon() {
  return (
    <svg
      className="INPUT-PASSWORD-ICON"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      aria-hidden
    >
      <path d="M9 3.5C5.2 3.5 2.05 5.85.75 9c1.3 3.15 4.45 5.5 8.25 5.5s6.95-2.35 8.25-5.5C15.95 5.85 12.8 3.5 9 3.5Zm0 9.1A3.6 3.6 0 1 1 9 5.4a3.6 3.6 0 0 1 0 7.2Zm0-1.8A1.8 1.8 0 1 0 9 7.2a1.8 1.8 0 0 0 0 3.6Z" />
    </svg>
  );
}

function PasswordEyeOffIcon() {
  return (
    <svg
      className="INPUT-PASSWORD-ICON"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      aria-hidden
    >
      <path d="M2.1 1.4 1.4 2.1l2.52 2.52C2.55 5.55 1.35 7.1.75 9c1.3 3.15 4.45 5.5 8.25 5.5 1.45 0 2.82-.3 4.05-.84L15.9 16.6l.7-.7L2.1 1.4Zm6.9 11.2c-2 0-3.6-1.6-3.6-3.6 0-.55.12-1.06.34-1.52l4.78 4.78c-.46.22-.97.34-1.52.34Zm0-7.2c2 0 3.6 1.6 3.6 3.6 0 .3-.04.58-.12.85l2.2 2.2C15.7 11.5 16.65 10.35 17.25 9c-1.3-3.15-4.45-5.5-8.25-5.5-1.12 0-2.2.2-3.18.56l1.66 1.66c.4-.14.83-.22 1.27-.22Z" />
    </svg>
  );
}
