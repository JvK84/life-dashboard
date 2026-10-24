import { Archive, ArrowUpRight, Check, LoaderCircle, Mail } from "lucide-react";
import type { InboxMessage } from "@/src/types/inbox";

type InboxWidgetProps = {
  archived: boolean;
  error: string | null;
  isConnected: boolean;
  isLoading: boolean;
  messages: InboxMessage[];
  onArchive: () => void;
};

function formatMessageDate(date: string): string {
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return date;
  return new Intl.DateTimeFormat("es-ES", { dateStyle: "medium", timeStyle: "short" }).format(parsedDate);
}

function getSenderInitials(sender: string): string {
  const initials = sender
    .replace(/<[^>]+>/g, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toLocaleUpperCase() ?? "")
    .join("");

  return initials || "?";
}

export function InboxWidget({ archived, error, isConnected, isLoading, messages, onArchive }: InboxWidgetProps) {
  const visibleMessages = archived ? [] : messages;
  const heading = archived ? "Todo al día." : `${messages.length} ${messages.length === 1 ? "correo espera." : "correos esperan."}`;

  return (
    <section className="rounded-[28px] bg-white p-6 shadow-soft dark:bg-[#1c1c20] lg:col-span-5 lg:p-8">
      <div className="mb-7 flex items-start justify-between">
        <div>
          <div className="mb-3 flex items-center gap-2 text-sm text-black/45 dark:text-white/55"><Mail size={16} /> Bandeja de entrada</div>
          <h2 className="text-2xl font-semibold tracking-tight">{isLoading ? "Cargando correo…" : heading}</h2>
        </div>
        <button type="button" aria-label="Archivar correos" onClick={onArchive} disabled={isLoading} className="rounded-full bg-paper p-2 text-black/50 hover:text-ink disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white/10 dark:text-white/60"><Archive size={17} /></button>
      </div>
      {isLoading ? <div className="grid min-h-36 place-items-center text-center text-sm text-black/45 dark:text-white/55" aria-live="polite"><LoaderCircle className="mb-2 animate-spin" aria-hidden="true" /> Cargando mensajes…</div> : archived ? <div className="grid min-h-36 place-items-center text-center text-sm text-black/45 dark:text-white/55"><Check className="mb-2 text-green-600" /> Inbox limpia</div> : error ? <div className="min-h-36 text-sm text-black/55 dark:text-white/60" role="alert"><p>{error}</p>{!isConnected && <a className="mt-3 inline-flex items-center gap-1 font-medium text-ink underline dark:text-white" href="/api/integrations/google/calendar/connect">Conectar Google <ArrowUpRight size={15} /></a>}</div> : visibleMessages.length === 0 ? <div className="grid min-h-36 place-items-center text-center text-sm text-black/45 dark:text-white/55"><Check className="mb-2 text-green-600" /> Inbox limpia</div> : <div className="max-h-72 space-y-3 overflow-y-auto overscroll-contain pr-2">{visibleMessages.map((message) => <article key={message.id} aria-label={`Correo de ${message.sender}: ${message.subject}`} className="rounded-2xl border border-black/5 bg-paper/70 p-4 transition-colors hover:border-black/10 dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-white/20"><div className="flex items-start gap-3"><div aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-full bg-lime text-xs font-bold text-ink">{getSenderInitials(message.sender)}</div><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-3"><p className="truncate text-sm font-semibold">{message.sender}</p><time dateTime={message.date} className="shrink-0 text-[11px] text-black/40 dark:text-white/40">{formatMessageDate(message.date)}</time></div><h3 className="mt-2 truncate text-sm font-medium text-ink dark:text-white">{message.subject}</h3>{message.snippet && <p className="mt-2 line-clamp-2 border-l-2 border-lime pl-3 text-xs leading-5 text-black/50 dark:text-white/50">{message.snippet}</p>}</div>{message.unread && <span aria-label="No leído" className="mt-1 size-2 shrink-0 rounded-full bg-lime" />}</div></article>)}<a href="https://mail.google.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 px-1 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink">Abrir Gmail <ArrowUpRight size={15} /></a></div>}
    </section>
  );
}
