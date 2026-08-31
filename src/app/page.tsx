import { HomeShell } from "@/components/HomeShell";
import { LaunchOfferPopup } from "@/components/LaunchOfferPopup";
import { SplashScreen } from "@/components/splash/SplashScreen";
import { RestoreHomeScroll } from "@/lib/entry-chrome";

/**
 * 데스크톱(≥1440) / 모바일(<1440, 시안 폭 390)은 HomeShell 에서 하나만 마운트.
 */
export default function Home() {
  return (
    <>
      <SplashScreen />
      <LaunchOfferPopup />
      <RestoreHomeScroll />
      <HomeShell />
    </>
  );
}
