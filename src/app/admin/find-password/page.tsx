import type { Metadata } from "next";

import { AdminFindPassword } from "@/components/admin/AdminFindPassword";
import { SuppressEntryChrome } from "@/lib/entry-chrome";

export const metadata: Metadata = {
  title: "비밀번호 찾기 — hair up",
  description: "헤어업 파트너 관리자 비밀번호 찾기",
  robots: { index: false, follow: false },
};

export default function AdminFindPasswordPage() {
  return (
    <>
      <SuppressEntryChrome />
      <AdminFindPassword />
    </>
  );
}
