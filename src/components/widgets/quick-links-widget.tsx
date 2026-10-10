import { ArrowUpRight, Plus } from "lucide-react";

const links = ["Notion", "GitHub", "Linear", "Mis scripts"];

export function QuickLinksWidget() {
  return (
    <section className="rounded-[28px] bg-white p-6 shadow-soft lg:col-span-12 lg:p-8"><div className="mb-5 flex items-center justify-between"><div><div className="mb-2 flex items-center gap-2 text-sm text-black/45">Atajos rápidos</div><h2 className="text-xl font-semibold tracking-tight">Tu kit de herramientas</h2></div><button aria-label="Añadir atajo" className="grid size-9 place-items-center rounded-full bg-paper"><Plus size={17} /></button></div><div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{links.map((link) => <a key={link} href={`#${link.toLowerCase().replace(" ", "-")}`} className="flex items-center justify-between rounded-2xl bg-paper p-4 text-sm font-medium transition hover:-translate-y-0.5"><span>{link}</span><ArrowUpRight size={15} className="text-black/35" /></a>)}</div></section>
  );
}
