import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Heart,
  Eye,
  EyeOff,
  Trash2,
  Loader2,
  MessageCircleHeart,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Mensagem {
  id: string;
  nome: string;
  mensagem: string;
  created_at: string;
  lida: boolean;
  favorita: boolean;
}

type Filter = "all" | "unread" | "favorite";
type Sort = "recent" | "oldest" | "favorites";

export function AdminMensagens() {
  const [items, setItems] = useState<Mensagem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("recent");
  const [toDelete, setToDelete] = useState<Mensagem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [fadingIds, setFadingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setLoading(true);
    supabase
      .from("mensagens")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) toast.error("Não foi possível carregar mensagens.");
        else setItems((data ?? []) as Mensagem[]);
        setLoading(false);
      });
  }, []);

  const counts = useMemo(() => {
    return {
      all: items.length,
      unread: items.filter((m) => !m.lida).length,
      favorite: items.filter((m) => m.favorita).length,
    };
  }, [items]);

  const visible = useMemo(() => {
    let list = items.slice();
    if (filter === "unread") list = list.filter((m) => !m.lida);
    else if (filter === "favorite") list = list.filter((m) => m.favorita);

    if (sort === "recent") {
      list.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
    } else if (sort === "oldest") {
      list.sort((a, b) => +new Date(a.created_at) - +new Date(b.created_at));
    } else if (sort === "favorites") {
      list.sort((a, b) => {
        if (a.favorita !== b.favorita) return a.favorita ? -1 : 1;
        return +new Date(b.created_at) - +new Date(a.created_at);
      });
    }
    return list;
  }, [items, filter, sort]);

  async function toggleField(m: Mensagem, field: "lida" | "favorita") {
    const next = !m[field];
    setItems((prev) => prev.map((x) => (x.id === m.id ? { ...x, [field]: next } : x)));
    const { error } = await supabase
      .from("mensagens")
      .update({ [field]: next })
      .eq("id", m.id);
    if (error) {
      toast.error("Erro ao atualizar.");
      setItems((prev) => prev.map((x) => (x.id === m.id ? { ...x, [field]: !next } : x)));
    }
  }

  async function confirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    const target = toDelete;
    const { error } = await supabase.from("mensagens").delete().eq("id", target.id);
    setDeleting(false);
    if (error) {
      toast.error("Erro ao eliminar.");
      return;
    }
    setToDelete(null);
    setFadingIds((prev) => new Set(prev).add(target.id));
    toast.success(`✅ Mensagem de ${target.nome} eliminada`);
    setTimeout(() => {
      setItems((prev) => prev.filter((x) => x.id !== target.id));
      setFadingIds((prev) => {
        const n = new Set(prev);
        n.delete(target.id);
        return n;
      });
    }, 300);
  }

  const filterChips: { key: Filter; label: string; count: number }[] = [
    { key: "all", label: "Todas", count: counts.all },
    { key: "unread", label: "Não lidas", count: counts.unread },
    { key: "favorite", label: "Favoritas", count: counts.favorite },
  ];

  return (
    <div>
      <p className="text-sm text-muted-foreground mb-4">
        <span className="font-medium text-foreground">{counts.all}</span> mensagens ·{" "}
        <span className="font-medium">{counts.unread}</span> não lidas ·{" "}
        <span style={{ color: "var(--gold)" }} className="font-medium">{counts.favorite}</span> favoritas
      </p>

      <div className="flex flex-wrap gap-3 mb-6 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {filterChips.map((c) => {
            const active = filter === c.key;
            return (
              <button
                key={c.key}
                onClick={() => setFilter(c.key)}
                className="px-4 py-2 text-xs uppercase tracking-[0.15em] rounded-full border transition-all"
                style={{
                  background: active ? "var(--gold)" : "transparent",
                  color: active ? "#fff" : "var(--muted-foreground)",
                  borderColor: active ? "var(--gold)" : "var(--border)",
                }}
              >
                {c.label} ({c.count})
              </button>
            );
          })}
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as Sort)}
          className="h-9 px-3 rounded-md border border-input bg-background text-sm"
        >
          <option value="recent">Mais recentes</option>
          <option value="oldest">Mais antigas</option>
          <option value="favorites">Favoritas primeiro</option>
        </select>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
        </div>
      ) : visible.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground flex flex-col items-center gap-3">
          <MessageCircleHeart className="w-10 h-10" style={{ color: "var(--gold)", opacity: 0.5 }} />
          Sem mensagens.
        </div>
      ) : (
        <div className="space-y-6">
          {visible.map((m) => (
            <article
              key={m.id}
              className={`transition-opacity duration-300 ${
                fadingIds.has(m.id) ? "opacity-0" : "opacity-100"
              }`}
              style={{
                background: "var(--cream)",
                backgroundImage:
                  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' seed='5'/><feColorMatrix values='0 0 0 0 0.72  0 0 0 0 0.58  0 0 0 0 0.35  0 0 0 0.05 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
                backgroundRepeat: "repeat",
                border: "1px solid color-mix(in oklab, var(--gold) 55%, transparent)",
                borderRadius: 8,
                padding: "clamp(24px, 4vw, 40px)",
                boxShadow:
                  "0 1px 2px color-mix(in oklab, var(--olive) 8%, transparent), 0 12px 30px -20px color-mix(in oklab, var(--olive) 25%, transparent)",
                position: "relative",
                opacity: m.lida ? 0.85 : 1,
              }}
            >
              {!m.lida && (
                <span
                  aria-label="Não lida"
                  className="absolute top-3 right-3 inline-block rounded-full"
                  style={{ width: 8, height: 8, background: "var(--gold)" }}
                />
              )}
              <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
                <h3
                  className="uppercase text-sm sm:text-base"
                  style={{
                    fontFamily: "Cinzel, serif",
                    color: "var(--olive)",
                    letterSpacing: "0.2em",
                    fontWeight: 500,
                  }}
                >
                  De {m.nome}
                </h3>
                <p className="italic text-xs text-muted-foreground">
                  {new Date(m.created_at).toLocaleString("pt-PT", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              <div
                className="flex items-center justify-center my-3 max-w-xs mx-auto"
                aria-hidden
              >
                <span
                  style={{ flex: 1, borderTop: "1px dashed var(--olive)", opacity: 0.35 }}
                />
                <Heart size={12} className="mx-2" style={{ color: "var(--gold)" }} />
                <span
                  style={{ flex: 1, borderTop: "1px dashed var(--olive)", opacity: 0.35 }}
                />
              </div>

              <p
                className="italic whitespace-pre-wrap"
                style={{
                  fontFamily: "Lato, sans-serif",
                  color: "var(--olive)",
                  fontSize: "1.05rem",
                  lineHeight: 1.8,
                }}
              >
                {m.mensagem}
              </p>

              <div className="flex justify-end gap-1 mt-4">
                <TooltipProvider delayDuration={200}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => toggleField(m, "favorita")}
                        aria-label={m.favorita ? "Desmarcar favorita" : "Marcar favorita"}
                        className="inline-flex items-center justify-center w-10 h-10 rounded-full transition-all hover:scale-110"
                        style={{
                          color: m.favorita ? "var(--gold)" : "#9CA3AF",
                        }}
                      >
                        <Heart
                          size={18}
                          strokeWidth={1.75}
                          fill={m.favorita ? "var(--gold)" : "none"}
                        />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>{m.favorita ? "Remover favorita" : "Marcar favorita"}</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => toggleField(m, "lida")}
                        aria-label={m.lida ? "Marcar como não lida" : "Marcar como lida"}
                        className="inline-flex items-center justify-center w-10 h-10 rounded-full text-[#9CA3AF] hover:text-[var(--olive)] hover:scale-110 transition-all"
                      >
                        {m.lida ? (
                          <EyeOff size={18} strokeWidth={1.75} />
                        ) : (
                          <Eye size={18} strokeWidth={1.75} />
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>{m.lida ? "Marcar como não lida" : "Marcar como lida"}</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => setToDelete(m)}
                        aria-label={`Eliminar mensagem de ${m.nome}`}
                        className="inline-flex items-center justify-center w-10 h-10 rounded-full text-[#9CA3AF] hover:text-[#B85C5C] hover:scale-110 transition-all"
                      >
                        <Trash2 size={18} strokeWidth={1.75} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Eliminar</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </article>
          ))}
        </div>
      )}

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && !deleting && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar mensagem?</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                {toDelete && (
                  <div className="bg-muted/50 border border-border p-3 text-sm text-foreground space-y-1">
                    <p>
                      <span className="text-muted-foreground">De:</span>{" "}
                      <strong>{toDelete.nome}</strong>
                    </p>
                    <p className="italic text-muted-foreground line-clamp-3">
                      "{toDelete.mensagem}"
                    </p>
                  </div>
                )}
                <p className="text-[#B85C5C] font-medium">Esta ação é irreversível.</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                confirmDelete();
              }}
              disabled={deleting}
              className="bg-transparent border border-[#B85C5C] text-[#B85C5C] hover:bg-[#B85C5C] hover:text-white"
            >
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
