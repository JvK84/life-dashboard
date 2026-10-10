import { Sun, Zap } from "lucide-react";

export function EnergyWidget() {
  return (
    <section className="rounded-[28px] bg-lime p-6 shadow-soft lg:col-span-5 lg:p-8"><div className="mb-8 flex items-start justify-between"><div><div className="mb-3 flex items-center gap-2 text-sm text-ink/55"><Zap size={16} /> Tu energía</div><h2 className="text-2xl font-semibold tracking-tight">Buen ritmo hoy.</h2></div><Sun size={28} className="text-ink/70" /></div><div className="mb-6 flex items-end gap-3"><span className="text-7xl font-semibold leading-none tracking-[-0.08em]">78</span><span className="pb-2 text-sm text-ink/55">/ 100</span></div><div className="mb-7 h-2 overflow-hidden rounded-full bg-ink/10"><div className="h-full w-[78%] rounded-full bg-ink" /></div><p className="max-w-xs text-sm leading-6 text-ink/65">Has dormido bien y tu mañana está despejada. Guarda tu foco para lo importante.</p></section>
  );
}
