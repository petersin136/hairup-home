import { NextResponse } from "next/server";
import { Resend } from "resend";

import { createSupabaseAdminClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const FROM = "헤어업 <guide@hair-up.kr>";
const DEFAULT_TO = "mars.official.kr@gmail.com";
/** docs 버킷 객체 키 — 공백 경로는 일부 환경에서 Invalid path 오류를 냄 */
const GUIDEBOOK_PATH = "hairup-AI-automation-solution.pdf";
const GUIDEBOOK_FILENAME = "hairup-AI-automation-solution.pdf";

/** 가이드북 발송 메일 본문 */
const GUIDEBOOK_HTML = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>헤어업 가이드북</title>
</head>
<body style="margin:0;padding:0;background-color:#f7f5f2;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Noto Sans KR',Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f7f5f2;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#ffffff;border-radius:8px;overflow:hidden;">
          <tr>
            <td style="padding:40px 28px 36px;color:#3a3a3a;font-size:16px;line-height:1.7;">
              <p style="margin:0 0 20px;">안녕하세요, <strong>헤어업</strong>입니다.</p>

              <p style="margin:0 0 20px;">요청해 주셔서 감사합니다. 원장님께서 궁금해하신 <strong>상세 가이드북</strong>을 첨부해 드려요.</p>

              <p style="margin:0 0 20px;">헤어업은 미용실 원장님을 위한 <strong>24시간 AI 예약 실장</strong>이에요. 원장님이 가위를 들고 계신 순간에도, 문 닫은 새벽에도, 손님의 카카오톡 문의에 사람처럼 응대하고 <strong>예약까지 알아서</strong> 잡아드립니다.</p>

              <p style="margin:0 0 20px;"><strong>헤어업이 특별한 이유</strong>는 이거예요. 단순히 정해진 버튼만 누르게 하는 예약봇이 아니라, 손님이 사진 한 장을 보내거나 &ldquo;요즘 유행하는 그 스타일&rdquo;처럼 두루뭉술하게 말해도 맥락을 읽고 어울리는 시술을 먼저 제안해요. 시술마다 다른 소요 시간까지 계산해서 예약이 겹치지 않게 잡아드리고, 노쇼가 걱정되면 예약금도 받아드려요. <strong>건당 수수료 없이 월정액 하나</strong>로요.</p>

              <p style="margin:0 0 28px;">첨부된 가이드북에 도입 방법과 실제 화면, 요금까지 자세히 담아두었어요. 편하게 살펴보시고 궁금한 점은 언제든 편하게 답장 주세요.</p>

              <p style="margin:0 0 32px;">헤어업 드림</p>

              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td align="center" style="border-radius:6px;background-color:#2c3a2e;">
                    <a href="https://hair-up.kr" target="_blank" style="display:inline-block;padding:14px 28px;color:#ffffff;font-size:15px;font-weight:600;line-height:1.2;text-decoration:none;border-radius:6px;">
                      헤어업 체험해보기
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

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
  const tryPaths = [
    GUIDEBOOK_PATH,
    // 예전 파일명(공백) 호환
    "hairup AI automation solution.pdf",
  ];

  let lastError: string | undefined;
  for (const path of tryPaths) {
    const { data, error } = await supabase.storage.from("docs").download(path);
    if (data && !error) {
      const buffer = Buffer.from(await data.arrayBuffer());
      return {
        filename: GUIDEBOOK_FILENAME,
        content: buffer,
      };
    }
    lastError = error?.message ?? "가이드북 PDF를 불러오지 못했습니다.";
  }

  throw new Error(lastError);
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
  // 가이드북 첨부 메일은 서버에 정의된 본문을 사용합니다.
  const html = body.attachGuidebook
    ? GUIDEBOOK_HTML
    : body.html?.trim();
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
