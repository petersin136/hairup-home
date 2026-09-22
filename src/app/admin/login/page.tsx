import type { Metadata } from "next";

import { AdminLogin } from "@/components/admin/AdminLogin";
import { SuppressEntryChrome } from "@/lib/entry-chrome";

export const metadata: Metadata = {
  title: "관리자 로그인 — hair up",
  description: "헤어업 파트너 관리자 로그인",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <>
      <SuppressEntryChrome />
      <AdminLogin />
    </>
  );
}
