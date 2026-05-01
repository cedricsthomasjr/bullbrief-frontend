import Link from "next/link";
import type { LegalDocument } from "@/app/lib/legalContent";

type Props = {
  document: LegalDocument;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function LegalDocumentPage({ document }: Props) {
  return (
    <main className="min-h-screen pt-[88px]" style={{ backgroundColor: "#060c1a" }}>
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-8 lg:gap-10">
          <aside className="lg:sticky lg:top-28 lg:self-start space-y-4">
            <div className="bb-card p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-sky-400">{document.eyebrow}</p>
              <h1 className="mt-2 text-2xl font-black tracking-tight text-blue-50">{document.title}</h1>
              <p className="mt-2 text-xs text-slate-600">Updated {document.updated}</p>
              <div className="mt-5 grid grid-cols-1 gap-2">
                <Link href="/terms" className="text-xs text-slate-500 hover:text-sky-400 transition-colors">Terms of Service</Link>
                <Link href="/disclaimer" className="text-xs text-slate-500 hover:text-sky-400 transition-colors">Investment Disclaimer</Link>
                <Link href="/privacy" className="text-xs text-slate-500 hover:text-sky-400 transition-colors">Privacy Policy</Link>
              </div>
            </div>

            <nav className="hidden lg:block bb-card p-4 max-h-[58vh] overflow-y-auto">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-600">Contents</p>
              <div className="space-y-2">
                {document.sections.map((section) => (
                  <a
                    key={section.title}
                    href={`#${slugify(section.title)}`}
                    className="block text-xs leading-5 text-slate-500 hover:text-sky-400 transition-colors"
                  >
                    {section.title}
                  </a>
                ))}
              </div>
            </nav>
          </aside>

          <article className="space-y-6">
            <section className="bb-card p-5 sm:p-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-sky-400">{document.eyebrow}</p>
              <h2 className="mt-3 text-3xl sm:text-5xl font-black tracking-tight text-blue-50">{document.title}</h2>
              <div className="mt-5 space-y-4">
                {document.intro.map((paragraph) => (
                  <p key={paragraph} className="text-sm sm:text-[15px] leading-8 text-slate-400">
                    {paragraph}
                  </p>
                ))}
              </div>
              <div
                className="mt-6 rounded-lg p-4"
                style={{ backgroundColor: "rgba(244,63,94,0.07)", border: "1px solid rgba(244,63,94,0.18)" }}
              >
                <p className="text-sm font-bold text-rose-300">Core disclosure</p>
                <p className="mt-2 text-sm leading-7 text-slate-400">
                  BullBrief is not investment advice. BullBrief is not a registered investment adviser or broker-dealer. You are solely responsible for your own financial decisions.
                </p>
              </div>
            </section>

            {document.sections.map((section) => (
              <section
                key={section.title}
                id={slugify(section.title)}
                className="bb-card p-5 sm:p-6 scroll-mt-28"
              >
                <h3 className="text-xl font-bold tracking-tight text-blue-50">{section.title}</h3>
                <div className="mt-4 space-y-4">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="text-sm leading-8 text-slate-400">
                      {paragraph}
                    </p>
                  ))}
                </div>
                {section.bullets && section.bullets.length > 0 && (
                  <ul className="mt-5 space-y-3">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-3 text-sm leading-7 text-slate-400">
                        <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}

            <section className="bb-card p-5 sm:p-6">
              <h3 className="text-xl font-bold tracking-tight text-blue-50">Final Reminder</h3>
              <p className="mt-4 text-sm leading-8 text-slate-400">
                BullBrief is a research and education tool. It is not a substitute for your own judgment, primary source review, or advice from qualified professionals who understand your individual circumstances.
              </p>
            </section>
          </article>
        </div>
      </div>
    </main>
  );
}
