import { Wordmark } from "@/components/brand/Wordmark";
import { GlyphLines } from "@/components/copy/GlyphLines";
import { Canvas } from "@/components/layout/Canvas";
import { RainInLines } from "@/components/motion/RainInLines";
import { faq } from "@/content/site";

/**
 * 06 / FAQ — 시안 6-D
 *
 * Pricing 카드 하단 → FAQ 아이브로우 여백 300 (HEADER.top)
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
const TAG_TOP = 300;
const GAP_TAG_TITLE = 42;
const TAG_SIZE = 13;
const TITLE_SIZE = 40;
const TITLE_LEADING = 1.375;
const TITLE_LINES = 2;
const GAP_TITLE_DESC = 36;
const DESC_SIZE = 17;
const DESC_LEADING = 1.588;
const DESC_LINES = faq.body.length;

const SECTION_TITLE = {
  top: TAG_TOP + TAG_SIZE + GAP_TAG_TITLE,
};
const SECTION_DESC = {
  top:
    SECTION_TITLE.top +
    TITLE_SIZE * TITLE_LEADING * TITLE_LINES +
    GAP_TITLE_DESC,
};
const CARD = { width: 384, height: 600 };
const GAP_X = 24;
const GAP_Y = 32;
const CARD_PAD = 50;
const CARD_TOP =
  SECTION_DESC.top + DESC_SIZE * DESC_LEADING * DESC_LINES + 150;
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
        className="SECTION-TAG absolute text-left text-forest"
        style={{ left: `${GUTTER}px`, top: `${TAG_TOP}px` }}
      >
        {faq.tag.before}
        <em>{faq.tag.article}</em>
        {faq.tag.after}
      </p>

      <h2
        className="SECTION-COPY-TITLE text-kr absolute text-left"
        style={{
          left: `${GUTTER}px`,
          top: `${SECTION_TITLE.top}px`,
        }}
      >
        <GlyphLines lines={faq.headline} />
      </h2>

      <RainInLines
        lines={faq.body}
        className="SECTION-COPY-DESC text-kr absolute text-left"
        style={{
          left: `${GUTTER}px`,
          top: `${SECTION_DESC.top}px`,
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
            <GlyphLines lines={item.question} />
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
            <GlyphLines lines={item.answer} />
          </p>
        </div>
      </div>
    </article>
  );
}
