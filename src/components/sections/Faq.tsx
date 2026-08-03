import { Wordmark } from "@/components/brand/Wordmark";
import { Canvas } from "@/components/layout/Canvas";
import { RainInLines } from "@/components/motion/RainInLines";
import { faq } from "@/content/site";

/**
 * 10_FAQ — 아트보드 1440 × 2329, 배경 #f6ecdf
 *
 * 시안이 633×1024 로 축소 저장돼 있어(배율 2.275) 좌표는 역산값입니다. ±수 px.
 * 3×2 격자. 호버하면 해당 칸이 뒤집혀 답변 면이 나옵니다.
 *
 * 시안에서 잰 잉크 좌표(1440 역산)
 *   아이브로우  x 120, y 298
 *   H2          x 120, 1행 y 363 (행간 96)
 *   본문        x 120, 1행 y 586 (행간 36)
 *   카드        382 × 598, x 121 / 529 / 937, y 796 / 1429
 *   카드 간격   가로 26 · 세로 35
 *   카드 안     좌패딩 48, Q y 48(~30px #9a948c), 질문 y 110(잉크≈122, 행간 62, 45px),
 *               워드마크 bottom 40 · 답 제목 y 44(45px) · 답 본문 y 156(18/36)
 */
const HEIGHT = 2329;
const LEFT = 120;
const EYEBROW_TOP = 294;
const HEADLINE_TOP = 344;
const BODY_TOP = 576;
const INDEX_RISE = 7;

const GRID = { left: 121, top: 796, gapX: 26, gapY: 35 };
const CARD = { width: 382, height: 598 };
const PAD = 48;
const Q_TOP = 48;
/** 시안 질문 잉크 상단 ≈122. 행간 62 · 글자 46 이라 반행간(8)을 빼 맞춥니다. */
const QUESTION_TOP = 110;
const MARK_BOTTOM = 40;
const ANSWER_TITLE_TOP = 44;
const ANSWER_BODY_TOP = 156;
const ANSWER_LEADING = 36;

const TONE: Record<(typeof faq.items)[number]["tone"], string> = {
  forest: "bg-forest",
  clay: "bg-clay",
  espresso: "bg-espresso",
};

export function Faq() {
  return (
    <Canvas id="faq" height={HEIGHT} background="bg-cream">
      <p
        className="absolute whitespace-pre font-display text-[27px] font-semibold leading-none tracking-[-1.2px] text-forest"
        style={{ left: `${LEFT}px`, top: `${EYEBROW_TOP}px` }}
      >
        <span
          className="relative font-latin text-[16px] font-semibold tracking-[0.65px]"
          style={{ top: `-${INDEX_RISE}px` }}
        >
          {faq.eyebrow.index}{" "}
        </span>
        {faq.eyebrow.label}
      </p>

      <h2
        className="text-kr absolute text-[70px] font-bold leading-[96px] tracking-[-0.01em] text-ink"
        style={{ left: `${LEFT}px`, top: `${HEADLINE_TOP}px` }}
      >
        {faq.headline.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h2>

      <RainInLines
        lines={faq.body}
        className="text-kr absolute text-[22px] font-normal leading-[36px] tracking-[-0.01em] text-body"
        style={{ left: `${LEFT}px`, top: `${BODY_TOP}px` }}
      />

      <div
        className="absolute grid"
        style={{
          left: `${GRID.left}px`,
          top: `${GRID.top}px`,
          width: `${CARD.width * 3 + GRID.gapX * 2}px`,
          height: `${CARD.height * 2 + GRID.gapY}px`,
          gridTemplateColumns: `repeat(3, ${CARD.width}px)`,
          gridTemplateRows: `repeat(2, ${CARD.height}px)`,
          columnGap: `${GRID.gapX}px`,
          rowGap: `${GRID.gapY}px`,
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
        {/* 질문 면 */}
        <div className="rounded-ui absolute inset-0 bg-ink [backface-visibility:hidden]">
          <p
            className="absolute font-latin text-[30px] font-medium leading-none tracking-[0.2px] text-[#9a948c]"
            style={{ left: `${PAD}px`, top: `${Q_TOP}px` }}
          >
            {item.q}
          </p>
          <p
            className="text-kr absolute text-[45px] font-bold leading-[62px] tracking-[-0.4px] text-porcelain"
            style={{ left: `${PAD}px`, top: `${QUESTION_TOP}px` }}
          >
            {item.question.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
          {/* 시안 워드마크 코어 ≈ #4d4542 */}
          <div
            className="absolute text-[#4d4542]"
            style={{ left: `${PAD}px`, bottom: `${MARK_BOTTOM}px` }}
          >
            <Wordmark width={88} />
          </div>
        </div>

        {/* 답변 면 */}
        <div
          className={`rounded-ui absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] ${TONE[item.tone]}`}
        >
          <p
            className="text-kr absolute text-[45px] font-bold leading-none tracking-[-0.4px] text-porcelain"
            style={{ left: `${PAD}px`, top: `${ANSWER_TITLE_TOP}px` }}
          >
            {item.answerTitle}
          </p>
          <p
            className="text-kr absolute text-[18px] font-normal tracking-[-0.01em] text-porcelain"
            style={{
              left: `${PAD}px`,
              top: `${ANSWER_BODY_TOP}px`,
              lineHeight: `${ANSWER_LEADING}px`,
            }}
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
