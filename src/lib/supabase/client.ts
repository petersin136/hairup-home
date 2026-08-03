"use client";

import { createBrowserClient } from "@supabase/ssr";

import { supabaseAnonKey, supabaseUrl } from "@/lib/env";

/**
 * 클라이언트 컴포넌트용 Supabase 클라이언트.
 * anon key 로 동작하므로 접근 제어는 전적으로 RLS 정책에 달려 있습니다.
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
