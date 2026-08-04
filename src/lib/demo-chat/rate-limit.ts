import "server-only";

/**
 * 데모 채팅용 하루 15회 제한.
 * Vercel 인스턴스 메모리 기준이라 콜드스타트·다중 인스턴스에서는
 * 대략적인 체험 제한으로만 동작합니다.
 */

const LIMIT = 15;

type Bucket = { day: string; count: number };

const byIp = new Map<string, Bucket>();
const bySession = new Map<string, Bucket>();

function today() {
  return new Date().toISOString().slice(0, 10);
}

function read(map: Map<string, Bucket>, key: string): number {
  const day = today();
  const bucket = map.get(key);
  if (!bucket || bucket.day !== day) {
    map.set(key, { day, count: 0 });
    return 0;
  }
  return bucket.count;
}

function bump(map: Map<string, Bucket>, key: string) {
  const day = today();
  const count = read(map, key) + 1;
  map.set(key, { day, count });
  return count;
}

export const DEMO_CHAT_LIMIT = LIMIT;

export const DEMO_CHAT_LIMIT_MESSAGE =
  "오늘 체험 횟수를 다 쓰셨어요. 실제 상담은 카카오채널로 문의해주세요";

/** 아직 여유 있으면 true. IP 또는 세션 중 하나라도 한도에 닿으면 false. */
export function canUseDemoChat(ip: string, sessionId: string): boolean {
  return read(byIp, ip) < LIMIT && read(bySession, sessionId) < LIMIT;
}

/** 성공 호출 직후 카운트를 올립니다. */
export function recordDemoChatUse(ip: string, sessionId: string) {
  bump(byIp, ip);
  bump(bySession, sessionId);
}
