import { Wordmark } from "@/components/brand/Wordmark";
import { Canvas } from "@/components/layout/Canvas";
import { RainInLines } from "@/components/motion/RainInLines";
import { faq } from "@/content/site";

/**
 * 07 / FAQ — 시안 6-D
 *
 * .FAQ_CARD   384 × 600 · pad 50 · #EFEAE3 · radius 6 · flex column
 * .FAQ_NUM    Inter 34/400 · #8C847A
 * .FAQ_TITLE  Noto 44/700 · #1C1A19 · lh 1.41 · keep-all · gap 45
 * .CARD_LOGO  90 × 35 · #8C847A · opacity 0.4 · mt auto
 *
 * 그리드: 거터 120 · 카드 384 × 3 · gapX 24 · gapY 32
 * 호버 시 답변 면으로 뒤집힘
 */
const GUTTER = 120;
const HEADER = { top: 300, size: 25 };
const SECTION_TITLE = {
  top: HEADER.top + HEADER.size + 45,
  size: 70,
  leading: 1.37,
  lines: 2,
};
const SECTION_DESC = {
  top:
    SECTION_TITLE.top +
    SECTION_TITLE.size * SECTION_TITLE.leading * SECTION_TITLE.lines +
    65,
  size: 22,
  leading: 1.64,
  lines: faq.body.length,
};
const CARD = { width: 384, height: 600 };
const GAP_X = 24;
const GAP_Y = 32;
const CARD_PAD = 50;
const CARD_TOP =
  SECTION_DESC.top +
  SECTION_DESC.size * SECTION_DESC.leading * SECTION_DESC.lines +
  150;
const HEIGHT = Math.ceil(CARD_TOP + CARD.height * 2 + GAP_Y + 120);

const TONE: Record<(typeof faq.items)[number]["tone"], string> = {
  forest: "bg-forest",
  clay: "bg-clay",
  espresso: "bg-espresso",
};

export function Faq() {
  return (
    <Canvas id="faq" height={HEIGHT} background="bg-porcelain">
      <p
        className="absolute flex items-baseline gap-[6px] uppercase leading-none text-forest"
        style={{ left: `${GUTTER}px`, top: `${HEADER.top}px` }}
      >
        <span className="font-latin text-[14px] font-medium tracking-normal">
          {faq.eyebrow.index}
        </span>
        <span className="font-display text-[25px] font-medium tracking-normal">
          {faq.eyebrow.label}
        </span>
      </p>

      <h2
        className="text-kr absolute text-left text-[70px] font-bold tracking-[-0.01em] text-ink"
        style={{
          left: `${GUTTER}px`,
          top: `${SECTION_TITLE.top}px`,
          lineHeight: SECTION_TITLE.leading,
        }}
      >
        {faq.headline.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h2>

      <RainInLines
        lines={faq.body}
        className="text-kr absolute text-left text-[22px] font-normal tracking-[-0.01em] text-body"
        style={{
          left: `${GUTTER}px`,
          top: `${SECTION_DESC.top}px`,
          lineHeight: SECTION_DESC.leading,
        }}
      />

      <div
        className="absolute grid"
        style={{
          left: `${GUTTER}px`,
          top: `${CARD_TOP}px`,
          width: `${CARD.width * 3 + GAP_X * 2}px`,
          height: `${CARD.height * 2 + GAP_Y}px`,
          gridTemplateColumns: `repeat(3, ${CARD.width}px)`,
          gridTemplateRows: `repeat(2, ${CARD.height}px)`,
          columnGap: `${GAP_X}px`,
          rowGap: `${GAP_Y}px`,
        }}
      >
        {faq.items.map((item, i) => (
          <FaqCard key={item.q} item={item} index={i} />
        ))}
      </div>
    </Canvas>
  );
}

type Item = (typeof faq.items)[number];

function FaqCard({ item, index }: { item: Item; index: number }) {
  return (
    <article
      data-faq-card={index}
      tabIndex={0}
      className="faq-card group relative h-full w-full cursor-pointer outline-none [perspective:1200px]"
    >
      <div className="faq-card-inner relative h-full w-full transition-transform duration-[600ms] ease-[cubic-bezier(0.65,0,0.35,1)] [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] group-focus-within:[transform:rotateY(180deg)]">
        {/* 질문 면 — 시안 6-D */}
        <div
          className="rounded-ui absolute inset-0 flex flex-col [backface-visibility:hidden]"
          style={{
            padding: `${CARD_PAD}px`,
            backgroundColor: "#EFEAE3",
          }}
        >
          <p className="font-latin text-[34px] font-normal leading-none text-stone">
            {item.q}
          </p>
          <p
            className="text-kr text-[44px] font-bold text-ink"
            style={{
              marginTop: 45,
              lineHeight: 1.41,
              wordBreak: "keep-all",
            }}
          >
            {item.question.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
          <div
            className="mt-auto text-stone opacity-40"
            style={{ width: 90, height: 35 }}
          >
            <Wordmark width={90} />
          </div>
        </div>

        {/* 답변 면 */}
        <div
          className={`rounded-ui absolute inset-0 flex flex-col [backface-visibility:hidden] [transform:rotateY(180deg)] ${TONE[item.tone]}`}
          style={{ padding: `${CARD_PAD}px` }}
        >
          <p className="text-kr text-[44px] font-bold leading-none tracking-[-0.01em] text-porcelain">
            {item.answerTitle}
          </p>
          <p
            className="text-kr text-[18px] font-normal tracking-[-0.01em] text-porcelain"
            style={{ marginTop: 45, lineHeight: 2 }}
          >
            {item.answer.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
        </div>
      </div>
    </article>
  );
}
