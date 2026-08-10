import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/LegalPage";
import { termsOfService } from "@/content/legal";

export const metadata: Metadata = {
  title: "서비스 이용약관 — hair up",
  description: "헤어업(HairUp) 서비스 이용약관",
};

export default function TermsPage() {
  return (
    <LegalPage
      title={termsOfService.title}
      en={termsOfService.en}
      sections={termsOfService.sections}
    />
  );
}
