import Link from "next/link";

export default function SitewideLegalNotice() {
  return (
    <section aria-label="Legal notice" className="bg-[#060c1a] border-t border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-6 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <p className="text-xs leading-5 text-slate-700">
          BullBrief is educational research software only. It is not investment advice, a recommendation, a broker-dealer, or a registered investment adviser.
        </p>
        <div className="flex items-center gap-3 text-xs">
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
