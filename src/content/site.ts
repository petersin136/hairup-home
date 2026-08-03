/** 사이트 카피/메뉴는 전부 여기서 관리합니다. */

/*
 * 헤더 메뉴와 CTA 는 영문을 기본으로 두고, 가리키면 한글로 굴러 바뀝니다.
 * 영문 표기는 시안에 없어 한글 뜻에 맞춰 새로 정한 값입니다.
 */
export const nav = [
  { en: "AI MANAGER", ko: "AI실장", href: "#ai-manager" },
  { en: "TEMPLATE", ko: "템플릿", href: "#template" },
  { en: "PRICING", ko: "멤버십 요금", href: "#pricing" },
  { en: "FAQ", ko: "FAQ", href: "#faq" },
] as const;

export const cta = {
  en: "CREATE MY BRAND",
  ko: "내 브랜드 만들기",
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

export const dilemma = {
  eyebrow: { index: "01 /", label: "THE DILEMMA" },
  headline: ["가위를 들었을 때,", "휴대폰이 울리면?"],
  body: [
    "약제 묻은 장갑을 벗고 답장할 수 없고,",
    "체어 앞 고객을 두고 전화를 받을 수도 없는 순간들.",
    "“얼마예요?”만 묻고 사라지는 단발성 문의와",
    "어처구니 없는 노쇼까지.",
  ],
  bodyAside: [
    "여러분의 소중한 작업시간이",
    "온갖 응대 스트레스에 깎여나가고 있진 않나요?",
  ],
  /* 이미지 박스는 나중에 Supabase URL 로 채웁니다. 지금은 검정 면만. */
  floats: {
    brand: "hair up",
    smart: "SMART AI",
    realtime: "24/7 REAL-TIME",
    zero: "ZERO STRESS",
    solution: "SOLUTION",
  },
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
    {
      /* 네 번째 카드는 시안 밖이라 문구가 없습니다. 아래는 자리를 잡아 두려고
         앞 세 장의 흐름(상담 → 예약 → 정리)에 이어 임시로 적은 것입니다. */
      title: ["넷째,", "놓치지 않는 재방문 관리"],
      body: [
        "다녀간 고객에게 다음 시기를 먼저 알립니다.",
        "지난 시술 기록을 그대로 이어받아",
        "다시 찾는 이유를 만들어 줍니다.",
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

/*
 * 10_FAQ — 시안 표기는 07 / FAQ. 호버하면 해당 칸이 답변 면으로 뒤집어집니다.
 * 답변 면 배경은 Q1·Q5 forest / Q2·Q6 clay / Q3·Q4 espresso.
 */
export const faq = {
  eyebrow: { index: "07 /", label: "FAQ" },
  headline: ["시작은 쉽고,", "변화는 빠르고 선명하게."],
  body: [
    "처음이어도 망설일 필요 없습니다.",
    "헤어업은 사용하기 쉽고, 몇 가지 설정만으로 간단하게 시작할 수 있습니다.",
  ],
  items: [
    {
      q: "Q1.",
      question: ["AI가 정말", "사람처럼", "대답하나요?"],
      answerTitle: "그럼요!",
      answer: [
        "실제 헤어샵의 상담 데이터와",
        "답변 패턴을 학습하여",
        "단순 키워드가 아닌",
        "질문의 맥락을 정확히",
        "이해하고 응대합니다.",
      ],
      tone: "forest",
    },
    {
      q: "Q2.",
      question: ["세팅하는", "시간은 얼마나", "걸리나요?"],
      answerTitle: "단 일주일!",
      answer: [
        "원하시는 템플릿을 선택한 뒤,",
        "매장정보와 사진을",
        "전달해 주시면, 이를 바탕으로",
        "일주일 내에 맞춤 세팅을",
        "진행해 드립니다.",
      ],
      tone: "clay",
    },
    {
      q: "Q3.",
      question: ["내 인스타그램,", "기존 예약이랑", "같이 사용할 수", "있나요?"],
      answerTitle: "당연하죠!",
      answer: [
        "현재 사용 중이신 SNS는 물론,",
        "기존 예약 채널과 완벽히",
        "호환되어 통합 관리가",
        "가능합니다.",
      ],
      tone: "espresso",
    },
    {
      q: "Q4.",
      question: ["예약금은", "어떻게", "결제/환불", "되나요?"],
      answerTitle: "자동처리!",
      answer: [
        "매장에서 직접 설정한",
        "환불 및 노쇼 규정에 따라,",
        "AI가 예약금 안내부터",
        "결제 확인까지 알아서",
        "정산 처리합니다.",
      ],
      tone: "espresso",
    },
    {
      q: "Q5.",
      question: ["기계에", "서툴러도", "괜찮을까요?"],
      answerTitle: "누구나 쉽게!",
      answer: [
        "스마트폰을 사용할 줄",
        "아시는 분이라면",
        "별도 학습없이 바로 운영하실 수",
        "있을 만큼 직관적이고",
        "쉬운 UI로 제작되었습니다.",
      ],
      tone: "forest",
    },
    {
      q: "Q6.",
      question: ["필요할 때 제가", "직접 고객과", "대화할 수도", "있나요?"],
      answerTitle: "즉시 전환!",
      answer: [
        "버튼 하나로 언제든지",
        "수동 응대 모드로",
        "전환할 수 있으며,",
        "사진 확인이나 특이사항 문의는",
        "실시간 알림을 보내드립니다.",
      ],
      tone: "clay",
    },
  ],
} as const;

/** 11_CTA — 헤더 CREATE MY BRAND 가 가리키는 #start */
export const start = {
  floats: [
    { text: "BESPOKE", left: 120, top: 150 },
    { text: "1:1 SETUP", left: 419, top: 413 },
    { text: "SMART ASSISTANT", left: 719, top: 507 },
    { text: "HAIR UP AI", left: 1202, top: 722 },
  ],
  headline: ["감각은 온전히,", "비즈니스는 유용하게."],
  body: [
    "당신의 실력은 이미 충분합니다.",
    "이제 그 실력이 온전히 빛나도록 나머지는 헤어업이 하겠습니다.",
  ],
  cta: {
    label: "1:1 맞춤 세팅 상담하기",
    href: "#",
  },
} as const;
