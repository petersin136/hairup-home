/** 리드 마그넷 메일 — hu_LEAD MAGNET EMAIL SEQUENCE 600×1000 */

/** 발신자 표시명 — Resend `from` */
export const GUIDEBOOK_EMAIL_FROM_NAME = "헤어업(hair up)";

/** 메일 제목 */
export const GUIDEBOOK_EMAIL_SUBJECT = "24시간 AI 살롱 매니저, 헤어업 안내서";

/** 인박스 미리보기(preheader) */
export const GUIDEBOOK_EMAIL_PREVIEW =
  "놓치는 상담부터 일정 관리, 다음 케어까지. 헤어샵의 흐름이 끊기지 않도록.";

/** 600px 바깥(풀블리드) 배경 — forest */
export const GUIDEBOOK_EMAIL_OUTER_BG = "#2c3a2e";

/** 시안 버튼 — 헤어업 AI 매니저와 대화해보기 */
export const GUIDEBOOK_CHAT_HREF = "http://pf.kakao.com/_xlfqiX/chat";

export const GUIDEBOOK_TOP_CID = "guidebook-top";
export const GUIDEBOOK_BTN_CID = "guidebook-btn";
export const GUIDEBOOK_BOTTOM_CID = "guidebook-bottom";

/**
 * 발신 계정 프로필 이미지 등록용
 * (Resend/Gravatar/BIMI 등 인박스 아바타는 코드로 강제할 수 없음 — 공개 URL로 보관)
 */
export const GUIDEBOOK_EMAIL_PROFILE_FILENAME =
  "guidebook-email-profile.png";

/** 시안 슬라이스 첨부 (CID 인라인) */
export const GUIDEBOOK_IMAGE_ASSETS = [
  {
    filename: "guidebook-email-top.png",
    contentId: GUIDEBOOK_TOP_CID,
  },
  {
    filename: "guidebook-email-btn.png",
    contentId: GUIDEBOOK_BTN_CID,
  },
  {
    filename: "guidebook-email-bottom.png",
    contentId: GUIDEBOOK_BOTTOM_CID,
  },
] as const;

const IMG =
  "display:block;border:0;outline:none;text-decoration:none;margin:0;padding:0;";

/**
 * 시안 SEQUENCE.png 를 600×1000 그대로 슬라이스합니다.
 * 본문 폰트(Sandoll GothicNeo1)를 웹에서 재현할 수 없어,
 * 치수·글리프를 시안과 1:1로 맞추려면 이미지를 씁니다.
 * 레이어: 상단 688 + 버튼 51 + 하단 261 = 1000.
 *
 * 메인 600px 중앙 정렬 · 600 밖 풀블리드는 #2c3a2e.
 */
export function guidebookEmailHtml(): string {
  const outer = GUIDEBOOK_EMAIL_OUTER_BG;
  const preview = GUIDEBOOK_EMAIL_PREVIEW;

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light only" />
  <meta name="supported-color-schemes" content="light only" />
  <title>${GUIDEBOOK_EMAIL_SUBJECT}</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td { font-family: Arial, sans-serif !important; }
  </style>
  <![endif]-->
</head>
<body style="margin:0;padding:0;width:100%;background-color:${outer};">
  <!-- 미리보기 텍스트 (인박스 리스트) -->
  <div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">
    ${preview}
  </div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;background-color:${outer};margin:0;padding:0;">
    <tr>
      <td align="center" valign="top" style="background-color:${outer};padding:0;">
        <!-- 메인 콘텐츠 600px 중앙 -->
        <table role="presentation" width="600" height="1000" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;height:1000px;background-color:#EFEAE3;margin:0 auto;">
          <tr>
            <td valign="top" style="padding:0;font-size:0;line-height:0;">
              <img src="cid:${GUIDEBOOK_TOP_CID}" alt="FOR SALON OWNERS. 안녕하세요. 헤어업입니다. 요청해 주신 헤어업 안내서를 보내드립니다." width="600" height="688" style="${IMG}width:600px;height:688px;" />
            </td>
          </tr>
          <tr>
            <td valign="top" style="padding:0;background-color:#EFEAE3;font-size:0;line-height:0;">
              <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;">
                <tr>
                  <td width="48" style="width:48px;font-size:0;line-height:0;">&nbsp;</td>
                  <td width="504" align="center" valign="middle" class="BTN-AI-CHAT" style="width:504px;height:51px;padding:0;font-size:0;line-height:0;">
                    <a href="${GUIDEBOOK_CHAT_HREF}" target="_blank" style="display:block;width:504px;height:51px;padding:0;margin:0;text-decoration:none;">
                      <img src="cid:${GUIDEBOOK_BTN_CID}" alt="헤어업 AI 매니저와 대화해보기" width="504" height="51" style="${IMG}width:504px;height:51px;" />
                    </a>
                  </td>
                  <td width="48" style="width:48px;font-size:0;line-height:0;">&nbsp;</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td valign="bottom" style="padding:0;font-size:0;line-height:0;">
              <img src="cid:${GUIDEBOOK_BOTTOM_CID}" alt="hair up" width="600" height="261" class="LOGO" style="${IMG}width:600px;height:261px;" />
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
