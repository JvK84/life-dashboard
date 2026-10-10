import { Archive, ArrowUpRight, Check, Mail } from "lucide-react";

export function InboxWidget({ archived, onArchive }: { archived: boolean; onArchive: () => void }) {
  return (
    <section className="rounded-[28px] bg-white p-6 shadow-soft lg:col-span-5 lg:p-8"><div className="mb-7 flex items-start justify-between"><div><div className="mb-3 flex items-center gap-2 text-sm text-black/45"><Mail size={16} /> Bandeja de entrada</div><h2 className="text-2xl font-semibold tracking-tight">{archived ? "Todo al día." : "3 correos esperan."}</h2></div><button aria-label="Archivar correos" onClick={onArchive} className="rounded-full bg-paper p-2 text-black/50 hover:text-ink"><Archive size={17} /></button></div>{archived ? <div className="grid min-h-36 place-items-center text-center text-sm text-black/45"><Check className="mb-2 text-green-600" /> Inbox limpia</div> : <div className="space-y-5"><div><p className="text-sm font-medium">Marta · Nuevo feedback del sprint</p><p className="mt-1 text-xs text-black/40">Hace 12 minutos</p></div><div><p className="text-sm font-medium">Linear · Tienes 2 tareas asignadas</p><p className="mt-1 text-xs text-black/40">Hace 1 hora</p></div><button className="flex items-center gap-1 text-sm font-medium text-black/60">Abrir Gmail <ArrowUpRight size={15} /></button></div>}</section>
  );
}
