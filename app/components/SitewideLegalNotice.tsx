import Link from "next/link";

export default function SitewideLegalNotice() {
  return (
    <section
      aria-label="Legal notice"
      style={{ backgroundColor: "#060c1a", borderTop: "1px solid rgba(56, 189, 248, 0.05)" }}
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <p className="text-[10px] leading-5 text-slate-700">
          BullBrief is educational research software only. It is not investment advice, a recommendation, a broker-dealer, or a registered investment adviser.
        </p>
        <div className="flex items-center gap-3 text-[10px]">
          <Link href="/terms" className="text-slate-600 hover:text-sky-400 transition-colors">
            Terms
          </Link>
          <Link href="/disclaimer" className="text-slate-600 hover:text-sky-400 transition-colors">
            Disclaimer
          </Link>
          <Link href="/privacy" className="text-slate-600 hover:text-sky-400 transition-colors">
            Privacy
          </Link>
        </div>
      </div>
    </section>
  );
}
