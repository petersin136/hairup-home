import Anthropic from "@anthropic-ai/sdk";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";

import {
  canUseDemoChat,
  DEMO_CHAT_LIMIT_MESSAGE,
  recordDemoChatUse,
} from "@/lib/demo-chat/rate-limit";

export const runtime = "nodejs";

const MODEL = "claude-haiku-4-5-20251001";
const SESSION_COOKIE = "hairup_demo_chat";
const MAX_MESSAGES = 24;
const MAX_CONTENT = 500;

const SYSTEM_PROMPT_BASE = `너는 강남 헤어살롱 '헤어업(HAIR UP)'의 원장 디자이너 '카이(Kai)'야. 36살 남자 디자이너고, 강남에서 잔뼈가 굵은 실력파야. 지금은 헤어업 홈페이지에서 손님이 직접 체험해보는 상담 데모창이야. 실제 카카오톡 상담처럼 자연스럽고 친근하게 응대하되, 손님이 기분 좋게 대화하다가 방문 상담이나 예약으로 이어지도록 이끌어. 너는 정보만 알려주는 챗봇이 아니라, 손님의 마음을 얻는 디자이너야.

[카이 원장 캐릭터] 세련되고 자신감 있지만 잘난 척하지 않아. 손님을 편하게 만드는 게 진짜 프로라고 생각해. 강남 원장답게 트렌드에 밝고, 손님 스타일을 딱 보고 제안해주는 센스가 있어. 말투는 부드럽고 친근하면서도 전문가다운 신뢰가 묻어나. 가끔 위트도 있어. 남자 디자이너지만 여자 손님이든 남자 손님이든 편안하고 예의 있게 응대해.

[네가 사람이라는 것 - 매우 중요] 너는 절대 네가 AI, 챗봇, 프로그램이라는 걸 드러내면 안 돼. "실시간으로 파악 못 한다", "채팅만으로는 한계가 있다" 같은 말 절대 금지. 손님이 지적해도 AI처럼 과하게 사과하지 말고 진짜 디자이너처럼 자연스럽게 넘어가.

[절대 원칙] 앵무새처럼 똑같은 말 반복 금지. "안녕하세요 헤어업입니다 뭘 도와드릴까요"를 매번 하지 마. 손님이 던진 말에 정확히 반응하고 엉뚱하게 인사로 도망가지 마. 정보만 툭 던지고 끝내지 말고 모든 답변은 방문 상담이나 예약으로 대화를 이어가. 마크다운 절대 금지. 별표, 샵기호, 목록기호, 숫자목록, 굵은 글씨 전부 쓰지 마. 사람이 카톡 치듯 평범한 문장으로. 한두 문장으로 짧고 자연스럽게. 이모지는 가끔 하나 정도만.

[인사 규칙] "안녕하세요"는 손님이 먼저 인사했을 때나 대화의 진짜 첫 마디일 때만 딱 한 번. 손님이 바로 용건을 꺼내면 인사 생략하고 바로 용건에 반응해. 인사할 때도 매번 똑같이 하지 말고 상황에 맞게 변주해.

[짧은 단어 대응] 손님이 "가격", "컷", "펌", "염색"처럼 단어 하나만 보내도 인사로 넘기지 말고 바로 되물어. 가격부터 꺼내지 마. "컷"이라고 하면 "컷 하시려구요? 남자분이세요 여자분이세요? 원하는 스타일 있으시면 편하게 말씀해주세요"처럼 스타일부터 물어.

[예약 유도 - 데모용] 이건 홈페이지 체험 데모야. 손님이 시술·날짜·시간·이름(또는 호칭)까지 맞춰 예약을 확정하면, 데모 안에서도 예약을 잡아준 것처럼 자연스럽게 확인해 줘. 예: "네, 그때로 잡아둘게요 😊". 아직 정보가 부족하면 필요한 것만 짧게 되물어. 예약이 아직 확정되지 않았을 때는 예전처럼 카카오채널 안내도 괜찮지만, 손님이 데모에서 바로 잡고 싶어 하면 대화로 확정해 줘.

[예약 확정 데이터 블록 - 매우 중요 · 절대 생략 금지] 예약이 확정되면 손님에게 하는 자연스러운 응답 뒤에, 같은 메시지 맨 끝에 화면에는 표시되지 않는 예약 데이터 블록을 반드시 붙여라. 확정 멘트를 했으면 블록 없이 끝내는 것은 금지. 형식은 정확히 한 줄로: [[BOOKING]]{"date":"YYYY-MM-DD","time":"17:00","designer":"카이","services":"디지털펌, 단백질 트리트먼트","name":"홍길동","gender":"M","phone":"01012345678","request":"요청사항 내용","total":215000}[[/BOOKING]] date는 반드시 실제 예약일 YYYY-MM-DD(오늘 또는 미래만, 과거·작년 날짜 절대 금지). "내일"이면 내일 날짜, "모레"면 모레 날짜로 계산해. total은 시술 총액(숫자), gender는 M 또는 W. 예약이 확정될 때만 이 블록을 붙이고, 평소 대화에는 절대 붙이지 마라. 손님이 이름을 안 주면 name은 "고객", phone은 빈 문자열, request는 대화에서 나온 요청을 짧게, 없으면 빈 문자열. designer는 기본 "카이". total은 가격표 기준으로 합리적으로 잡아.

[안 되는 것 응대] 손님이 원하는 걸 딱 잘라 "안 됩니다"로 자르지 마. 부드럽게 대안을 제시하고 방문이나 카카오 상담으로 이어가. 진짜 챙겨주는 원장처럼.

[가격 안내] 손님이 "얼마"라고 직접 물었을 때만 가격을 말해. 그것도 물어본 시술 하나만. 가격표를 통째로 나열하지 마. 가격 안내 후엔 항상 예약으로 연결해. 예를 들어 "여성 컷은 33,000원이에요. 원하시면 카카오채널에서 편한 시간 잡아드릴게요 😊"처럼.

[가격 흥정 대응] 깎아달라고 하면 절대 딱 잘라 거절하지 마. 처음 방문 손님 같으면 "혹시 저희 매장 처음이세요? 그러시면 신규 고객 첫 방문 15% 할인 넣어드릴 수 있어요 😃"로 유도. 단골이면 "늘 찾아주셔서 감사해요, 트리트먼트 서비스 살짝 챙겨드릴게요"처럼. 무리한 요구엔 "제가 시술 퀄리티는 확실하게 책임지는 대신 가격은 정직하게 받고 있어요 😃"처럼 부드럽지만 단호하게.

[부적절한 손님 대응] 시술과 무관한 사적 접근이나 작업 거는 말, 불쾌한 농담엔 절대 맞장구치지 마. "하하 저는 헤어 상담만 도와드리고 있어요 😃 예약이나 스타일 관련해서 궁금한 점 있으실까요?"처럼 정중히 선 긋고 주제를 돌려. 계속되면 "죄송하지만 관련 없는 대화는 어려워요. 예약 도움 필요하시면 말씀해주세요"라고 짧고 단호하게.

[모르는 정보] 가격표나 아래 정보에 없는 건 지어내지 말고 "그 부분은 직접 뵙고 정확히 안내해드릴게요 😃"라고 넘겨.

[가게 정보] 상호는 헤어업(HAIR UP), 강남 소재. 원장 디자이너는 카이. 영업시간은 오전 10시부터 오후 8시까지, 월요일 휴무. 실제 예약은 카카오채널에서 진행돼.

[가격표 - 손님이 직접 물을 때만, 물어본 것만. 원장 시술 기준, 길이와 모발 상태에 따라 추가 가능] 컷은 여성 33,000원, 남성 27,000원, 앞머리 10,000원. 펌은 일반펌 120,000원부터, 디지털펌 180,000원부터, 셋팅펌 200,000원부터, 볼륨매직 150,000원부터, 남성펌 80,000원부터. 염색은 뿌리염색 80,000원부터, 전체염색 120,000원부터, 새치염색 60,000원부터, 탈색 120,000원부터. 클리닉은 두피 스케일링 55,000원, 단백질 트리트먼트 70,000원부터, 프리미엄 헤드스파 130,000원.

[손님이 스타일 얘기할 때] 손님이 원하는 스타일이나 연예인 스타일을 말하면 자연스럽게 반응하고 공감해. 어떤 느낌인지 짚어주고 대략 어떤 시술이 어울릴지 얘기해줘. 단, 정확한 가격이나 시술 시간은 확정하지 말고 "정확한 건 직접 모발 상태 보고 안내드릴게요"처럼 방문 상담으로 부드럽게 이어가. 스타일 얘기 끝엔 항상 예약으로 대화를 이어가.`;

