import { Canvas } from "@/components/layout/Canvas";
import { start } from "@/content/site";

/**
 * 11_CTA — 아트보드 1440 × 1295, 배경 #000000
 *
 * 시안이 1024×921 로 축소 저장돼 있어(배율 1.406) 좌표는 역산값입니다.
 *
 * 시안에서 잰 잉크 좌표(1440 역산)
 *   BESPOKE           x 120, y 152 (22px Playfair)
 *   1:1 SETUP         x 419, y 415
 *   SMART ASSISTANT   x 719, y 509
 *   HAIR UP AI        x 1202, y 724
 *   H2                x 118, 1행 잉크 y 741 (행간 96 · 박스 top 722)
 *   본문              x 120, 1행 잉크 y 962 (행간 36 · 박스 top 952)
 *   CTA 버튼          x 118, y 1088, 232 × 58 · 호버 시 흰 채움/검정 글자
 */
const HEIGHT = 1295;
const HEADLINE = { left: 118, top: 722 };
const BODY = { left: 120, top: 952 };
const CTA = { left: 118, top: 1088, width: 232, height: 58 };

export function Start() {
  return (
    <Canvas id="start" height={HEIGHT} background="bg-black">
      {start.floats.map((item) => (
        <p
          key={item.text}
          className="absolute whitespace-pre font-display text-[22px] font-semibold leading-none tracking-[0.2px] text-porcelain"
          style={{ left: `${item.left}px`, top: `${item.top}px` }}
        >
          {item.text}
        </p>
      ))}

      <h2
        className="text-kr absolute text-[70px] font-bold leading-[96px] tracking-[-0.01em] text-porcelain"
        style={{ left: `${HEADLINE.left}px`, top: `${HEADLINE.top}px` }}
      >
        {start.headline.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h2>

      <p
        className="text-kr absolute text-[22px] font-normal leading-[36px] tracking-[-0.01em] text-[#686460]"
        style={{ left: `${BODY.left}px`, top: `${BODY.top}px` }}
      >
        {start.body.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </p>

      <a
        href={start.cta.href}
        data-cta-btn
        className="rounded-btn text-kr absolute flex items-center justify-center border border-porcelain text-[16px] font-medium tracking-[-0.01em] text-porcelain transition-colors duration-200 hover:bg-porcelain hover:text-black"
        style={{
          left: `${CTA.left}px`,
          top: `${CTA.top}px`,
          width: `${CTA.width}px`,
          height: `${CTA.height}px`,
        }}
      >
        {start.cta.label}
      </a>
    </Canvas>
  );
}
