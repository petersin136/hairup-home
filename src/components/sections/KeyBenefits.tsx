import Image from "next/image";

import { keyBenefits } from "@/content/site";

/**
 * 04_Key Benefits — hu_KB_PC_01 · hu_KB_PC_02 · hu_KB_SPACING_PC
 *
 * 상단 패딩 200 · 하단 0 (다음 Template 섹션 top 이 구간 간격) · 좌우 152
 * 태그↔타이틀 42 · 타이틀↔본문 36 · 본문↔그리드 85
 * 썸네일 558 × 360 · radius 6 · 열 간격 20 · 행 간격 50
 * 썸네일↔카드타이틀 28 · 카드타이틀↔카드본문 18
 *
 * 영문 태그는 cap/alphabetic, 한글은 ideographic 으로 trim.
 * 여러 줄은 br 로 한 요소의 라인박스를 유지해 line-height 가 줄 사이에 남게 함.
 */
export function KeyBenefits() {
  return (
    <section id="key-benefits" className="BENEFITS">
      <div className="BENEFITS-INNER">
        <p className="SECTION-TAG BENEFITS-TAG">
          {keyBenefits.tag.before}
          <em>{keyBenefits.tag.article}</em>
          {keyBenefits.tag.after}
        </p>

        <h2 className="BENEFITS-TITLE">
          {keyBenefits.headline[0]}
          <br />
          {keyBenefits.headline[1]}
        </h2>

        <p className="BENEFITS-DESC">
          {keyBenefits.body[0]}
          <br />
          {keyBenefits.body[1]}
          <br />
          {keyBenefits.body[2]}
        </p>

        <div className="BENEFITS-GRID">
          {keyBenefits.cards.map((card) => (
            <article key={card.title} className="BENEFIT-CARD">
              <div className="BENEFIT-CARD-THUMB">
                <Image
                  src={card.image}
                  alt=""
                  fill
                  sizes="558px"
                  className="object-cover"
                  unoptimized
                />
              </div>
              <h3 className="BENEFIT-CARD-TITLE">{card.title}</h3>
              <p className="BENEFIT-CARD-DESC">
                {card.body[0]}
                <br />
                {card.body[1]}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
