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
node scripts/tune.mjs 카드              # 이름에 '카드' 가 든 실험만
node scripts/measure-text.mjs          # 시안 잉크 폭으로 폰트 크기/굵기/자간 역산
node scripts/fit-text.mjs              # 아직 구현 전인 글자를 시안 크롭과 직접 대조
PYTHONPATH=scripts python3 scripts/probe-section.py design/refs/05-key-benefits.png --blocks
```

결과는 `design/diff/`에 `<name>-actual.png`, `<name>-diff.png`로 떨어집니다.
`design/diff/*-actual.png`가 만들어진 뒤에는 요소별 잉크 좌표를 표로 대조할 수 있습니다.

```bash
PYTHONPATH=scripts python3 scripts/compare-ink.py        # 전부
PYTHONPATH=scripts python3 scripts/compare-ink.py 06-1   # 이름에 06-1 이 든 것만
```

| 섹션 | 불일치 | 허용치 |
| --- | --- | --- |
| `00-splash` | 0.036% | 0.08% |
| `01-hero` | 0.387% | 0.45% |
| `03-test` | 0.024% | 0.08% |
| `04-banner` | 0.059% | 0.12% |
| `05-key-benefits` | 0.618% | 0.70% |
| `06-1-process` | 0.436% | 0.50% |
| `06-2-process` | 0.083% | 0.50% |
| `06-3-process` | 0.241% | 0.50% |

글자 크기·굵기·자간·위치는 모든 섹션에서 잉크 바운딩 박스 기준 ±1px 안에 맞춰져 있고,
남은 오차는 Figma와 Chrome의 안티에일리어싱 차이입니다. 작은 한글이 많거나 가운데
정렬이라 글자가 소수점 좌표에 떨어지는 섹션일수록 이 값이 자연히 커져서, 허용치는
전역 하나가 아니라 섹션마다 둡니다.

## 아직 시안이 없거나 확정 전인 부분

`02` 섹션은 시안 확정 전이라 `SectionPlaceholder`로 1440 × 800 검정 블록만 잡아 뒀습니다.
`03_Test`의 600 × 768 검정 패널, `05`의 검정 카드 3장, `06`의 크림색 박스도 시안에
내용이 없어 단색 면으로만 두었습니다.

`05`의 세 번째 카드 문구는 시안에서 화면 오른쪽으로 잘려 있어 읽히는 데까지만
`src/content/site.ts`에 옮겼습니다. 전문을 받으면 그 항목만 채우면 됩니다.

## 모션

시안에 모션 스펙이 없어 아래 두 가지는 동작 방식만 확정하고 수치는 최소한으로 잡았습니다.

- `05_Key Benefits` 카드 줄 — 가로 드래그·스크롤. 좌거터 120에서 시작해 3장(500 + 간격 33)이
  1440 밖으로 흘러넘치고, 스크롤 0 위치가 시안 그대로입니다.
- `06_The Process` — 세 상태를 5초 주기로 무한 순환합니다. 한 장이 배경까지 통째로
  오른쪽에서 들어와 왼쪽으로 빠지고(0.7초), 왼쪽으로 빠진 장은 화면 밖에서 전환 없이
  오른쪽 대기 위치로 돌아가므로 눈에 보이는 방향은 항상 오른쪽 → 왼쪽 하나뿐입니다.
  `prefers-reduced-motion` 이면 미끄러지지 않고 즉시 바뀝니다.

## 디자인 토큰

컬러·폰트·radius는 `src/app/globals.css`의 `@theme`에 모여 있습니다.
폰트 로더는 `src/lib/fonts.ts` 한 곳에만 있어서, 실제 브랜드 폰트를 받으면
그 파일만 `next/font/local`로 바꾸면 됩니다.

### 폰트 주의사항

시안은 데스크톱용 **Noto Sans CJK KR**로 작업됐습니다. 웹폰트 Noto Sans KR은
한글 글자 폭은 같지만 공백(U+0020)이 0.057em 더 넓어 어절 위치가 어긋납니다.
`.text-kr` 유틸리티가 `word-spacing: -0.057em`으로 이 차이를 보정합니다.
한글 텍스트에는 이 클래스를 함께 붙여 주세요.

영문 세리프는 **Playfair Display로 대체**한 것입니다. 시안 원본 서체는 낱글자를
캡하이트로 정규화해 비교하면 둥근 글자(`O` `D` `C`)는 Playfair와 거의 같은데
세로획 글자가 더 좁습니다(`H` 43 대 49, `I` 15 대 19, `T` 36 대 41). 27px대에서는
차이가 묻히지만 `06`의 66px에서는 드러나서, **단어 덩어리의 폭이 시안과 맞도록**
크기를 잡았습니다. 그래서 글자 높이가 시안보다 4~5px 낮습니다.
원본 서체 파일을 받으면 `src/lib/fonts.ts`만 바꾸고 각 섹션의 크기를 다시 재면 됩니다.

`06`의 `STEP N` 은 Playfair 기본 숫자가 올드스타일(높이가 낮고 `3` 이 베이스라인
아래로 내려감)이라 `font-variant-numeric: lining-nums` 를 함께 겁니다.

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
