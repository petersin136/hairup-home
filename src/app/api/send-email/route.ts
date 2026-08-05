import { NextResponse } from "next/server";
import { Resend } from "resend";

import { createSupabaseAdminClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const FROM = "헤어업 <onboarding@resend.dev>";
const DEFAULT_TO = "mars.official.kr@gmail.com";
const GUIDEBOOK_PATH = "hairup AI automation solution.pdf";
const GUIDEBOOK_FILENAME = "hairup-AI-automation-solution.pdf";

type SendEmailBody = {
  to?: string;
  subject?: string;
  html?: string;
  attachGuidebook?: boolean;
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function loadGuidebookAttachment() {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.storage
    .from("docs")
    .download(GUIDEBOOK_PATH);

  if (error || !data) {
    throw new Error(error?.message ?? "가이드북 PDF를 불러오지 못했습니다.");
  }

  const buffer = Buffer.from(await data.arrayBuffer());
  return {
    filename: GUIDEBOOK_FILENAME,
    content: buffer,
  };
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "RESEND_API_KEY 가 설정되지 않았습니다." },
      { status: 500 },
    );
  }

  let body: SendEmailBody;
  try {
    body = (await request.json()) as SendEmailBody;
  } catch {
    return NextResponse.json(
      { error: "JSON body 가 필요합니다." },
      { status: 400 },
    );
  }

  const subject = body.subject?.trim();
  const html = body.html?.trim();
  const to = (body.to?.trim() || DEFAULT_TO).toLowerCase();

  if (!subject || !html) {
    return NextResponse.json(
      { error: "subject 와 html 이 필요합니다." },
      { status: 400 },
    );
  }

  if (!isValidEmail(to)) {
    return NextResponse.json(
      { error: "올바른 이메일 주소를 입력해 주세요." },
      { status: 400 },
    );
  }

  let attachments: Awaited<ReturnType<typeof loadGuidebookAttachment>>[] | undefined;
  if (body.attachGuidebook) {
    try {
      attachments = [await loadGuidebookAttachment()];
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "가이드북 PDF를 불러오지 못했습니다.";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }

  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from: FROM,
    to,
    subject,
    html,
    attachments,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 502 });
  }

  return NextResponse.json({ ok: true, id: data?.id });
}
