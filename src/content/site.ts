/** 사이트 카피/메뉴는 전부 여기서 관리합니다. */

/*
 * 헤더 메뉴와 CTA 는 영문을 기본으로 두고, 가리키면 한글로 굴러 바뀝니다.
 * 영문 표기는 시안에 없어 한글 뜻에 맞춰 새로 정한 값입니다.
 */
export const nav = [
  { en: "AI MANAGER", ko: "AI 매니저", href: "#ai-manager" },
  { en: "TEMPLATES", ko: "템플릿", href: "#template" },
  { en: "PRICING", ko: "요금안내", href: "#pricing" },
  { en: "FAQ", ko: "FAQ", href: "#faq" },
] as const;

export const cta = {
  en: "CREATE BRAND",
  ko: "내 브랜드 만들기",
  href: "#pricing",
} as const;

/** GNB 우측 — hu_GNB_PC · LOGIN 도 메뉴와 동일 스타일, 호버 시 한글 */
export const login = {
  en: "LOGIN",
  ko: "로그인",
  href: "#",
} as const;

/** 헤더 위 띠배너 — hu_TOP_BANNER__PC / hu_TOP_BANNER__M */
export const topBanner = {
  en: "ONBOARDING OFFER",
  kr: "1:1 맞춤 세팅비 최대 40% 지원 (선착순)",
  krMobile: "1:1 맞춤 세팅비 최대 40% 지원",
} as const;

/** 런치 오퍼 팝업 — 시안 POPUP · 440 × 600 */
export const launchPopup = {
  image: "/images/popup-top.png",
  desc: [
    "우리 헤어샵을 위해 정교하게 맞춰지는 AI 살롱 매니저.",
    "완성도 높은 첫 시작을 위한 1:1 맞춤 세팅 오퍼를 제안합니다.",
  ],
  benefit: {
    upto: "Up to",
    num: "40",
    unit: "%",
    limited: "(선착순 한정)",
  },
  cta: {
    label: "1:1 맞춤 세팅 상담하기",
    href: "https://pf.kakao.com/_xlfqiX/chat",
  },
} as const;

export const splash = {
  eyebrow: "THE 24/7 AI SALON MANAGER",
} as const;

export const hero = {
  eyebrow: "HAIR UP FOR PROFESSIONALS",
  headline: ["가위를 든 순간에도,", "오롯이 작업에만."],
  body: [
    "고객과의 대화부터 예약, 장부 정리까지.",
    "헤어업 AI 매니저가 감각적으로 처리합니다.",
    "당신은 그저, 오늘 최고의 헤어 스타일링에만 집중하세요.",
  ],
} as const;

export const dilemma = {
  eyebrow: { index: "01 /", label: "THE DILEMMA" },
  /** PC 시안 .DILEMMA-TAG — the 만 소문자 이탤릭 */
  tag: {
    before: "( 01. ",
    article: "the",
    after: " DILEMMA )",
  },
  headline: ["가위를 들었을 때,", "휴대폰이 울리면?"],
  body: [
    "약제 묻은 장갑을 벗고 답장할 수 없고,",
    "체어 앞 고객을 두고 전화를 받을 수도 없는 순간들.",
    "“얼마예요?”만 묻고 사라지는 단발성 문의와",
    "어처구니 없는 노쇼까지.",
  ],
  /** PC 시안 .DILEMMA-DESC 3행 — 마지막 두 줄을 한 줄로 */
  bodyPc: [
    "약제 묻은 장갑을 벗고 답장할 수 없고,",
    "체어 앞 고객을 두고 전화를 받을 수도 없는 순간들.",
    "“얼마예요?”만 묻고 사라지는 단발성 문의와 어처구니 없는 노쇼까지.",
  ],
  bodyAside: [
    "여러분의 소중한 작업시간이",
    "온갖 응대 스트레스에 깎여나가고 있진 않나요?",
  ],
  /* 위→아래(우상 · 좌중 · 우하) 순서 */
  images: [
    "/dilemma/01-cut.png",
    "/dilemma/02-call.png",
    "/dilemma/03-salon.png",
  ],
  floats: {
    smart: { sub: "hair up", label: "SMART AI" },
    realtime: { sub: "24/7", label: "REAL TIME" },
    zero: { sub: "0", label: "ZERO STRESS" },
    solution: "SOLUTION",
  },
} as const;

