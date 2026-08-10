/** 사이트 카피/메뉴는 전부 여기서 관리합니다. */

/*
 * 헤더 메뉴와 CTA 는 영문을 기본으로 두고, 가리키면 한글로 굴러 바뀝니다.
 * 영문 표기는 시안에 없어 한글 뜻에 맞춰 새로 정한 값입니다.
 */
export const nav = [
  { en: "AI MANAGER", ko: "AI실장", href: "#ai-manager" },
  { en: "TEMPLATES", ko: "템플릿", href: "#template" },
  { en: "MEMBERSHIP", ko: "멤버십 요금", href: "#pricing" },
  { en: "FAQ", ko: "FAQ", href: "#faq" },
] as const;

export const cta = {
  en: "CREATE BRAND",
  ko: "내 브랜드 만들기",
  href: "#start",
} as const;

/** 헤더 위 띠배너 — 시안 5-D · 영문/숫자는 Inter 600, 한글은 Noto 400 */
export const topBanner = {
  en: "LAUNCH OFFER",
  kr: "헤어업 오픈 한정, 초기 세팅비 최대 ",
  offer: "40% OFF",
} as const;

/** 런치 오퍼 팝업 — 시안 POPUP · 440 × 600 */
export const launchPopup = {
  image: "/images/popup-top.jpg",
  desc: [
    "단독 웹 쇼룸과 통합 예약 시스템, 헤어업 브랜딩 플랜.",
    "신규 오픈 기간 한정, 초기 세팅비 혜택으로 시작하세요.",
  ],
  discount: { num: "35", percent: "%", off: "Off" },
  price: { from: "200만원", to: "130만원" },
  cta: { label: "브랜딩 플랜 혜택받고 시작하기", href: "#start" },
} as const;

export const splash = {
  eyebrow: "AUTOMATED SALON AI",
} as const;

