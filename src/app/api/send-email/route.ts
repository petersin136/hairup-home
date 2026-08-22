import { readFile } from "node:fs/promises";
import path from "node:path";

import { NextResponse } from "next/server";
import { Resend } from "resend";

import { getServiceRoleKey, supabaseUrl } from "@/lib/env";
import {
  GUIDEBOOK_WORDMARK_CID,
  guidebookEmailHtml,
} from "@/lib/guidebook-email";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const FROM = "헤어업 <guide@hair-up.kr>";
const DEFAULT_TO = "mars.official.kr@gmail.com";
/** docs 버킷 / public/docs 공통 파일명 (공백 없음) */
const GUIDEBOOK_PATH = "hairup-AI-automation-solution.pdf";
const GUIDEBOOK_FILENAME = "hairup-AI-automation-solution.pdf";
const GUIDEBOOK_LOCAL = path.join(
  process.cwd(),
  "public",
  "docs",
  GUIDEBOOK_FILENAME,
);
const WORDMARK_LOCAL = path.join(
  process.cwd(),
  "public",
  "brand",
  "wordmark-email.png",
);

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
  // 1) 배포물에 포함된 public/docs (Vercel에서도 우선 사용)
  try {
    const buffer = await readFile(GUIDEBOOK_LOCAL);
    if (buffer.byteLength > 0) {
      return { filename: GUIDEBOOK_FILENAME, content: buffer };
    }
  } catch {
    // fall through
  }

  // 2) 같은 사이트의 정적 URL
  const siteOrigins = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : undefined,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
    "https://www.hair-up.kr",
    "https://hair-up.kr",
  ].filter((v): v is string => Boolean(v));

  for (const origin of siteOrigins) {
    try {
      const res = await fetch(
        new URL(`/docs/${GUIDEBOOK_FILENAME}`, origin).toString(),
        { cache: "no-store" },
      );
      if (res.ok) {
        const buffer = Buffer.from(await res.arrayBuffer());
        if (buffer.byteLength > 0) {
          return { filename: GUIDEBOOK_FILENAME, content: buffer };
        }
      }
    } catch {
      // try next
    }
  }

  // 3) Supabase Storage (REST — 경로/공백 이슈 회피)
  const base = supabaseUrl.replace(/\/+$/, "");
  const key = getServiceRoleKey();
  const tryPaths = [
    GUIDEBOOK_PATH,
    "hairup AI automation solution.pdf",
  ];

  let lastError = "가이드북 PDF를 불러오지 못했습니다.";
  for (const objectPath of tryPaths) {
    try {
      const res = await fetch(
        `${base}/storage/v1/object/docs/${encodeURIComponent(objectPath)}`,
        {
          headers: {
            Authorization: `Bearer ${key}`,
            apikey: key,
          },
          cache: "no-store",
        },
      );
      if (res.ok) {
        const buffer = Buffer.from(await res.arrayBuffer());
        return { filename: GUIDEBOOK_FILENAME, content: buffer };
      }
      lastError = `Supabase PDF 오류 (${res.status}): ${(await res.text()).slice(0, 180)}`;
    } catch (error) {
      lastError =
        error instanceof Error ? error.message : "가이드북 PDF를 불러오지 못했습니다.";
    }
  }

  // 4) 마지막: supabase-js
  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase.storage
      .from("docs")
      .download(GUIDEBOOK_PATH);
    if (data && !error) {
      return {
        filename: GUIDEBOOK_FILENAME,
        content: Buffer.from(await data.arrayBuffer()),
      };
    }
    if (error?.message) lastError = error.message;
  } catch (error) {
    if (error instanceof Error) lastError = error.message;
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
    ? guidebookEmailHtml()
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

  let attachments:
    | {
        filename: string;
        content: Buffer;
        contentId?: string;
        contentType?: string;
      }[]
    | undefined;
  if (body.attachGuidebook) {
    try {
      const guidebook = await loadGuidebookAttachment();
      const wordmark = await readFile(WORDMARK_LOCAL);
      attachments = [
        guidebook,
        {
          filename: "wordmark-email.png",
          content: wordmark,
          contentId: GUIDEBOOK_WORDMARK_CID,
          contentType: "image/png",
        },
      ];
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
