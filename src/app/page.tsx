import { Banner } from "@/components/sections/Banner";
import { Dilemma } from "@/components/sections/Dilemma";
import { Experience } from "@/components/sections/Experience";
import { Faq } from "@/components/sections/Faq";
import { Hero } from "@/components/sections/Hero";
import { KeyBenefits } from "@/components/sections/KeyBenefits";
import { Process } from "@/components/sections/Process";
import { SectionPlaceholder } from "@/components/sections/SectionPlaceholder";
import { Start } from "@/components/sections/Start";
import { TemplateCollection } from "@/components/sections/TemplateCollection";
import { SplashScreen } from "@/components/splash/SplashScreen";

export default function Home() {
  return (
    <>
      <SplashScreen />
      <main>
        <Hero />
        <Dilemma />
        <Experience />
        <Banner />
        <KeyBenefits />
        <Process />
        <TemplateCollection />
        <SectionPlaceholder id="section-08" height={800} label="08 섹션 준비 중" />
        <SectionPlaceholder id="section-09" height={800} label="09 섹션 준비 중" />
        <Faq />
        <Start />
      </main>
    </>
  );
}
