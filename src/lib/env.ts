/**
 * 환경변수는 전부 여기서만 읽습니다.
 *
 * NEXT_PUBLIC_* 는 빌드 타임에 문자열로 치환되기 때문에
 * process.env["NEXT_PUBLIC_..."] 같은 동적 접근을 쓰면 값이 사라집니다. 반드시 리터럴로 접근하세요.
 */

function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `환경변수 ${name} 가 비어 있습니다. .env.example 을 참고해 .env.local 을 채워 주세요.`,
    );
  }
  return value;
}

/** 프로젝트 base URL. 뒤에 /rest/v1 같은 경로가 붙으면 안 됩니다. */
export const supabaseUrl = required(
  "NEXT_PUBLIC_SUPABASE_URL",
  process.env.NEXT_PUBLIC_SUPABASE_URL,
);

export const supabaseAnonKey = required(
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

/**
 * 아래 두 개는 서버 전용이라 함수로 감싸 둡니다.
 * 모듈 최상단에서 읽으면 클라이언트 번들에서 값이 없어 즉시 throw 하게 됩니다.
 */

/** RLS 를 전부 우회합니다. 서버 코드에서만 호출하세요. */
export function getServiceRoleKey(): string {
  return required("SUPABASE_SERVICE_ROLE_KEY", process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function getAdminSignupCode(): string {
  return required("ADMIN_SIGNUP_CODE", process.env.ADMIN_SIGNUP_CODE);
}
