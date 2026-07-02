import { TONE } from "@/app/lib/tone";

export default function MasterCompareSummary({ summary }: { summary: string }) {
  if (!summary) return null;

  return (
    <div
      className="bb-card overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${TONE.sky.hex}12 0%, ${TONE.indigo.hex}12 100%)`,
        borderColor: `${TONE.sky.hex}33`,
      }}
    >
      <div className="px-3 py-3 flex items-center gap-2.5 border-b border-sky-400/10">
        <span className="w-2 h-2 rounded-full bg-sky-400 animate-live" />
        <p className="text-xs font-semibold text-sky-400 uppercase tracking-wide">
          AI Master Comparison
        </p>
      </div>
      <div className="px-3 py-3">
        <p className="text-sm text-slate-400 leading-relaxed">{summary}</p>
      </div>
    </div>
  );
}
