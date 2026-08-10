import Link from "next/link";

import { Wordmark } from "@/components/brand/Wordmark";
import { SuppressEntryChrome } from "@/lib/entry-chrome";

type LegalSection = {
  heading: string;
  body?: readonly string[];
  list?: readonly string[];
};

type LegalPageProps = {
  title: string;
  en: string;
  sections: readonly LegalSection[];
};

export function LegalPage({ title, en, sections }: LegalPageProps) {
  return (
    <div className="min-h-full bg-linen text-ink">
      <SuppressEntryChrome />
      <header className="border-b border-mist/70 bg-porcelain/90">
        <div className="mx-auto flex max-w-[720px] items-center justify-between px-5 py-4">
          <Link
            href="/#footer"
            scroll={false}
            className="text-ink"
            aria-label="hair up"
          >
            <Wordmark width={110} />
          </Link>
          <Link
            href="/#footer"
            scroll={false}
            className="font-latin text-[12px] uppercase tracking-[0.06em] text-ink/70 transition-colors hover:text-ink"
          >
            Back
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[720px] px-5 py-12 pb-20">
        <p className="font-latin text-[12px] font-medium uppercase tracking-[0.08em] text-forest">
          {en}
        </p>
        <h1 className="text-kr mt-3 text-[28px] font-bold leading-tight tracking-[-0.02em]">
          {title}
        </h1>

        <div className="mt-10 flex flex-col gap-9">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-kr text-[17px] font-semibold leading-snug">
                {section.heading}
              </h2>
              {section.body?.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-kr mt-3 text-[15px] leading-[1.7] text-body"
                >
                  {paragraph}
                </p>
              ))}
              {section.list ? (
                <ul className="text-kr mt-3 list-disc space-y-2 pl-5 text-[15px] leading-[1.7] text-body">
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
