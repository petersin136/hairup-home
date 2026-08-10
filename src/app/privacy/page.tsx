import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/LegalPage";
import { privacyPolicy } from "@/content/legal";

export const metadata: Metadata = {
  title: "개인정보처리방침 — hair up",
  description: "헤어업(HairUp) 개인정보처리방침",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title={privacyPolicy.title}
      en={privacyPolicy.en}
      sections={privacyPolicy.sections}
    />
  );
}
