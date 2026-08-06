import { TopBanner } from "@/components/layout/TopBanner";
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

export default function Home() {
  return (
    <>
      <SplashScreen />
      <main>
        <TopBanner />
        <Hero />
        <Dilemma />
        <Experience />
        <Banner />
        <KeyBenefits />
        <Process />
        <TemplateCollection />
        <Pricing />
        <Faq />
        <Start />
        <Footer />
      </main>
    </>
  );
}