export const experience = {
  /* 앞머리 "02 /" 만 산세리프, 뒤는 세리프입니다. */
  eyebrow: { index: "02 /", label: "THE EXPERIENCE" },
  /** PC 시안 .EXPERIENCE-TAG — the 만 소문자 이탤릭 */
  tag: {
    before: "( 02. ",
    article: "the",
    after: " EXPERIENCE )",
  },
  headline: ["주저하지 말고,", "지금 직접", "말을 건네보세요."],
  headlinePc: ["카카오톡으로", "직접 말을 걸어보세요."],
  body: [
    "실제 매장에 문의하듯 자유롭게 질문을 입력해 보세요.",
    "다정하고 정교하게 응답합니다.",
  ],
  bodyPc: [
    "고객의 문의에 AI 매니저가 어떻게 응답하는지",
    "실제 헤어업 데모 채널에서 바로 확인해 보세요.",
  ],
  kakaoDemo: {
    label: "카카오톡 데모 체험하기",
    href: "https://pf.kakao.com/_xlfqiX/chat",
  },
  tryAsking: {
    title: "TRY ASKING.",
    body: [
      "어떤 질문부터 시작할지 막막하다면,",
      "고객들이 가장 많이 거치는 대화 흐름대로 경험해 보세요.",
    ],
  },
  accents: ["24/7 REAL TIME", "° ZERO STRESS", "SOLUTION"],
  examples: [
    "여성 컷은 얼마인가요?",
    "내일 예약 가능할까요?",
    "단발에 어울리는 펌 추천해 주세요.",
    "첫 방문 할인이 있나요?",
  ],
} as const;

export const banner = {
  lines: ["24/7", "INTELLIGENT AI", "PRE - CONSULTANT"],
} as const;

export const automatedCrm = {
  tag: "( 03. AUTOMATED CRM )",
  headline: ["상담부터 예약까지", "알아서 척척."],
  body: [
    "상담했던 모든 문의가 대시보드에 즉시 데이터로 쌓입니다.",
    "누락 없이 깔끔한 자동화로 매장 관리의 피로도를 줄여드립니다.",
  ],
  systems: [
    {
      index: "SYSTEM 01",
      title: ["대화가 끝나면", "알아서 쌓이는 데이터"],
      body: [
        "고객과의 채팅 상담이 완료되는 순간, 수기 입력 없이 대기 목록에 실시간으로",
        "자동 기록됩니다. 날짜, 시간, 담당 디자이너, 시술 메뉴까지 AI 실장이 스스로 정리합니다.",
      ],
    },
    {
      index: "SYSTEM 02",
      title: ["입금 확인부터", "노쇼 관리까지 한곳에"],
      body: [
        "예약금 입금이 확인되면 '확정' 상태로 즉시 전환됩니다.",
        "시술 완료 내역은 물론 취소·노쇼 내역까지 한눈에 분류하여 매장 관리의 피로도를 낮춥니다.",
      ],
    },
    {
      index: "SYSTEM 03",
      title: ["직관적으로 파악하는", "매장 전체 스케줄"],
      body: [
        "월간 및 주간 단위의 시각적 스케줄 확인은 물론, 디자이너별 개인 휴무와 예약 현황을",
        "필터링하여 우측 상세 패널에서 한눈에 확인합니다.",
      ],
    },
    {
      index: "SYSTEM 04",
      title: ["디자이너 직급에 맞춘", "유연한 단가 제어"],
      body: [
        "시술별 소요 시간과 예약금 설정은 기본, 디자이너의 경력과 직급에 맞춘 개별 차등",
        "단가를 자유롭게 지정하고 사이트에 실시간으로 반영합니다.",
      ],
    },
  ],
} as const;

