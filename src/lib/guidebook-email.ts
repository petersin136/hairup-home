/** 리드 마그넷 메일 — hu_LEAD MAGNET EMAIL SEQUENCE */

export const GUIDEBOOK_EMAIL_SUBJECT = "헤어업 안내서를 보내드립니다";

export const GUIDEBOOK_WORDMARK_CID = "hairup-wordmark";

const KR_SANS =
  "'Sandoll GothicNeo1','Apple SD Gothic Neo','Malgun Gothic','Noto Sans KR',sans-serif";
const PLAYFAIR = "'Playfair Display',Georgia,'Times New Roman',serif";
const INTER = "Inter,Arial,Helvetica,sans-serif";

const INTRO =
  `font-family:${KR_SANS};font-size:16px;font-weight:400;line-height:1.625;letter-spacing:0;color:#1C1A19;text-align:left;margin:0 0 39px;`;

/**
 * 콘텐츠 영역 600×1000 · #EFEAE3 · 중앙 정렬.
 * 본문 간격은 시안(detail08) 그대로: 상 65 · 좌우 48 · 블록 39 · 디바이더 전후 30.
 */
export function guidebookEmailHtml(): string {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>FOR SALON OWNERS</title>
  <!--[if !mso]><!-->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@500&family=Playfair+Display:wght@400&display=swap" rel="stylesheet" />
  <!--<![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#EFEAE3;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#EFEAE3;margin:0;padding:0;">
    <tr>
      <td align="center" valign="top" style="background-color:#EFEAE3;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background-color:#EFEAE3;">
          <tr>
            <td valign="top" style="padding:65px 48px 0;background-color:#EFEAE3;">
              <p class="FOR-SALON-OWNERS" style="font-family:${PLAYFAIR};font-size:40px;font-weight:400;line-height:1.3;color:#1C1A19;text-transform:uppercase;text-align:left;margin:0 0 39px;">FOR SALON OWNERS</p>

              <p class="EMAIL-INTRO-TEXT" style="${INTRO}">안녕하세요. 헤어업입니다.<br />
요청해 주신 헤어업 안내서를 보내드립니다.</p>

              <p class="EMAIL-INTRO-TEXT" style="${INTRO}">헤어샵의 하루는 시술만으로 끝나지 않습니다.<br />
시술 도중 답장하기 어려운 낮부터,<br />
마감 후 일정을 정리한 뒤에도 고객을 챙겨야 하는 늦은 밤까지.</p>

              <p class="EMAIL-INTRO-TEXT" style="${INTRO}">헤어업은 단순한 예약 관리 프로그램을 넘어섭니다.<br />
시술 중 놓치기 쉬운 고객 상담과 예약 전환<br />
일정 관리, 시술 후 다음 방문과 케어까지.<br />
헤어샵의 하루를 뒤에서 챙기는 <strong class="SEMIBOLD" style="font-weight:600;">24시간 AI 살롱 매니저</strong>입니다.</p>

              <p class="EMAIL-INTRO-TEXT" style="font-family:${KR_SANS};font-size:16px;font-weight:400;line-height:1.625;letter-spacing:0;color:#1C1A19;text-align:left;margin:0 0 30px;">첨부된 안내서(PDF)에는 헤어업의 주요 기능과<br />
실제 활용 예시를 담았습니다.<br />
편하게 살펴보시고, 궁금한 점이 있다면 언제든 편하게 답장을 남겨주세요.</p>

              <table role="presentation" width="502" cellpadding="0" cellspacing="0" border="0" class="DIVIDER-LINE" style="width:502px;margin:0 auto 30px;">
                <tr>
                  <td style="height:1px;line-height:1px;font-size:1px;background-color:#2C3A2E;border:none;">&nbsp;</td>
                </tr>
              </table>

              <p class="EXPERIENCE-HAIR-UP" style="font-family:${INTER};font-size:14px;font-weight:500;line-height:1.93;color:#2C3A2E;text-transform:uppercase;text-align:left;margin:0 0 16px;">EXPERIENCE HAIR UP</p>

              <p class="EXPERIENCE-DESC" style="font-family:${KR_SANS};font-size:16px;font-weight:400;line-height:1.625;letter-spacing:0;color:#1C1A19;text-align:left;margin:0 0 44px;">헤어업이 실제로 고객을 어떻게 맞이하는지 궁금하지 않으신가요?<br />
지금 AI 매니저와 직접 대화를 나눠보세요.</p>

              <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" class="BTN-AI-CHAT" style="margin:0 auto;">
                <tr>
                  <td align="center" valign="middle" width="504" height="51" style="width:504px;height:51px;background-color:#2C3A2E;border-radius:4px;">
                    <a href="https://www.hair-up.kr/#ai-manager" target="_blank" style="display:block;width:504px;height:51px;line-height:51px;font-family:${KR_SANS};font-size:16px;font-weight:500;letter-spacing:0;color:#EFEAE3;text-align:center;text-decoration:none;">헤어업 AI 매니저와 대화해보기</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td valign="bottom" align="center" style="padding:74px 0 0;background-color:#EFEAE3;font-size:0;line-height:0;">
              <img src="cid:${GUIDEBOOK_WORDMARK_CID}" alt="hair up" width="504" height="193" class="LOGO" style="display:block;width:504px;height:193px;margin:0 auto;margin-bottom:0;border:0;outline:none;text-decoration:none;vertical-align:bottom;" />
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
