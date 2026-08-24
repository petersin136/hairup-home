"use client";

import Image from "next/image";
import Link from "next/link";

import { GlyphLines } from "@/components/copy/GlyphLines";
import { cta, hero } from "@/content/site";
import { onHashClick } from "@/lib/scroll-to-hash";

/**
 * 01_Hero — hu_HERO_PC · hu_HERO_VI_PC · hu_MAIN_SPACING_PC
 *
 * .HERO-MAIN-BOX     1380 × 640 · #000 · radius 10 · 좌우 30
 * .HERO-TITLE        Noto 40/600 · lh 1.375 · #FAF8F5
 * .HERO-DESC         Noto 17/400 · lh 1.588 · rgba(250,248,245,0.8)
 *                    타이틀↔본문 36 · 본문↔버튼 55
 * .BTN-CREATE-BRAND  200 × 55 · #FAF8F5 · radius 4 · Inter 16/500 · #2C3A2E
 *                    hover bg #2C3A2E · color #FAF8F5 · 한글 카피로 교체
 * 카피 패딩          좌 50 · 하 50
 */
export function Hero() {
  return (
    <section id="hero" className="HERO">
      <div className="HERO-STAGE">
        <div className="HERO-MAIN-BOX">
          <Image
            src="/hero/hero-vi-pc.png"
            alt=""
            fill
            priority
            unoptimized
            sizes="1380px"
            className="object-cover object-center"
          />

          <div className="HERO-COPY">
            <h1 className="HERO-TITLE">
              <GlyphLines lines={hero.headline} />
            </h1>

            <p className="HERO-DESC">
              <GlyphLines lines={hero.body} />
            </p>

            <Link
              href={cta.href}
              onClick={(e) => onHashClick(e, cta.href)}
              className="BTN-CREATE-BRAND"
            >
              <span className="BTN-CREATE-BRAND-ROLL">
                <span className="TXT-EN">{cta.en}</span>
                <span className="TXT-KR" aria-hidden>
                  {cta.ko}
                </span>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
