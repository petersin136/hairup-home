import "server-only";

import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

import { getServiceRoleKey, supabaseAnonKey, supabaseUrl } from "@/lib/env";

/**
 * 서버 컴포넌트 / Route Handler / Server Action 용 클라이언트.
 * 쿠키에 담긴 세션을 읽으므로 로그인한 사용자의 권한으로 쿼리가 나갑니다.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // 서버 컴포넌트에서는 쿠키를 쓸 수 없습니다.
          // 세션 갱신은 미들웨어가 담당하므로 여기서는 무시해도 됩니다.
        }
      },
    },
  });
}

/**
 * RLS 를 우회하는 관리자 클라이언트.
 *
 * 반드시 서버에서만, 그리고 호출자가 관리자임을 확인한 뒤에만 쓰세요.
 * 세션을 저장하지 않도록 꺼 두어 요청 간에 권한이 새지 않게 합니다.
 */
export function createSupabaseAdminClient() {
  return createClient(supabaseUrl, getServiceRoleKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