export const keyBenefits = {
  /** PC 시안 — Key 만 이탤릭 (uppercase 예외) */
  tag: {
    before: "( 04. ",
    article: "Key",
    after: " BENEFITS )",
  },
  headline: ["고객은 기다리지 않고,", "당신은 끊기지 않도록."],
  body: [
    "24시간 언제든 이어지는 응대.",
    "고객의 질문과 디자이너의 작업 시간이",
    "서로를 기다릴 필요 없이 완벽하게 맞아떨어집니다.",
  ],
  cards: [
    {
      title: "맥락을 아는 디테일한 상담",
      body: [
        "‘요즘 이 드라마 여주인공 머리 하고 싶은데 저한테 어울릴까요?’ 같은",
        "사소한 질문에도 AI가 자연스럽게 제안하고 추천합니다.",
      ],
      image: "/key-benefits/01-consult.png",
    },
    {
      title: "대화를 통한 자동 예약",
      body: [
        "시술 소요 시간과 실시간 예약을 정교하게 계산해 가능한 시간을 안내합니다.",
        "고객이 “그럼 그때로 할게요” 한마디면 끝납니다.",
      ],
      image: "/key-benefits/02-booking.png",
    },
    {
      title: "알아서 정리되는 장부",
      body: [
        "예약이 확정되는 순간, 관리자 화면에 차곡차곡 정리됩니다.",
        "손으로 옮겨 적는 번거로운 과정은 이제 완전히 사라집니다.",
      ],
      image: "/key-benefits/03-ledger.png",
    },
    {
      title: "노쇼 방지 안심 예약금",
      body: [
        "진짜 방문할 고객만 예약금을 걸고 확정됩니다.",
        "오지 않을 문의로 낭비하던 시간과 감정을 되찾으세요.",
      ],
      image: "/key-benefits/04-deposit.png",
    },
  ],
} as const;

export const templateCollection = {
  /** PC — Dilemma 와 동일 SECTION-TAG · the 이탤릭 */
  tag: {
    before: "( 05. ",
    article: "the",
    after: " TEMPLATE COLLECTION )",
  },
  headline: ["수많은 디자이너 중", "하나가 아닌", "단 하나의 브랜드로."],
  body: [
    "플랫폼의 획일화된 목록 속에서는 당신의 미학을 온전히 보여줄 수 없습니다.",
    "당신의 작업, 당신의 색, 당신의 이야기를 담은",
    "독점 페이지로 고객에게 깊은 인상을 남기세요.",
  ],
  ctas: {
    pc: "VIEW ON PC",
    mobile: "VIEW ON MOBILE",
  },
  /*
   * 대문 이미지는 scripts/capture-templates.mjs 로 각 데모 사이트의 첫 화면을
   * 1600 × 1000 으로 찍어 둔 것입니다. 사이트가 바뀌면 다시 돌리면 됩니다.
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
      name: "Studio Lookbook",
      href: "https://hair-up-template-2.vercel.app/",
      image: "/templates/editorial-portrait.webp",
    },
    {
      index: "03",
      name: "Studio Neutral",
      href: "https://hairup-template3.vercel.app/",
      image: "/templates/elevate-studio.webp",
    },
  ],
  /* hu_MARQUEE_DETAIL_PC */
  marquee: [
    "ALWAYS OPEN, ALWAYS READY",
    "THE 24/7 AI SALON MANAGER",
    "STAY IN YOUR FLOW",
  ],
} as const;

/*
 * 10_FAQ — PC 시안 hu_FAQ_PC (아코디언) · 모바일은 items 카드.
 * 섹션 번호는 사이트 순서 07. 카피·리스트는 시안.
 */
export type FaqAnswerBlock =
  | { t: "p"; text: string }
  | { t: "pg"; text: string }
  | { t: "h"; text: string }
  | { t: "li"; text: string }
  | { t: "eq"; text: string };

