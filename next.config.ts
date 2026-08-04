import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* 개발 표시기가 화면 좌하단에 겹쳐 시안 픽셀 비교를 방해합니다. */
  devIndicators: false,
  images: {
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
