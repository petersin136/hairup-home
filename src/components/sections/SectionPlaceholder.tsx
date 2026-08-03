import { Canvas } from "@/components/layout/Canvas";

type SectionPlaceholderProps = {
  id: string;
  height: number;
  /** 스크린리더/개발자용 라벨. 화면에는 보이지 않습니다. */
  label: string;
};

/**
 * 시안이 아직 확정되지 않은 섹션의 자리를 잡아 두는 검정 블록입니다.
 * 시안이 나오면 이 컴포넌트를 실제 섹션으로 교체하세요.
 */
export function SectionPlaceholder({
  id,
  height,
  label,
}: SectionPlaceholderProps) {
  return (
    <Canvas id={id} height={height} background="bg-black">
      <span className="sr-only">{label}</span>
    </Canvas>
  );
}
