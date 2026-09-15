/**
 * 모바일 시안 아트보드 (390px).
 *
 * 소스 이미지는 해상도 대응용 2x 추출본.
 * CSS·img 의 width/height·sizes 에는 1x 표시 크기만 넣는다.
 * 예: 파일 700×760 → width={350} height={380} · sizes="350px"
 */
export const MOBILE_ARTBOARD_PX = 390;
/** 시안 좌우 거터 (390 − 20×2 = 콘텐츠 350) */
export const MOBILE_GUTTER_PX = 20;
export const MOBILE_CONTENT_PX = MOBILE_ARTBOARD_PX - MOBILE_GUTTER_PX * 2;
