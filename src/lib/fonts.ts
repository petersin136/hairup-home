import { Inter, Noto_Sans_KR, Playfair_Display } from "next/font/google";

/**
 * 프로젝트에서 쓰는 폰트는 전부 여기서만 정의합니다.
 * 실제 브랜드 폰트 파일을 받으면 이 파일의 로더만 next/font/local 로 바꾸면
 * 나머지 코드는 그대로 둬도 됩니다.
 */

/** 영문 세리프 — 로고 워드마크, HAIR UP FOR PROFESSIONALS 같은 영문 아이브로우 */
export const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-playfair",
  display: "swap",
});

/** 영문 산세리프 — AUTOMATED SALON AI 등 */
export const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

/**
 * 한글 본문 전반.
 * next/font 타입에 아직 korean 서브셋이 없지만 Google Fonts 는 제공하므로
 * 한글 글리프까지 확실히 내려받도록 명시합니다.
 */
export const notoSansKr = Noto_Sans_KR({
  subsets: ["korean" as "latin", "latin"],
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-noto-sans-kr",
  display: "swap",
});

export const fontVariables = [
  playfairDisplay.variable,
  inter.variable,
  notoSansKr.variable,
].join(" ");
