import type { ReactNode } from "react";

type CanvasProps = {
  /** 시안 아트보드 높이(px, 1440 기준) */
  height: number;
  /** 화면 폭 100% 를 채우는 섹션 배경색 클래스 */
  background: string;
  children: ReactNode;
  className?: string;
  id?: string;
  /** 아트보드 밖으로 나가는 요소를 1440 경계에서 잘라냅니다. */
  clip?: boolean;
};

/**
 * 시안 재현용 고정 아트보드.
 * 배경색은 화면 폭 100% 를 채우고, 그 안의 1440px 캔버스만 중앙 정렬됩니다.
 * 화면이 넓어져도 요소는 확대되지 않고 양옆 여백만 늘어납니다.
 */
export function Canvas({
  height,
  background,
  children,
  className,
  id,
  clip,
}: CanvasProps) {
  return (
    <section id={id} className={`w-full ${background} ${className ?? ""}`}>
      <div
        className={`relative mx-auto w-[1440px] ${clip ? "overflow-hidden" : ""}`}
        style={{ height: `${height}px` }}
      >
        {children}
      </div>
    </section>
  );
}
