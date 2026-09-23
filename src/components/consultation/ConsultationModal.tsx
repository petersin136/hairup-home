"use client";

import Link from "next/link";
import {
  FormEvent,
  useCallback,
  useEffect,
  useId,
  useState,
} from "react";
import { createPortal } from "react-dom";

import { Wordmark } from "@/components/brand/Wordmark";
import {
  clearConsultationDraft,
  loadConsultationDraft,
  OPEN_CONSULTATION_EVENT,
  saveConsultationDraft,
  type ConsultationDraft,
} from "@/lib/consultation-modal";

type ShopStatus = "preparing" | "operating" | null;
type ModalStep = "form" | "complete";

const CONSENT_HREF = "/consultation/consent";

const EMPTY_DRAFT: ConsultationDraft = {
  name: "",
  phone: "",
  shopStatus: null,
  shopName: "",
  region: "",
  terms: false,
};

/**
 * 1:1 맞춤 상담 모달 — UX 순서 hu_register_01~09_pc
 * PC·모바일 동일 플로우 (모바일은 390 기준 카드로 축소)
 * 01 빈폼 → 02~06 입력 → 07 동의체크 → 08 제출활성 → 09 완료
 * 보기 → consent(10) → 돌아가기 시 입력값 유지
 */
export function ConsultationModal() {
  const titleId = useId();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<ModalStep>("form");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [shopStatus, setShopStatus] = useState<ShopStatus>(null);
  const [shopName, setShopName] = useState("");
  const [region, setRegion] = useState("");
  const [terms, setTerms] = useState(false);

  const isFormActive =
    name.trim().length > 0 &&
    phone.trim().length > 0 &&
    shopStatus !== null &&
    shopName.trim().length > 0 &&
    region.trim().length > 0 &&
    terms;

  const applyDraft = useCallback((draft: ConsultationDraft) => {
    setStep("form");
    setName(draft.name);
    setPhone(draft.phone);
    setShopStatus(draft.shopStatus);
    setShopName(draft.shopName);
    setRegion(draft.region);
    setTerms(draft.terms);
  }, []);

  const resetForm = useCallback(() => {
    applyDraft(EMPTY_DRAFT);
    clearConsultationDraft();
  }, [applyDraft]);

  const persistDraft = useCallback(() => {
    saveConsultationDraft({
      name,
      phone,
      shopStatus,
      shopName,
      region,
      terms,
    });
  }, [name, phone, shopStatus, shopName, region, terms]);

  const close = useCallback(() => {
    setOpen(false);
    resetForm();
    document.documentElement.classList.remove("entry-scroll-lock");
  }, [resetForm]);

  /** CTA로 열기 — 항상 01 빈 폼부터 */
  const openModal = useCallback(() => {
    resetForm();
    setOpen(true);
    document.documentElement.classList.add("entry-scroll-lock");
  }, [resetForm]);

  /** 동의 페이지에서 복귀 — 입력값 유지 */
  const openModalRestored = useCallback(() => {
    const draft = loadConsultationDraft();
    applyDraft(draft ?? EMPTY_DRAFT);
    setOpen(true);
    document.documentElement.classList.add("entry-scroll-lock");
  }, [applyDraft]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onOpen = () => openModal();
    window.addEventListener(OPEN_CONSULTATION_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_CONSULTATION_EVENT, onOpen);
  }, [openModal]);

  useEffect(() => {
    if (!mounted) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("consultation") === "1") {
      openModalRestored();
      params.delete("consultation");
      const next = `${window.location.pathname}${params.toString() ? `?${params}` : ""}${window.location.hash}`;
      window.history.replaceState(null, "", next);
    }
  }, [mounted, openModalRestored]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  /* 입력 중 드래프트 저장 — 보기→돌아가기 복원용 */
  useEffect(() => {
    if (!open || step !== "form") return;
    persistDraft();
  }, [open, step, persistDraft]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isFormActive) return;
    clearConsultationDraft();
    setStep("complete");
  }

  if (!mounted || !open) return null;

  return createPortal(
    <>
      <div className="MODAL-OVERLAY" role="presentation" onClick={close} />
      <div
        className={
          step === "complete" ? "MODAL-CARD is-complete" : "MODAL-CARD"
        }
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <button
          type="button"
          className="MODAL-CLOSE-BTN"
          aria-label="닫기"
          onClick={close}
        >
          <CloseIcon />
        </button>

        {step === "complete" ? (
          <CompleteView titleId={titleId} onConfirm={close} />
        ) : (
          <FormView
            titleId={titleId}
            name={name}
            phone={phone}
            shopStatus={shopStatus}
            shopName={shopName}
            region={region}
            terms={terms}
            isFormActive={isFormActive}
            setName={setName}
            setPhone={setPhone}
            setShopStatus={setShopStatus}
            setShopName={setShopName}
            setRegion={setRegion}
            setTerms={setTerms}
            onSubmit={onSubmit}
            onViewConsent={persistDraft}
          />
        )}
      </div>
    </>,
    document.body,
  );
}