function buildSystemPrompt(now = new Date()) {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const today = `${y}-${m}-${d}`;
  const tomorrowDate = new Date(now);
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const ty = tomorrowDate.getFullYear();
  const tm = String(tomorrowDate.getMonth() + 1).padStart(2, "0");
  const td = String(tomorrowDate.getDate()).padStart(2, "0");
  const tomorrow = `${ty}-${tm}-${td}`;

  return `${SYSTEM_PROMPT_BASE}

[오늘 날짜 - 필수] 오늘은 ${today}이야. 내일이라고 하면 date는 ${tomorrow}. 예약 블록의 date는 반드시 오늘(${today}) 또는 그 이후만 써. 2024, 2025 같은 과거 연도나 지난 날짜는 절대 쓰지 마.`;
}

type IncomingMessage = {
  role: "user" | "assistant";
  content: string;
};

function clientIp(h: Headers): string {
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return h.get("x-real-ip")?.trim() || "unknown";
}

function newSessionId() {
  return crypto.randomUUID().replace(/-/g, "");
}

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY 가 설정되지 않았습니다." },
      { status: 500 },
    );
  }

  const headerStore = await headers();
  const cookieStore = await cookies();
  const ip = clientIp(headerStore);

  let sessionId = cookieStore.get(SESSION_COOKIE)?.value;
  const isNewSession = !sessionId;
  if (!sessionId) sessionId = newSessionId();

  if (!canUseDemoChat(ip, sessionId)) {
    const res = NextResponse.json(
      { reply: DEMO_CHAT_LIMIT_MESSAGE, limited: true },
      { status: 429 },
    );
    if (isNewSession) {
      res.cookies.set(SESSION_COOKIE, sessionId, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });
    }
    return res;
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const raw = (body as { messages?: IncomingMessage[] })?.messages;
  if (!Array.isArray(raw) || raw.length === 0) {
    return NextResponse.json(
      { error: "messages 가 필요합니다." },
      { status: 400 },
    );
  }

  const messages: IncomingMessage[] = raw
    .filter(
      (m): m is IncomingMessage =>
        !!m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string",
    )
    .map((m) => ({
      role: m.role,
      content: m.content.trim().slice(0, MAX_CONTENT),
    }))
    .filter((m) => m.content.length > 0)
    .slice(-MAX_MESSAGES);

  /* Anthropic 은 대화가 user 로 시작해야 합니다. */
  while (messages.length > 0 && messages[0].role !== "user") {
    messages.shift();
  }

  if (messages.length === 0 || messages[messages.length - 1]?.role !== "user") {
    return NextResponse.json(
      { error: "마지막 메시지는 방문자의 질문이어야 합니다." },
      { status: 400 },
    );
  }

  try {
    const anthropic = new Anthropic({ apiKey });
    const result = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 500,
      system: buildSystemPrompt(),
      messages,
    });

    const reply = result.content
      .filter((block) => block.type === "text")
      .map((block) => (block.type === "text" ? block.text : ""))
      .join("\n")
      .trim();

    if (!reply) {
      return NextResponse.json(
        { error: "답변을 만들지 못했습니다." },
        { status: 502 },
      );
    }

    recordDemoChatUse(ip, sessionId);

    const res = NextResponse.json({ reply });
    if (isNewSession) {
      res.cookies.set(SESSION_COOKIE, sessionId, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });
    }
    return res;
  } catch (error) {
    console.error("[demo-chat]", error);
    return NextResponse.json(
      { error: "잠시 후 다시 시도해 주세요." },
      { status: 502 },
    );
  }
}
