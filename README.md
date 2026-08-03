# hair up — 웹사이트

웹디자이너 시안(1440px 아트보드)을 픽셀 단위로 재현하는 프로젝트입니다.
Next.js 16 (App Router) · TypeScript · Tailwind CSS v4.

## 실행

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```

## 시안 재현 규칙

- 데스크톱 기준 폭은 **1440px 고정**입니다. 화면이 넓어져도 요소는 확대하지 않고
  양옆 빈 여백만 늘어납니다. 섹션 배경색만 화면 폭 100%를 채웁니다.
- 섹션마다 시안에서 컬러/사이즈/폰트/위치를 실측해 반영합니다. 임의 변경 금지.
- 모바일 대응은 데스크톱 26개 섹션을 모두 끝낸 뒤 별도로 진행합니다.

## 픽셀 diff

구현 결과를 1440px로 스크린샷 찍어 `design/refs/`의 시안 PNG와 픽셀 단위로 비교합니다.
dev 서버가 떠 있어야 합니다.

```bash
node scripts/pixel-diff.mjs            # 전체 섹션
node scripts/pixel-diff.mjs 01-hero    # 특정 섹션만
node scripts/tune.mjs                  # CSS 후보값 A/B 비교 (보정용)
node scripts/measure-text.mjs          # 시안 잉크 폭으로 폰트 크기/굵기/자간 역산
```

결과는 `design/diff/`에 `<name>-actual.png`, `<name>-diff.png`로 떨어집니다.
`design/diff/*-actual.png`가 만들어진 뒤에는 요소별 잉크 좌표를 표로 대조할 수 있습니다.

```bash
PYTHONPATH=scripts python3 scripts/compare-ink.py
```

| 섹션 | 불일치 |
| --- | --- |
| `00-splash` | 0.036% |
| `01-hero` | 0.387% |
| `03-test` | 0.024% |
| `04-banner` | 0.059% |

남은 오차는 전부 Figma와 Chrome의 안티에일리어싱 차이입니다. 글자 크기·굵기·자간·
위치는 잉크 바운딩 박스 기준 ±1px 안에서 일치합니다.

## 아직 시안이 없는 섹션

`02` 섹션은 시안 확정 전이라 `SectionPlaceholder`로 1440 × 800 검정 블록만 잡아 뒀습니다.
`03_Test`의 600 × 768 검정 패널도 시안에 내용이 없어 단색 면으로만 두었습니다.
둘 다 시안이 나오면 그대로 교체하면 됩니다.

## 디자인 토큰

컬러·폰트·radius는 `src/app/globals.css`의 `@theme`에 모여 있습니다.
폰트 로더는 `src/lib/fonts.ts` 한 곳에만 있어서, 실제 브랜드 폰트를 받으면
그 파일만 `next/font/local`로 바꾸면 됩니다.

### 폰트 주의사항

시안은 데스크톱용 **Noto Sans CJK KR**로 작업됐습니다. 웹폰트 Noto Sans KR은
한글 글자 폭은 같지만 공백(U+0020)이 0.057em 더 넓어 어절 위치가 어긋납니다.
`.text-kr` 유틸리티가 `word-spacing: -0.057em`으로 이 차이를 보정합니다.
한글 텍스트에는 이 클래스를 함께 붙여 주세요.

## Supabase

`supabase/migrations/`에 스토리지 버킷 + RLS 정책과 자산 레지스트리 스키마가 있습니다.

| 버킷 | 공개 | 용량 제한 | 용도 |
| --- | --- | --- | --- |
| `brand` | ○ | 20MB | 로고 SVG, 파비콘, OG 이미지 |
| `images` | ○ | 30MB | 섹션 사진·일러스트 |
| `videos` | ○ | 500MB | 배경/데모 영상 (mp4, webm, mov) |
| `posters` | ○ | 10MB | 영상 첫 프레임 포스터 |
| `uploads` | ✕ | 50MB | 문의 첨부 등 비공개 업로드 |

코드에서는 경로 대신 `brand.wordmark` 같은 **asset key**로 참조합니다.
`public.site_asset_urls` 뷰가 완성된 public URL까지 만들어 줍니다.

적용 순서

1. `public.app_settings`의 `storage_public_base_url`에서 `<PROJECT_REF>`를 교체
2. `supabase/migrations/` 실행
3. Storage에 파일 업로드
4. `supabase/seed/` 실행
