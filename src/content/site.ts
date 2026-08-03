/** 사이트 카피/메뉴는 전부 여기서 관리합니다. */

export const nav = [
  { label: "AI실장", href: "#ai-manager" },
  { label: "템플릿", href: "#template" },
  { label: "멤버십 요금", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
] as const;

export const cta = {
  label: "내 브랜드 만들기",
  href: "#start",
} as const;

export const splash = {
  eyebrow: "AUTOMATED SALON AI",
} as const;

export const hero = {
  /* 시안의 넓은 어절 간격을 유지하려고 공백을 두 칸 씁니다. (white-space: pre) */
  eyebrow: "HAIR UP  FOR  PROFESSIONALS",
  headline: ["가위를 든 순간에도,", "오롯이 작업에만."],
  body: [
    "고객과의 대화부터 예약, 장부 정리까지.",
    "헤어업 AI가 감각적으로 처리합니다.",
    "당신은 그저, 오늘 최고의 헤어 스타일링에만 집중하세요.",
  ],
} as const;
