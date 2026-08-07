"use client";

import { useEffect, useRef, useState } from "react";

import { process } from "@/content/site";

/**
 * 06_The Process — 프로그레스 탭 캐러셀 (시안 20–24-D)
 * 활성 스텝: 타이틀+설명이 한 덩어리로 바 위에서 위로 튀어 오름.
 */
const AUTO_MS = 5000;
const COUNT = process.steps.length;
/** 활성 시 타이틀+설명이 올라갈 공간 */
const LIFT_AREA = 220;

export function Process() {
  const [active, setActive] = useState(0);
  const [barKey, setBarKey] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  /** 클릭으로 특정 스텝을 고르면 자동 전환을 멈춤 (호버로는 멈추지 않음) */
  const [manual, setManual] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const manualRef = useRef(manual);
  manualRef.current = manual;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const resume = () => {
    if (!manualRef.current) return;
    setManual(false);
    setBarKey((k) => k + 1);
  };

  /* 탭 밖을 클릭하면 자동 재생 재개 */
  useEffect(() => {
    if (!manual) return;

    const onPointerDown = (e: PointerEvent) => {
      const tabs = tabsRef.current;
      if (!tabs) return;
      const target = e.target as Node | null;
      if (target && tabs.contains(target)) return;
      resume();
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [manual]);

  /* 섹션을 스크롤로 벗어나면 자동 재생 재개 */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        /* 화면에서 거의 안 보이면 재개 — 다시 들어와도 계속 진행 */
        if (entry.intersectionRatio < 0.35) resume();
      },
      { threshold: [0, 0.35, 0.7] },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  const go = (next: number, fromClick = false) => {
    setActive(((next % COUNT) + COUNT) % COUNT);
    setBarKey((k) => k + 1);
    if (fromClick) setManual(true);
  };

  return (
    <section
      ref={sectionRef}
      id="process"
      className="relative w-full bg-black"
      aria-roledescription="carousel"
      aria-label="The Process"
    >
      <div className="relative mx-auto flex min-h-[800px] w-full max-w-[1440px] flex-col px-[120px] pt-[70px] pb-[70px]">
        <h2 className="font-display text-[44px] font-medium uppercase leading-none text-porcelain">
          {process.title}
        </h2>

        <div
          ref={tabsRef}
          className="mt-auto grid grid-cols-3 gap-6 pt-[120px]"
          role="tablist"
          aria-label="Process steps"
        >
          {process.steps.map((step, i) => {
            const isActive = active === i;

            return (
              <button
                key={step.caption}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`process-panel-${i}`}
                id={`process-tab-${i}`}
                className="group flex cursor-pointer flex-col text-left"
                onClick={() => go(i, true)}
              >
                {/* 타이틀+설명 유닛 — 하단 정렬, 활성 시 설명이 붙으며 통째로 위로 */}
                <div
                  className="relative w-full"
                  style={{ height: `${LIFT_AREA}px` }}
                >
                  <div
                    id={`process-panel-${i}`}
                    role="tabpanel"
                    aria-labelledby={`process-tab-${i}`}
                    className={[
                      "process-step-unit absolute inset-x-0 bottom-0 flex flex-col",
                      isActive ? "is-active" : "",
                      reducedMotion ? "motion-reduce" : "",
                    ].join(" ")}
                  >
                    <p className="flex items-start">
                      <span
                        className={[
                          "mr-[10px] shrink-0 font-latin font-normal transition-[color,font-size] duration-500",
                          isActive
                            ? "text-[18px] text-stone"
                            : "text-[16px] text-stone/50",
                        ].join(" ")}
                      >
                        {step.index}
                      </span>
                      <span
                        className={[
                          "font-display font-medium uppercase transition-[color,font-size] duration-500",
                          isActive
                            ? "text-[32px] leading-none text-porcelain"
                            : "text-[28px] leading-[1.281] text-porcelain/50",
                        ].join(" ")}
                      >
                        {step.caption}
                      </span>
                    </p>

                    <div
                      className={[
                        "grid transition-[grid-template-rows,opacity,margin] duration-500 ease-out",
                        isActive
                          ? "mt-10 grid-rows-[1fr] opacity-100"
                          : "mt-0 grid-rows-[0fr] opacity-0",
                      ].join(" ")}
                    >
                      <div className="overflow-hidden">
                        {/* 3줄 높이로 고정해 스텝마다 같은 만큼 위로 올라가게 */}
                        <p className="text-kr min-h-[calc(19px*1.63*3)] text-[19px] font-normal leading-[1.63] text-porcelain/80">
                          {step.body.map((line) => (
                            <span key={line} className="block">
                              {line}
                            </span>
                          ))}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="relative mt-[30px] h-[3px] w-full max-w-[384px] overflow-hidden"
                  style={{ backgroundColor: "rgb(90, 90, 90)" }}
                >
                  {isActive ? (
                    reducedMotion || manual ? (
                      <span className="absolute inset-y-0 left-0 w-full bg-porcelain" />
                    ) : (
                      <span
                        key={`${barKey}-${i}`}
                        className="process-bar-fill absolute inset-y-0 left-0 w-full bg-porcelain"
                        style={{
                          animationDuration: `${AUTO_MS}ms`,
                        }}
                        onAnimationEnd={() => go(i + 1)}
                      />
                    )
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
