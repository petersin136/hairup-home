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

export const keyBenefits = {
  eyebrow: { index: "03 /", label: "KEY BENEFITS" },
  headline: ["고객은 기다리지 않고,", "당신은 끊기지 않도록."],
  body: [
    "24시간 언제든 이어지는 응대.",
    "고객의 질문과 디자이너의 작업 시간이 서로를 기다릴 필요 없이",
    "완벽하게 맞아떨어집니다.",
  ],
  cards: [
    {
      title: ["첫째,", "맥락을 아는 디테일한 상담"],
      body: [
        "‘요즘 이 드라마 여주인공 머리 하고 싶은데",
        "저한테 어울릴까요?’ 같은 사소한 질문에도",
        "AI가 자연스럽게 제안하고 추천합니다.",
      ],
    },
    {
      title: ["둘째,", "대화를 통한 자동 예약"],
      body: [
        "시술 소요 시간과 실시간 예약을 정교하게 계산해",
        "가능한 시간을 안내합니다.",
        "고객이 “그럼 그때로 할게요” 한마디면 끝납니다.",
      ],
    },
    {
      /* 세 번째 카드는 시안에서 오른쪽이 잘려 있어 읽히는 데까지만 옮겼습니다.
         전문을 받으면 이 항목만 채우면 됩니다. */
      title: ["셋째,", "알아서 정리되는 장"],
      body: [
        "예약이 확정되는 순간, 관리자 화",
        "정리됩니다. 손으로 옮겨 적는 번",
        "이제 완전히 사라집니다.",
      ],
    },
  ],
} as const;

export const templateCollection = {
  eyebrow: { index: "04 /", label: "TEMPLATE COLLECTION" },
  headline: ["수많은 디자이너 중", "하나가 아닌", "단 하나의 브랜드로."],
  body: [
    "플랫폼의 획일화된 목록 속에서는 당신의 미학을 온전히 보여줄 수 없습니다.",
    "당신의 작업, 당신의 색, 당신의 이야기를 담은",
    "독점 페이지로 고객에게 깊은 인상을 남기세요.",
  ],
  cta: "VIEW DEMO",
  /*
   * 대문 이미지는 scripts/capture-templates.mjs 로 각 데모 사이트의 첫 화면을
   * 1600 × 1000 으로 찍어 둔 것입니다. 사이트가 바뀌면 다시 돌리면 됩니다.
   * 01 만 시안에 이름이 적혀 있고, 02·03 이름은 확정 전 임시값입니다.
   */
  templates: [
    {
      index: "01",
      name: "Studio Signature",
      href: "https://maranathahomepage.vercel.app/",
      image: "/templates/studio-signature.webp",
    },
    {
      index: "02",
      name: "Editorial Portrait",
      href: "https://hair-up-template-2.vercel.app/",
      image: "/templates/editorial-portrait.webp",
    },
    {
      index: "03",
      name: "Elevate Studio",
      href: "https://hairup-template3.vercel.app/",
      image: "/templates/elevate-studio.webp",
    },
  ],
  /* 시안에서 양끝 문구가 잘려 있어 첫 단어와 마지막 문구는 추정입니다. */
  marquee: [
    "PURE DESIGN FOCUS",
    "UNINTERRUPTED CRAFT",
    "AI SALON SUPPORT",
    "EFFORTLESS BOOKING",
  ],
} as const;

export const process = {
  eyebrow: ["THE", "PROCESS"],
  steps: [
    {
      step: "STEP 1",
      counter: "1/3",
      caption: "DISCOVERY",
      label: "발견",
      body: [
        "피드 속에서 마음에 드는",
        "헤어 스타일을 찾다가",
        "당신의 작업물을 발견합니다",
      ],
    },
    {
      step: "STEP 2",
      counter: "2/3",
      caption: "INQUIRY",
      label: "상담",
      body: [
        "프로필의 24시간 예약·상담",
        "링크를 누르면 카카오톡으로",
        "연결되어 AI와 대화가 시작됩니다.",
      ],
    },
    {
      step: "STEP 3",
      counter: "3/3",
      caption: "BOOKING",
      label: "확정",
      body: [
        "상담부터 예약금 입금까지",
        "한꺼번에 완료.",
        "당신은 확정된 손님만 반갑게",
        "맞이하면 됩니다.",
      ],
    },
  ],
} as const;