function FormView({
  titleId,
  name,
  phone,
  shopStatus,
  shopName,
  region,
  terms,
  isFormActive,
  setName,
  setPhone,
  setShopStatus,
  setShopName,
  setRegion,
  setTerms,
  onSubmit,
  onViewConsent,
}: {
  titleId: string;
  name: string;
  phone: string;
  shopStatus: ShopStatus;
  shopName: string;
  region: string;
  terms: boolean;
  isFormActive: boolean;
  setName: (v: string) => void;
  setPhone: (v: string) => void;
  setShopStatus: (v: ShopStatus) => void;
  setShopName: (v: string) => void;
  setRegion: (v: string) => void;
  setTerms: (v: boolean) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onViewConsent: () => void;
}) {
  return (
    <>
      <h2 id={titleId} className="MODAL-TITLE">
        헤어업 1:1 맞춤 상담
      </h2>

      <p className="MODAL-DESC">
        우리 매장에 꼭 필요한 만큼만.
        <br />
        매장 상황에 알맞은 맞춤 플랜을 제안합니다.
      </p>

      <form noValidate onSubmit={onSubmit}>
        {/* 01→02 성함 */}
        <input
          className="MODAL-INPUT is-first"
          type="text"
          name="name"
          autoComplete="name"
          placeholder="성함"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* 02→03 연락처 */}
        <input
          className="MODAL-INPUT"
          type="tel"
          name="phone"
          autoComplete="tel"
          placeholder="연락처"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        {/* 03→04 매장 상태 */}
        <fieldset className="MODAL-STATUS">
          <legend className="STATUS-LABEL">매장 상태</legend>
          <div className="STATUS-BTN-ROW">
            <button
              type="button"
              className={
                shopStatus === "preparing"
                  ? "STATUS-BTN IS-ACTIVE"
                  : "STATUS-BTN"
              }
              aria-pressed={shopStatus === "preparing"}
              onClick={() => setShopStatus("preparing")}
            >
              오픈 준비 중
            </button>
            <button
              type="button"
              className={
                shopStatus === "operating"
                  ? "STATUS-BTN IS-ACTIVE"
                  : "STATUS-BTN"
              }
              aria-pressed={shopStatus === "operating"}
              onClick={() => setShopStatus("operating")}
            >
              운영 중
            </button>
          </div>
        </fieldset>

        {/* 04→05 매장명 */}
        <input
          className="MODAL-INPUT"
          type="text"
          name="shopName"
          placeholder="매장명"
          value={shopName}
          onChange={(e) => setShopName(e.target.value)}
        />

        {/* 05→06 지역 */}
        <input
          className="MODAL-INPUT MODAL-INPUT-SUBTEXT"
          type="text"
          name="region"
          placeholder="지역(시·구·동)"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          aria-label="지역(시·구·동)"
        />

        {/* 06→07 동의 체크 · 보기→10 */}
        <div className="MODAL-TERMS">
          <label className="MODAL-TERMS-LABEL">
            <span
              className={
                terms ? "TERMS-CHECKBOX IS-CHECKED" : "TERMS-CHECKBOX"
              }
              aria-hidden
            >
              {terms ? <CheckIcon /> : null}
            </span>
            <input
              className="TERMS-CHECKBOX-INPUT"
              type="checkbox"
              checked={terms}
              onChange={(e) => setTerms(e.target.checked)}
            />
            <span className="TERMS-TEXT">
              [필수] 개인정보 수집 및 이용 동의
            </span>
          </label>
          <Link
            className="LINK-VIEW"
            href={CONSENT_HREF}
            onClick={onViewConsent}
          >
            보기
          </Link>
        </div>

        {/* 07→08 전항목+동의 시 IS-ACTIVE · 제출→09 */}
        <button
          type="submit"
          className={isFormActive ? "BTN-SUBMIT IS-ACTIVE" : "BTN-SUBMIT"}
          disabled={!isFormActive}
        >
          상담 신청하기
        </button>
      </form>
    </>
  );
}

function CompleteView({
  titleId,
  onConfirm,
}: {
  titleId: string;
  onConfirm: () => void;
}) {
  return (
    <>
      <div className="LOGO" aria-hidden>
        <Wordmark width={130} />
      </div>
      <h2 id={titleId} className="COMPLETE-TITLE">
        상담 신청이 완료되었습니다.
      </h2>
      <p className="COMPLETE-DESC">
        원장님의 매장에 꼭 알맞은 플랜을 준비하여,
        <br />
        영업일 기준 24시간 이내에 순차적으로 연락드리겠습니다.
      </p>
      <button type="button" className="BTN-CONFIRM" onClick={onConfirm}>
        확인
      </button>
    </>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden>
      <path
        d="M4 4L16 16M16 4L4 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      className="TERMS-CHECK-ICON"
      width="11"
      height="8"
      viewBox="0 0 11 8"
      aria-hidden
    >
      <path
        fill="#FFFFFF"
        d="M3.85 7.35 0.4 3.9l1.05-1.05 2.4 2.4L9.55 0.55 10.6 1.6z"
      />
    </svg>
  );
}
