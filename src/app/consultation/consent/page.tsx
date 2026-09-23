import type { Metadata } from "next";

import { ConsultationConsentClient } from "@/components/consultation/ConsultationConsentClient";

export const metadata: Metadata = {
  title: "개인정보 수집 및 이용 동의 — hair up",
  description: "헤어업 1:1 맞춤 상담 개인정보 수집 및 이용 동의",
};

/**
 * 상담 신청 개인정보 수집·이용 동의 — hu_register_10_pc / detail_01
 */
export default function ConsultationConsentPage() {
  return <ConsultationConsentClient />;
}
