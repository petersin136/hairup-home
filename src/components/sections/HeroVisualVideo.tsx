"use client";

import { useEffect, useRef } from "react";

type HeroVisualVideoProps = {
  src: string;
  /** 재생 배속 (기본 1) */
  rate?: number;
};

export function HeroVisualVideo({ src, rate = 1 }: HeroVisualVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.playbackRate = rate;
  }, [rate]);

  return (
    <video
      ref={ref}
      className="absolute inset-0 h-full w-full object-cover"
      style={{
        filter: "saturate(0.55) brightness(0.72) contrast(1.08)",
      }}
      src={src}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
    />
  );
}
