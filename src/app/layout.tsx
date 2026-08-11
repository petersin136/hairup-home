import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import { SPLASH_SESSION_KEY } from "@/components/splash/SplashScreen";
import "./globals.css";

export const metadata: Metadata = {
  title: "hair up — 자동화 살롱 AI",
  description:
    "고객과의 대화부터 예약, 장부 정리까지. 헤어업 AI가 감각적으로 처리합니다.",
  icons: {
    icon: [{ url: "/brand/favicon.png", type: "image/png", sizes: "56x56" }],
    apple: [{ url: "/brand/apple-icon.png", type: "image/png", sizes: "180x180" }],
  },
};

/* 같은 세션에서 이미 스플래시를 봤다면 첫 페인트부터 감춰 깜빡임을 없앱니다. */
const splashGuard = `try{if(sessionStorage.getItem('${SPLASH_SESSION_KEY}')==='1')document.documentElement.classList.add('splash-seen')}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${fontVariables} h-full`}>
      <head>
        {/* next/script children 은 React 19에서 <script> 중첩 경고·오류를 냄 */}
        <script
          id="splash-guard"
          dangerouslySetInnerHTML={{ __html: splashGuard }}
        />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
