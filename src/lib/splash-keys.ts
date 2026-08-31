/**
 * 스플래시 키/이벤트 이름 — "use client" 없는 순수 모듈.
 *
 * layout.tsx(서버 컴포넌트)가 splash-seen 가드 스크립트에 키를 문자열로 심습니다.
 * 이 상수를 클라이언트 모듈에 두면 서버에서는 값이 아니라 클라이언트 참조 스텁으로
 * 직렬화돼, 인라인 스크립트에 함수 본문이 박히고 파싱이 깨집니다.
 * 서버·클라이언트가 같이 읽는 값은 반드시 이 파일에 둡니다.
 */

export const SPLASH_SESSION_KEY = "hairup:splash-played";
/** 커튼이 올라가기 시작하는 순간. 히어로 본문 rain-in 이 이때 맞춰 재생됩니다. */
export const SPLASH_REVEAL_EVENT = "hairup:splash-reveal";
/** 스플래시가 완전히 끝난 뒤 — 런치 팝업은 이 신호 + 400ms 후 표시 */
export const SPLASH_DONE_EVENT = "hairup:splash-done";
