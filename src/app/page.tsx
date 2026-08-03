import { Banner } from "@/components/sections/Banner";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { SectionPlaceholder } from "@/components/sections/SectionPlaceholder";
import { SplashScreen } from "@/components/splash/SplashScreen";

export default function Home() {
  return (
    <>
      <SplashScreen />
      <main>
        <Hero />
        <SectionPlaceholder id="section-02" height={800} label="02 섹션 준비 중" />
        <Experience />
        <Banner />
      </main>
    </>
  );
}
