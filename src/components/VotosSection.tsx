import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";

type Item = {
  id: string;
  categoria: "voto" | "discurso";
  autor: string;
  papel: string | null;
  texto: string;
};

/** Votos dos noivos e discursos dos amigos, em dois separadores. Some se não houver nada publicado. */
export function VotosSection() {
  const { lang } = useI18n();
  const en = lang === "en";
  const [items, setItems] = useState<Item[] | null>(null);
  const [tab, setTab] = useState<"voto" | "discurso">("voto");

  useEffect(() => {
    supabase
      .from("votos_discursos")
      .select("id,categoria,autor,papel,texto")
      .eq("publicado", true)
      .order("ordem")
      .then(({ data }) => {
        const list = (data as Item[]) ?? [];
        setItems(list);
        if (!list.some((i) => i.categoria === "voto") && list.length) setTab("discurso");
      });
  }, []);

  if (!items || items.length === 0) return null;
  const temVotos = items.some((i) => i.categoria === "voto");
  const temDiscursos = items.some((i) => i.categoria === "discurso");
  const lista = items.filter((i) => i.categoria === tab);

  const tabs: { k: "voto" | "discurso"; label: string; show: boolean }[] = [
    { k: "voto", label: en ? "Our vows" : "Os nossos votos", show: temVotos },
    { k: "discurso", label: en ? "Words from friends" : "Palavras dos amigos", show: temDiscursos },
  ];

  return (
    <section id="votos" className="section section-ivory">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-6 sm:mb-10">
          <p className="text-[0.6rem] sm:text-xs uppercase tracking-[0.35em] text-muted-foreground mb-2">
            {en ? "In writing" : "Por escrito"}
          </p>
          <h2 className="font-display text-3xl sm:text-5xl md:text-6xl text-primary">
            {en ? "Vows & Speeches" : "Votos & Discursos"}
          </h2>
          <div className="divider-ornament mt-3 sm:mt-6 max-w-xs mx-auto">
            <Heart className="w-3 h-3" strokeWidth={1} />
          </div>
        </div>

        {temVotos && temDiscursos && (
          <div role="tablist" className="flex justify-center gap-6 mb-6 sm:mb-8">
            {tabs.map((t) => (
              <button
                key={t.k}
                role="tab"
                aria-selected={tab === t.k}
                onClick={() => setTab(t.k)}
                className="uppercase text-xs sm:text-sm pb-1.5 transition-colors"
                style={{
                  fontFamily: "Cinzel, serif",
                  letterSpacing: "0.2em",
                  color: tab === t.k ? "var(--olive)" : "var(--muted-foreground)",
                  borderBottom: `1px solid ${tab === t.k ? "var(--gold)" : "transparent"}`,
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}

        <div className="space-y-5 sm:space-y-6">
          {lista.map((it) => (
            <article
              key={it.id}
              className="relative px-5 py-7 sm:px-10 sm:py-10"
              style={{
                background: "var(--ivory)",
                border: "1px solid var(--gold)",
                borderRadius: "var(--card-radius)",
                boxShadow:
                  "0 1px 2px color-mix(in oklab, var(--olive) 8%, transparent), 0 18px 40px -22px color-mix(in oklab, var(--olive) 25%, transparent)",
              }}
            >
              <span
                aria-hidden
                className="absolute left-4 top-1 sm:left-6 font-display select-none"
                style={{ color: "var(--gold)", fontSize: 64, lineHeight: 1, opacity: 0.5 }}
              >
                “
              </span>
              <p
                className="whitespace-pre-line text-[0.95rem] sm:text-base"
                style={{ fontFamily: "Georgia, serif", lineHeight: 1.8, color: "var(--foreground)" }}
              >
                {it.texto}
              </p>
              <footer className="mt-5 text-right">
                <p style={{ fontFamily: "Allura, cursive", color: "var(--gold)", fontSize: 30, lineHeight: 1.1 }}>
                  {it.autor}
                </p>
                {it.papel && (
                  <p className="text-[0.65rem] uppercase tracking-[0.25em] text-muted-foreground mt-1">
                    {it.papel}
                  </p>
                )}
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