export const hero = {
  eyebrow: "HAIR UP FOR PROFESSIONALS",
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
  /* 위→아래(우상 · 좌중 · 우하) 순서 */
  images: [
    "https://mirofkondedzmbddatnt.supabase.co/storage/v1/object/public/images/A_close-up_of_a_Korean_hairstylists_hands_cutting-1785809255648.jpg",
    "https://mirofkondedzmbddatnt.supabase.co/storage/v1/object/public/images/A_tight_close-up_shot_focusing_on_a_hairstylists_-1785810335027.jpg",
    "https://mirofkondedzmbddatnt.supabase.co/storage/v1/object/public/images/A_quiet_minimal_hair_salon_scene_an_empty_styling-1785809431372.jpg",
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
  headline: ["주저하지 말고,", "지금 직접", "말을 건네보세요."],
  body: [
    "실제 매장에 문의하듯 자유롭게 질문을 입력해 보세요.",
    "다정하고 정교하게 응답합니다.",
  ],
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
      title: ["셋째,", "알아서 정리되는 장부"],
      body: [
        "예약이 확정되는 순간, 관리자 화면에",
        "차곡차곡 정리됩니다. 손으로 옮겨 적는",
        "번거로운 과정은 이제 완전히 사라집니다.",
      ],
    },
    {
      title: ["넷째,", "노쇼 방지 안심 예약금"],
      body: [
        "진짜 방문할 고객만 예약금을 걸고 확정됩니다.",
        "오지 않을 문의로 낭비하던 시간과 감정을",
        "되찾으세요.",
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
  /* 시안 14-D 마퀴 전체 문구 */
  marquee: [
    "PURE DESIGN FOCUS",
    "UNINTERRUPTED CRAFT",
    "AI SALON SUPPORT",
    "EFFORTLESS FLOW",
    "YOUR HANDS FREE",
  ],
} as const;

export const process = {
  title: "THE PROCESS",
  steps: [
    {
      index: "STEP 1 /",
      caption: "DISCOVERY",
      body: [
        "피드 속에서 마음에 드는",
        "헤어 스타일을 찾다가",
        "당신의 작업물을 발견합니다",
      ],
    },
    {
      index: "STEP 2 /",
      caption: "INQUIRY",
      body: [
        "프로필의 24시간 예약 · 상담 링크를",
        "누르면 카카오톡으로 연결되어",
        "AI와 대화가 시작됩니다.",
      ],
    },
    {
      index: "STEP 3 /",
      caption: "BOOKING",
      body: [
        "상담부터 예약금 입금까지 한꺼번에 완료!",
        "당신은 확정된 손님만 반갑게 맞이하면 됩니다.",
      ],
    },
  ],
} as const;

/*
 * 10_FAQ — 시안 표기는 06 / FAQ. 호버하면 해당 칸이 답변 면으로 뒤집어집니다.
 * 답변 면 배경은 Q1·Q5 forest / Q2·Q6 clay / Q3·Q4 espresso.
 */
export const faq = {
  eyebrow: { index: "06 /", label: "FAQ" },
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

/** 05_Pricing Plan — 시안 2-D · 3-D · 4-D · GNB MEMBERSHIP → #pricing */
export const pricing = {
  eyebrow: { index: "05 /", label: "PRICING PLAN" },
  headline: ["매출이 아무리 늘어도,", "비용은 변함없이."],
  body: [
    "월 1,000만 원을 시술할 때 플랫폼 수수료는 매달 수십만 원에 달합니다.",
    "헤어업은 매출이 얼마든 월 5만 원입니다.",
  ],
  compare: {
    left: {
      subtitle: "매출에 비례해서 빠져나가는",
      title: "플랫폼 수수료",
      /** 롤링 후 시안 표기 그대로 */
      display: "00000+α",
      /** 카운트업 상한(표시는 pad + α) */
      spinTo: 1_000_000,
    },
    right: {
      subtitle: "언제나 월 정액인",
      title: "헤어업 구독료",
      amount: 50_000,
    },
  },
  starter: {
    name: "STARTER",
    tagline: ["24시간 쉼 없이,", "손님을 맞이하는 전담 예약 실장."],
    prices: [
      { label: "초기 세팅비(1회)", num: "50", unit: "만원" },
      { label: "월 구독료", num: "5", unit: "만원" },
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
    cta: { label: "1:1 맞춤 세팅 상담하기", href: "#start" },
  },
  branding: {
    name: "BRANDING",
    badge: "/ RECOMMEND",
    tagline: [
      "매장의 브랜드 가치를 완성하는",
      "단독 웹 쇼룸과 통합 예약 시스템.",
    ],
    prices: [
      { label: "초기 세팅비(1회)", num: "200", unit: "만원" },
      { label: "월 구독료", num: "5", unit: "만원" },
    ],
    features: [
      {
        title: "스타터 플랜 전 기능 포함",
        desc: ["24시간 AI 자동 상담 및 실시간 CRM 자동 수집 기본 탑재"],
      },
      {
        title: "단독 브랜드 랜딩페이지",
        desc: ["시술 철학과 포트폴리오를 감각적으로 담아내는 전용 웹 쇼룸"],
      },
      {
        title: "검색엔진 최적화 (SEO)",
        desc: ["네이버 · 구글 포털 검색 시 매장 브랜드를 상단에 안정적 노출"],
      },
      {
        title: "웹 인앱 AI 상담 위젯",
        desc: [
          "사이트를 둘러보던 손님의 이탈 없이 그 자리에서 즉시",
          "AI 상담 · 예약",
        ],
      },
    ],
    cta: { label: "내 브랜드 만들기", href: "#start" },
  },
} as const;

/** 11_CTA — 헤더 CREATE BRAND 가 가리키는 #start · 시안 10-D · 11-D */
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
  headline: ["감각은 온전히,", "비즈니스는 유용하게."],
  body: [
    "당신의 실력은 이미 충분합니다.",
    "이제 그 실력이 온전히 빛나도록 나머지는 헤어업이 하겠습니다.",
  ],
  cta: {
    label: "1:1 맞춤 세팅 상담하기",
    href: "mailto:mars.official.kr@gmail.com",
  },
} as const;

/** 15_Footer — 시안 15-D · 1440 × 739 · #EFEAE3 */
export const footer = {
  newsletter: {
    title: "NEED MORE DETAILS?",
    body: [
      "더 궁금한 사항이 있으신가요?",
      "이메일을 남겨주시면 상세 가이드북을 보내드립니다.",
    ],
    placeholder: "E-mail",
    submit: "Send me PDF",
    notice:
      "* 이메일 입력 시 가이드북 발송 및 브랜드의 새로운 소식·혜택 수신에 동의하게 됩니다.",
  },
  columns: [
    {
      title: "INDEX",
      links: [
        { label: "AI MANAGER", href: "#ai-manager" },
        { label: "TEMPLATES", href: "#template" },
        { label: "MEMBERSHIP", href: "#pricing" },
        { label: "FAQ", href: "#faq" },
      ],
    },
    {
      title: "CONTACT",
      links: [
        {
          label: "mars.officialkorea@gmail.com",
          href: "mailto:mars.officialkorea@gmail.com",
        },
        { label: "070-8027-4688", href: "tel:07080274688" },
      ],
    },
    {
      title: "JOIN US",
      links: [
        { label: "Instagram", href: "#" },
        { label: "KakaoTalk", href: "#" },
      ],
    },
  ],
  company: [
    [
      { label: "회사명", value: "MARANATHA STUDIO" },
      { label: "대표자", value: "최연주" },
      { label: "사업자등록번호", value: "414-03-25569" },
      { label: "통신판매업신고번호", value: "진행 중" },
    ],
    [
      { label: "주소", value: "경기도 포천시 호병골길 16, 102동 1106호" },
      { label: "대표전화", value: "070-8027-4688" },
      { label: "이메일", value: "mars.officialkorea@gmail.com" },
    ],
  ],
  copyright: "COPYRIGHT © 2026 MARANATHASTUDIO",
  legal: [
    { label: "PRIVACY POLICY", href: "/privacy" },
    { label: "TERMS OF SERVICE", href: "/terms" },
  ],
} as const;
