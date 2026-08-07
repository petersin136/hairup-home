"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

const ARTBOARD = 1440;

type MobileScaleShellProps = {
  children: ReactNode;
};

/**
 * 데스크톱(≥1440)은 그대로 두고, 그 미만에서만 1440 아트보드를
 * 뷰포트 폭에 맞게 축소합니다. 섹션 좌표/클래스는 건드리지 않습니다.
 */
export function MobileScaleShell({ children }: MobileScaleShellProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    const updateScale = () => {
      const next = Math.min(1, window.innerWidth / ARTBOARD);
      setScale(next);
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const syncHeight = () => setContentHeight(el.scrollHeight);
    syncHeight();

    const ro = new ResizeObserver(syncHeight);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const scaled = scale < 1;
  const shellStyle: CSSProperties = scaled
    ? {
        height: contentHeight > 0 ? contentHeight * scale : undefined,
        overflow: "hidden",
      }
    : undefined;

  const boardStyle: CSSProperties = scaled
    ? {
        width: ARTBOARD,
        transform: `scale(${scale})`,
        transformOrigin: "top left",
      }
    : undefined;

  return (
    <div
      className="relative w-full overflow-x-clip"
      style={shellStyle}
    >
      <div ref={contentRef} style={boardStyle}>
        {children}
      </div>
    </div>
  );
}
