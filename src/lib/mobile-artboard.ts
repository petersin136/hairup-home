/**
 * 모바일 시안 아트보드.
 *
 * 기존 작업 기준 375px → 390px (iPhone 14/15 CSS 논리 폭).
 * 소스 이미지는 해상도 대응용 2x 추출본. CSS·img 에는 1x 표시 크기만 넣는다.
 * 예: 파일 780×560 → width/height 또는 sizes 는 390×280.
 */
export const MOBILE_ARTBOARD_PX = 390;
export const MOBILE_GUTTER_PX = 16;
export const MOBILE_CONTENT_PX = MOBILE_ARTBOARD_PX - MOBILE_GUTTER_PX * 2;
