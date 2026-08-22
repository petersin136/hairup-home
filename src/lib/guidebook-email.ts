/** 리드 마그넷 메일 — hu_LEAD MAGNET EMAIL SEQUENCE 600×1000 */

export const GUIDEBOOK_EMAIL_SUBJECT = "헤어업 안내서를 보내드립니다";

/** 시안 버튼 — 헤어업 AI 매니저와 대화해보기 */
export const GUIDEBOOK_CHAT_HREF = "http://pf.kakao.com/_xlfqiX/chat";

export const GUIDEBOOK_TOP_CID = "guidebook-top";
export const GUIDEBOOK_BTN_CID = "guidebook-btn";
export const GUIDEBOOK_BOTTOM_CID = "guidebook-bottom";

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
 */
export function guidebookEmailHtml(): string {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>FOR SALON OWNERS</title>
</head>
<body style="margin:0;padding:0;background-color:#EFEAE3;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#EFEAE3;margin:0;padding:0;">
    <tr>
      <td align="center" valign="top" style="background-color:#EFEAE3;">
        <table role="presentation" width="600" height="1000" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;height:1000px;background-color:#EFEAE3;">
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
