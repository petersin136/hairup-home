import { Hero } from "@/components/sections/Hero";
import { SplashScreen } from "@/components/splash/SplashScreen";

export default function Home() {
  return (
    <>
      <SplashScreen />
      <main>
        <Hero />
      </main>
    </>
  );
}
