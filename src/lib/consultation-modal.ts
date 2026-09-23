/** PC 1:1 상담 모달 오픈 — hu_register_*_pc */

export const OPEN_CONSULTATION_EVENT = "hairup:open-consultation";
export const CONSULTATION_DRAFT_KEY = "hairup:consultation-draft";

export type ConsultationDraft = {
  name: string;
  phone: string;
  shopStatus: "preparing" | "operating" | null;
  shopName: string;
  region: string;
  terms: boolean;
};

export function openConsultationModal() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(OPEN_CONSULTATION_EVENT));
}

export function saveConsultationDraft(draft: ConsultationDraft) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(CONSULTATION_DRAFT_KEY, JSON.stringify(draft));
  } catch {
    /* ignore quota */
  }
}

export function loadConsultationDraft(): ConsultationDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(CONSULTATION_DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ConsultationDraft;
  } catch {
    return null;
  }
}

export function clearConsultationDraft() {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(CONSULTATION_DRAFT_KEY);
  } catch {
    /* ignore */
  }
}
