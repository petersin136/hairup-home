import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* 개발 표시기가 화면 좌하단에 겹쳐 시안 픽셀 비교를 방해합니다. */
  devIndicators: false,
  /* send-email 라우트가 public/docs PDF를 fs로 읽을 수 있게 번들에 포함 */
  outputFileTracingIncludes: {
    "/api/send-email": [
      "./public/docs/**/*",
      "./public/brand/guidebook-email-top.png",
      "./public/brand/guidebook-email-btn.png",
      "./public/brand/guidebook-email-bottom.png",
    ],
  },
  images: {
    /* Next.js 기본 최적화(WebP/AVIF 재인코딩) 비활성 — 디자이너 제공 PNG 원본 그대로 전달 */
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mirofkondedzmbddatnt.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