export const faq = {
  /** PC — Pricing / Template 과 동일 SECTION-TAG · the 이탤릭 */
  tag: {
    before: "( 07. ",
    article: "the",
    after: " FAQ )",
  },
  headline: ["시작은 간단하게.", "운영은 편리하게."],
  body: [
    "처음 사용하는 경우에도 복잡한 준비는 필요하지 않습니다.",
    "몇 가지 기본 정보와 운영 방식을 전달해주시면",
    "헤어샵에 맞춰 필요한 설정을 진행합니다.",
  ],
  list: [
    {
      category: "SETUP",
      question: "세팅 절차와 제작 소요 기간은 어떻게 되나요?",
      answer: [
        { t: "p", text: "모든 플랜은 기초 문진을 통해 헤어샵의 시술 체계와 운영 방식을 파악한 후 세팅됩니다." },
        { t: "h", text: "• 스타터 플랜 (영업일 기준 5~7일 소요)" },
        { t: "li", text: "- 스타터 플랜 선택 및 결제" },
        { t: "li", text: "- 운영 체계 파악을 위한 세팅 인터뷰 진행" },
        { t: "li", text: "- 카카오톡 채널 내 AI 살롱 매니저 세팅" },
        { t: "h", text: "• 브랜딩 플랜 (자료 수급 완료 후 영업일 기준 7~10일 소요)" },
        { t: "li", text: "- 브랜딩 플랜 및 웹 쇼룸 템플릿 선택" },
        { t: "li", text: "- 온라인 약관 동의 및 결제" },
        { t: "li", text: "- 운영 체계 파악을 위한 세팅 인터뷰 진행" },
        { t: "li", text: "- 템플릿에 필요한 정보와 자료 사양 안내(이미지 수량, 문구 등)" },
        { t: "li", text: "- 자료 접수 완료 후 단독 웹 쇼룸 구축 및 카카오톡 AI 매니저 연동" },
      ] satisfies FaqAnswerBlock[],
    },
    {
      category: "INTEGRATION",
      question: "AI 연동 방식과 직접 응대 방법은 어떻게 되나요?",
      answer: [
        { t: "p", text: "헤어업 AI 살롱 매니저는 카카오톡 채널 기반으로 작동하며, 브랜딩 플랜의 단독 웹 쇼룸에는 카카오톡 위젯이 기본으로 탑재됩니다." },
        { t: "pg", text: "직접 소통이나 사진 확인이 필요할 때는 별도의 모드 변경 없이 관리자 카카오톡 채널 채팅방에 참여하여 고객과 직접 대화할 수 있습니다." },
      ] satisfies FaqAnswerBlock[],
    },
    {
      category: "CONNECT",
      question: "네이버 플레이스 및 인스타그램 연동이 가능한가요?",
      answer: [
        { t: "p", text: "네, 가능합니다." },
        { t: "p", text: "네이버 플레이스 예약 링크나 인스타그램 프로필 링크에 헤어업 단독 웹 쇼룸 주소 또는 AI 살롱 매니저 카카오톡 채널 링크를 연결할 수 있습니다." },
        { t: "p", text: "타사 예약 플랫폼과 직접 연동되는 방식이 아닌, 외부 링크를 연결하는 방식입니다." },
      ] satisfies FaqAnswerBlock[],
    },
    {
      category: "PAYMENT",
      question: "예약금 결제와 노쇼 / 환불 처리는 어떻게 되나요?",
      answer: [
        { t: "p", text: "헤어샵에서 설정한 환불 및 노쇼 규정에 따라 AI 매니저가 예약금 안내부터 결제 확인, 취소 정책 안내까지 처리합니다. 시술 중에도 별도로 계좌를 확인하거나 예약금을 안내하지 않아도 예약금 관련 안내와 확인이 가능합니다." },
      ] satisfies FaqAnswerBlock[],
    },
    {
      category: "OPERATION",
      question: "디지털 기기 조작에 서툴러도 직접 운영할 수 있나요?",
      answer: [
        { t: "p", text: "가능합니다. 초기 구축부터 시나리오 설정까지 헤어업에서 진행한 후 전달해 드립니다." },
        { t: "p", text: "이후 예약 확인 및 관리는 스마트폰의 카카오톡 채널 관리자 앱에서 직접 하실 수 있습니다." },
      ] satisfies FaqAnswerBlock[],
    },
    {
      category: "UPDATE",
      question: "매장 정보나 사진 변경 시 유지보수 기준은 어떻게 되나요?",
      answer: [
        { t: "p", text: "브랜딩 플랜은 구독 기간 동안 아래 기준에 따라 무상 수정이 제공됩니다." },
        { t: "h", text: "• 상시 무상 수정 (구독 기간 내 무제한)" },
        { t: "li", text: "- 시술 가격표 / 메뉴명 / 푸터 정보 등 단순 텍스트 변경" },
        { t: "li", text: "- 퇴사 디자이너 비활성화" },
        { t: "li", text: "- 기존 템플릿 내 특정 섹션 삭제 (타 템플릿 섹션 이식 및 교차 혼합 불가)" },
        { t: "h", text: "• 연 5회 무상 수정 (서비스 개시일 기준 1년 단위 / 미사용분 이월 불가)" },
        { t: "li", text: "- 매장 인테리어, 시술 사진, 디자이너 프로필 사진 교체" },
        { t: "li", text: "- 브랜드 소개 및 BOOKING 섹션 안내 문구 변경" },
        { t: "li", text: "- 띠배너 공지 수정, 리뷰 업데이트, 신규 디자이너 추가" },
        { t: "eq", text: "= 단위 작업 1건당 1회 차감" },
        { t: "h", text: "• 유상 수정" },
        { t: "li", text: "- 연 5회 소진 후 추가 작업 시 건당 3만원(VAT 별도)" },
      ] satisfies FaqAnswerBlock[],
    },
    {
      category: "SWITCH",
      question: "이용 중 플랜 전환이나 템플릿 교체가 가능한가요?",
      answer: [
        { t: "p", text: "네, 언제든지 전환 및 변경이 가능합니다." },
        { t: "h", text: "• 브랜딩 플랜으로 전환" },
        { t: "p", text: "단독 웹 쇼룸 구축 및 1:1 맞춤 디렉팅을 위한 추가 세팅비 150만원(VAT 별도) 결제 후 진행됩니다." },
        { t: "h", text: "• 브랜딩 템플릿 전체 변경" },
        { t: "p", text: "다른 디자인 템플릿으로 전체 리뉴얼을 원하실 경우 50만원(VAT 별도)의 추가 세팅비가 적용됩니다." },
      ] satisfies FaqAnswerBlock[],
    },
    {
      category: "BILLING",
      question: "연간 결제 혜택과 세금계산서 발행 기준은 어떻게 되나요?",
      answer: [
        { t: "h", text: "• 연간 결제 혜택" },
        { t: "p", text: "1년 구독 결제 시 연 79만원(VAT 별도)으로 이용할 수 있습니다." },
        { t: "p", text: "매월 결제 시 연 948,000원으로, 연간 결제 시 158,000원이 절감됩니다." },
        { t: "h", text: "• 증빙 안내" },
        { t: "p", text: "모든 세팅비와 구독료는 부가세(VAT) 별도이며, 결제 시 사업자등록증을 전달해 주시면 전자세금계산서가 발행됩니다." },
      ] satisfies FaqAnswerBlock[],
    },
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

/** 06_Pricing Plan — hu_PRICING_PC · GNB PRICING → #pricing */
export const pricing = {
  /** PC — hu_PRICING_DETAIL_PC_01 `( 06. PRICING Plan )` · 모바일은 before/article/after */
  tag: {
    text: "( 06. PRICING Plan )",
    before: "( 06. ",
    article: "the",
    after: " PRICING PLAN )",
  },
  headline: ["매출이 아무리 늘어도,", "비용은 변함없이."],
  body: [
    "예약 건수나 매출에 따른 추가 수수료는 없습니다.",
    "모든 플랜은 고정된 월 이용료로만 운영됩니다.",
  ],
  starter: {
    name: "STARTER PLAN",
    tagline: ["24시간 쉬지 않고,", "손님을 맞이하는 전담 예약 매니저."],
    prices: [
      { num: "100", unit: "만원", label: "초기 세팅비 1회" },
      { num: "7.9", unit: "만원", label: "월 구독료" },
    ],
    features: [
      {
        title: "자율형 AI 카카오 상담",
        desc: ["문맥을 스스로 이해하고 예약을 확정하는 지능형 AI"],
      },
      {
        title: "실시간 자동 연동 CRM",
        desc: ["상담 내역, 예약 일정, 손님 정보를 수기 없이 자동 정리"],
      },
      {
        title: "스마트 고객 케어",
        desc: ["예약 확정 및 방문 전 유의사항 안내 메시지 자동 발송"],
      },
    ],
    cta: {
      labelEn: "GET STARTED",
      label: "스타터 플랜 시작하기",
      href: "https://pf.kakao.com/_xlfqiX/chat",
    },
  },
  branding: {
    name: "BRAND PLAN",
    badge: "/ RECOMMEND",
    tagline: [
      "매장의 브랜드 가치를 완성하는",
      "단독 웹 쇼룸과 통합 예약 시스템.",
    ],
    prices: [
      { num: "200", unit: "만원", label: "초기 세팅비 1회" },
      { num: "7.9", unit: "만원", label: "월 구독료" },
    ],
    features: [
      {
        title: "스타터 플랜 전 기능 포함",
        desc: ["24시간 AI 자동 상담 및 실시간 CRM 자동 수집 기본 탑재"],
        descMobile: [
          "24시간 AI 자동 상담 및",
          "실시간 CRM 자동 수집 기본 탑재",
        ],
      },
      {
        title: "단독 브랜드 렌딩페이지",
        desc: ["시술 철학과 포트폴리오를 감각적으로 담아내는 전용 웹 쇼룸"],
        descMobile: [
          "시술 철학과 포트폴리오를",
          "감각적으로 담아내는 전용 웹 쇼룸",
        ],
      },
      {
        title: "검색엔진 최적화(SEO)",
        desc: ["네이버 · 구글 포털 검색 시 매장 브랜드 안정적 노출"],
        descMobile: [
          "네이버 · 구글 포털 검색 시",
          "매장 브랜드 안정적 노출",
        ],
      },
      {
        title: "웹 전용 카카오 AI 연동 위젯",
        desc: ["클릭 한 번으로 매장 카카오 채널에 연결되어 AI 매니저와 상담·예약"],
        descMobile: [
          "클릭 한 번으로 매장 카카오 채널에 연결되어",
          "AI 매니저와 상담·예약",
        ],
      },
    ],
    cta: {
      labelEn: "GET STARTED",
      label: "브랜드 플랜 시작하기",
      href: "https://pf.kakao.com/_xlfqiX/chat",
    },
  },
  year: {
    headlineBefore: "A whole year, ",
    headlineEm: "Together.",
    body: "연간 결제 시 10개월 요금으로 1년 이용",
    badgeLeft: "12 for 10",
    savedNum: "158,000",
    savedLabel: "SAVED",
  },
} as const;

/** 11_CTA — 히어로 CREATE BRAND 가 가리키는 #template · 시안 10-D · 11-D */
export const start = {
  floats: [
    {
      text: "BESPOKE",
      align: "left" as const,
      left: 120,
      top: 150,
      opacity: 0.5,
    },
    {
      text: "1:1 setup",
      align: "center" as const,
      left: 422,
      top: 418,
      lowercase: true,
      opacity: 0.8,
    },
    {
      text: "SMART ASSISTANT",
      align: "center" as const,
      left: 721,
      top: 512,
      opacity: 0.6,
    },
    {
      text: "HAIR UP AI",
      align: "right" as const,
      right: 120,
      top: 726,
      opacity: 1,
    },
  ],
  headline: ["감각은 온전히.", "운영은 더 간편하게."],
  body: [
    "당신의 실력과 스타일에 집중할 수 있도록",
    "반복되는 상담과 예약 관리는 헤어업이 덜어드립니다.",
  ],
  cta: {
    label: "1:1 맞춤 세팅 상담하기",
    href: "https://pf.kakao.com/_xlfqiX/chat",
  },
} as const;

/** 15_Footer — hu_FOOTER PC · 1440 × 739 · #EFEAE3 */
export const footer = {
  newsletter: {
    title: "NEED MORE DETAILS?",
    body: [
      "헤어업 서비스와 플랜이 궁금하다면",
      "가이드북에서 자세한 내용을 확인해보세요.",
    ],
    placeholder: "E-mail",
    submit: "가이드북 받기",
    notice:
      "* 이메일 입력 시 가이드북 발송 및 브랜드의 새로운 소식·혜택 수신에 동의하게 됩니다.",
    success: "• 가이드북을 보내드렸습니다. 메일함을 확인해 주세요.",
  },
  columns: [
    {
      title: "INDEX",
      links: [
        { label: "AI MANAGER", href: "#ai-manager" },
        { label: "TEMPLATES", href: "#template" },
        { label: "PRICING", href: "#pricing" },
        { label: "FAQ", href: "#faq" },
      ],
    },
    {
      title: "CONTACT",
      links: [
        {
          label: "mars.official.kr@gmail.com",
          href: "mailto:mars.official.kr@gmail.com",
        },
        { label: "070-8027-4688", href: "tel:07080274688" },
      ],
    },
    {
      title: "CONNECT",
      links: [
        { label: "Instagram", href: "#" },
        { label: "KakaoTalk", href: "#" },
      ],
    },
  ],
  /** PC .COMPANY_INFO — 4블록 · 블록 사이 간격(시안) */
  companyPc: [
    "MARANATHA STUDIO",
    "대표 | 최연주",
    "사업자등록번호 | 414-03-25569",
    "통신판매업신고번호 | 제 2026-경기포천-0700호",
  ],
  /** 모바일용 (기존 구조 유지) */
  company: [
    [
      { label: "회사명", value: "MARANATHA STUDIO" },
      { label: "대표자", value: "최연주" },
      { label: "사업자등록번호", value: "414-03-25569" },
      { label: "통신판매업신고번호", value: "제 2026-경기포천-0700호" },
    ],
    [
      { label: "주소", value: "경기도 포천시 호병골길 16, 102동 1106호" },
      { label: "대표전화", value: "070-8027-4688" },
      { label: "이메일", value: "mars.official.kr@gmail.com" },
    ],
  ],
  copyright: "COPYRIGHT © 2026 MARANATHASTUDIO",
  legal: [
    { label: "PRIVACY POLICY", href: "/privacy" },
    { label: "TERMS OF SERVICE", href: "/terms" },
  ],
} as const;
