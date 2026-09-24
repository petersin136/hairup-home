import Image from "next/image";

import { GlyphLines } from "@/components/copy/GlyphLines";
import { RainInLines } from "@/components/motion/RainInLines";
import { dilemma } from "@/content/site";

/**
 * The Dilemma — hu_DILEMMA_SPACING_PC
 *
 * padding-top 200 · tag→title 42 · title→desc 36
 * desc→center card 93 · center→bottom-text 210 · padding-bottom 130
 * (아래 Experience pad-top 80 포함 시 카피 위·아래 시각 간격 210 대칭)
 * 좌우 카드 여백 60 · center↔right 간격 70
 *
 * .DILEMMA-TAG          Playfair 13/500 · the 만 소문자 이탤릭
 * .DILEMMA-TITLE        Noto 40/600 · lh 1.375
 * .DILEMMA-DESC         Noto 17/400 · lh 1.588
 * .DILEMMA-BOTTOM-TEXT  Noto 24/500 · lh 1.5
 *
 * .CARD-ITEM-LEFT    300×385 · r 10 · left 60 · center 대비 -178
 * .CARD-ITEM-CENTER  330×260 · r 10 · left 680
 * .CARD-ITEM-RIGHT   300×385 · r 10 · left 1080 · center 대비 -279
 */
const PAD_TOP = 200;
/**
 * 하단 카피 세로 중앙 — 위(센터 카드)↔카피 / 카피↔아래(Experience 카드) 시각 간격 대칭.
 * Experience padding-top 80 을 아래 간격에 포함하므로
 * margin-top 210 + padding-bottom 130 (= 위 210 · 아래 130+80).
 * (예전 170/170 은 Dilemma 섹션 내부만 대칭이라 화면에서는 카피가 위로 뜸)
 */
const PAD_BOTTOM = 130;
const GAP_DESC_CENTER = 93;
/**
 * tag→title 42 · title→desc 36 · center→bottom-text 210 은 globals.css 로 옮겼습니다.
 * Firefox 는 text-box-trim 을 구현하지 않아 @supports 로 라인박스 오버슈트를
 * 상쇄해야 하는데, 인라인 style 은 @supports 가 덮을 수 없습니다.
 */
const TITLE_LEADING = 1.375;
const DESC_LEADING = 1.588;

/** 시안 카드 — center top = 0 기준 */
const BOXES = [
  {
    left: 60,
    top: -178,
    width: 300,
    height: 385,
    src: dilemma.images[1],
  },
  {
    left: 680,
    top: 0,
    width: 330,
    height: 260,
    src: dilemma.images[2],
  },
  {
    left: 1080,
    top: -279,
    width: 300,
    height: 385,
    src: dilemma.images[0],
  },
] as const;

const CENTER_H = 260;

export function Dilemma() {
  return (
    <section id="dilemma" className="relative w-full overflow-x-clip bg-porcelain">
      <div
        className="relative z-10 mx-auto w-[1440px]"
        style={{
          paddingTop: PAD_TOP,
          paddingBottom: PAD_BOTTOM,
        }}
      >
        {/* .DILEMMA-TAG — the 만 소문자 이탤릭 */}
        <p className="DILEMMA-TAG SECTION-TAG text-center text-forest">
          {dilemma.tag.before}
          <em>{dilemma.tag.article}</em>
          {dilemma.tag.after}
        </p>

        {/* .DILEMMA-TITLE */}
        <h2
          className="DILEMMA-TITLE SECTION-HEADLINE text-kr text-center text-[40px] font-semibold text-ink"
          style={{ lineHeight: TITLE_LEADING }}
        >
          <GlyphLines lines={dilemma.headline} />
        </h2>

        {/* .DILEMMA-DESC */}
        <RainInLines
          lines={dilemma.bodyPc}
          className="DILEMMA-DESC text-kr text-center text-[17px] font-normal tracking-[-0.01em]"
          style={{
            lineHeight: DESC_LEADING,
            color: "rgba(28, 26, 25, 0.8)",
          }}
        />

        {/* 카드 스테이지 — 93은 본문↔센터 카드. 좌·우는 위로 삐져나옴 */}
        <div
          className="relative overflow-visible"
          style={{ marginTop: GAP_DESC_CENTER, height: CENTER_H }}
        >
          {BOXES.map((box) => (
            <div
              key={box.src}
              className="absolute overflow-hidden bg-ink"
              style={{
                left: box.left,
                top: box.top,
                width: box.width,
                height: box.height,
                borderRadius: 10,
              }}
            >
              <Image
                src={box.src}
                alt=""
                fill
                sizes={`${box.width}px`}
                className="object-cover"
                priority={box.src === dilemma.images[0]}
                unoptimized
              />
            </div>
          ))}
        </div>

        {/* .DILEMMA-BOTTOM-TEXT — br 한 요소 + trim (rain-line block 금지) */}
        <p className="DILEMMA-BOTTOM-TEXT text-kr">
          <GlyphLines lines={dilemma.bodyAside} />
        </p>
      </div>
    </section>
  );
}
