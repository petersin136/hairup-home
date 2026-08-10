import { MobileHome } from "@/components/mobile/MobileHome";
import { TopBanner } from "@/components/layout/TopBanner";
import { LaunchOfferPopup } from "@/components/LaunchOfferPopup";
import { AutomatedCrm } from "@/components/sections/AutomatedCrm";
import { Banner } from "@/components/sections/Banner";
import { Dilemma } from "@/components/sections/Dilemma";
import { Experience } from "@/components/sections/Experience";
import { Faq } from "@/components/sections/Faq";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { KeyBenefits } from "@/components/sections/KeyBenefits";
import { Pricing } from "@/components/sections/Pricing";
import { Process } from "@/components/sections/Process";
import { Start } from "@/components/sections/Start";
import { TemplateCollection } from "@/components/sections/TemplateCollection";
import { SplashScreen } from "@/components/splash/SplashScreen";
import { RestoreHomeScroll } from "@/lib/entry-chrome";

/**
 * 데스크톱(≥1440): 기존 아트보드 그대로.
 * 모바일(<1440): MobileHome 스택 레이아웃. 데스크톱 컴포넌트는 마운트하지 않음.
 */
export default function Home() {
  return (
    <>
      <SplashScreen />
      <LaunchOfferPopup />
      <RestoreHomeScroll />

      {/* 데스크톱 — 기존 픽셀 시안 (절대 수정 대상 아님) */}
      <div className="hidden min-[1440px]:block">
        <main>
          <TopBanner />
          <Hero />
          <Dilemma />
          <Experience />
          <AutomatedCrm />
          <Banner />
          <KeyBenefits />
          <Process />
          <TemplateCollection />
          <Pricing />
          <Faq />
          <Start />
          <Footer />
        </main>
      </div>

      {/* 모바일 전용 */}
      <MobileHome />
    </>
  );
}
