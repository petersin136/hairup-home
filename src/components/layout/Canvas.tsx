import type { ReactNode } from "react";
import Image from "next/image";

type CanvasProps = {
  /** 시안 아트보드 높이(px, 1440 기준) */
  height: number;
  /** 화면 폭 100% 를 채우는 섹션 배경색 클래스 */
  background: string;
  /** 화면 폭 100% 배경 이미지 (object-cover) */
  backgroundImage?: string;
  children: ReactNode;
  /**
   * 1440 아트보드를 넘어 화면 끝까지 쓰는 요소. 섹션 직속으로 놓이므로
   * `right: 0` 이 화면 오른쪽 끝이고, 아트보드 기준 x 는
   * `max(x, calc(50% - (720 - x)px))` 로 잡습니다. 화면이 1440 보다 좁을 때
   * mx-auto 가 왼쪽 여백을 0 으로 접는 것까지 따라가야 캔버스와 맞습니다.
   * 세로 좌표는 아트보드와 같습니다.
   */
  bleed?: ReactNode;
  className?: string;
  id?: string;
};

/**
 * 시안 재현용 고정 아트보드.
 * 배경색은 화면 폭 100% 를 채우고, 그 안의 1440px 캔버스만 중앙 정렬됩니다.
 * 화면이 넓어져도 요소는 확대되지 않고 양옆 여백만 늘어납니다.
 */
export function Canvas({
  height,
  background,
  backgroundImage,
  children,
  bleed,
  className,
  id,
}: CanvasProps) {
  return (
    <section
      id={id}
      className={`relative w-full ${background} ${className ?? ""}`}
      style={backgroundImage ? { minHeight: `${height}px` } : undefined}
    >
      {backgroundImage ? (
        <Image
          src={backgroundImage}
          alt=""
          fill
          sizes="100vw"
          className="pointer-events-none object-cover object-center"
          priority={id === "start"}
        />
      ) : null}
      <div
        className="relative z-[1] mx-auto w-[1440px]"
        style={{ height: `${height}px` }}
      >
        {children}
      </div>
      {bleed}
    </section>
  );
}
