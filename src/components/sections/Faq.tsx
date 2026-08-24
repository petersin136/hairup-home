import { Wordmark } from "@/components/brand/Wordmark";
import { GlyphLines } from "@/components/copy/GlyphLines";
import { Canvas } from "@/components/layout/Canvas";
import { faq } from "@/content/site";

/**
 * 06 / FAQ — 시안 6-D
 *
 * 카피 스택: Key Benefits(04) 와 동일 — 좌측 정렬 · 거터 120
 * tag→title 42 · title→desc 36 · desc→카드 150
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
const GAP_DESC_CARDS = 150;
/** copy 스택(2줄 타이틀·2줄 본문) + desc→카드 150 */
const CARD_TOP = TAG_TOP + 255 + GAP_DESC_CARDS;
const CARD = { width: 384, height: 600 };
const GAP_X = 24;
const GAP_Y = 32;
const CARD_PAD = 50;
const HEIGHT = Math.ceil(CARD_TOP + CARD.height * 2 + GAP_Y + 120);

const TONE: Record<(typeof faq.items)[number]["tone"], string> = {
  forest: "bg-forest",
  clay: "bg-clay",
  espresso: "bg-espresso",
};

export function Faq() {
  return (
    <Canvas id="faq" height={HEIGHT} background="bg-porcelain">
      <div
        className="SECTION-COPY-STACK SECTION-COPY-STACK--left absolute"
        style={{ left: `${GUTTER}px`, top: `${TAG_TOP}px` }}
      >
        <p className="SECTION-TAG text-forest">
          {faq.tag.before}
          <em>{faq.tag.article}</em>
          {faq.tag.after}
        </p>

        <h2 className="SECTION-COPY-TITLE text-kr">
          <GlyphLines lines={faq.headline} />
        </h2>

        <p className="SECTION-COPY-DESC text-kr">
          <GlyphLines lines={faq.body} />
        </p>
      </div>

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
