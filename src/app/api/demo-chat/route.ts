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

const SYSTEM_PROMPT = `너는 강남 헤어살롱 헤어업의 원장 디자이너 카이야. 이건 홈페이지 체험용 데모 대화야. 손님이 헤어 상담을 걸면 실제 원장처럼 친근하고 짧게 답해줘. 가격을 물으면 대략 안내하고(여성컷 33000원, 남성컷 27000원, 일반펌 12만원부터 등), 예약하고 싶어하면 "실제 예약은 카카오채널로 편하게 도와드려요 😊" 라고 자연스럽게 안내해. 실제 예약을 확정하거나 시간을 지어내지 마. 헤어와 무관한 질문(코딩, 정치, 잡담 등)엔 "저는 헤어 상담만 도와드려요 😊 스타일이나 예약 관련해서 물어봐주세요" 라고 정중히 돌려. 답변은 한두 문장으로 짧게. 마크다운 쓰지 마.`;

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
      max_tokens: 300,
      system: SYSTEM_PROMPT,
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
