type Exec = { name: string; title: string; pay: string };

export default function ExecutiveCard({ exec }: { exec: Exec }) {
  const formattedPay =
    exec.pay === "--" ? "Not Disclosed" : `$${Number(exec.pay).toLocaleString()}`;

  return (
    <div
      className="bb-card bb-card-hover p-3 space-y-2"
    >
      <div>
        <h3 className="text-sm font-semibold text-blue-50 leading-snug">{exec.name}</h3>
        <p className="text-xs text-slate-500 mt-0.5">{exec.title}</p>
      </div>
      <p className={`text-xs font-mono tabular-nums ${exec.pay === "--" ? "text-slate-700" : "text-emerald-400"}`}>
        {formattedPay}
      </p>
    </div>
  );
}
