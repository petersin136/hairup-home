"use client";

import { useEffect, useState } from "react";

import { SiteHeader } from "@/components/layout/SiteHeader";
import { TopBanner } from "@/components/layout/TopBanner";
import { MobileHome } from "@/components/mobile/MobileHome";
import { AutomatedCrm } from "@/components/sections/AutomatedCrm";
import { Dilemma } from "@/components/sections/Dilemma";
import { Experience } from "@/components/sections/Experience";
import { Faq } from "@/components/sections/Faq";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { KeyBenefits } from "@/components/sections/KeyBenefits";
import { Pricing } from "@/components/sections/Pricing";
import { Start } from "@/components/sections/Start";
import { TemplateCollection } from "@/components/sections/TemplateCollection";

const DESKTOP_MQ = "(min-width: 1440px)";

/**
 * 모바일/데스크톱을 동시에 마운트하지 않습니다.
 * 둘 다 두면 id 중복 + 숨겨진 sticky/스크롤 리스너가 터치 스크롤을 튕깁니다.
 */
export function HomeShell() {
  const [mode, setMode] = useState<"mobile" | "desktop" | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_MQ);
    const sync = () => setMode(mq.matches ? "desktop" : "mobile");
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  if (mode === null) {
    return <div className="min-h-dvh bg-porcelain" aria-hidden />;
  }

  if (mode === "desktop") {
    return (
      <main>
        <TopBanner />
        <SiteHeader />
        <Hero />
        <Dilemma />
        <Experience />
        <AutomatedCrm />
        <KeyBenefits />
        <TemplateCollection />
        <Pricing />
        <Faq />
        <Start />
        <Footer />
      </main>
    );
  }

  return <MobileHome />;
}
