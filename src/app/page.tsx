import { Banner } from "@/components/sections/Banner";
import { Dilemma } from "@/components/sections/Dilemma";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { KeyBenefits } from "@/components/sections/KeyBenefits";
import { Process } from "@/components/sections/Process";
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
      </main>
    </>
  );
}
