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

export const experience = {
  /* 앞머리 "02 /" 만 산세리프, 뒤는 세리프입니다. (03_Test 시안 확대 확인) */
  eyebrow: { index: "02 /", label: "THE EXPERIENCE" },
  headline: ["주저하지 말고,", "지금 직접", "말을 건네보세요."],
  body: [
    "백 번의 설명보다 한 번의 대화가 더 명확하니까요.",
    "실제 매장에 문의하듯 자유롭게 질문을 입력해 보세요.",
    "다정하고 정교하게 응답합니다.",
  ],
} as const;

export const banner = {
  lines: ["24/7", "Intelligent AI", "Pre - Consultant"],
} as const;
