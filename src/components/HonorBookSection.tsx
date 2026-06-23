import { useEffect, useState } from "react";
import { BookHeart } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";

type Entry = {
  id: string;
  name: string;
  message: string;
  created_at: string;
};

export function HonorBookSection() {
  const { lang } = useI18n();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("rsvps")
      .select("id, name, message, created_at")
      .eq("attending", true)
      .not("message", "is", null)
      .neq("message", "")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setEntries((data ?? []) as Entry[]);
        setLoading(false);
      });
  }, []);

  if (!loading && entries.length === 0) return null;

  const title = lang === "en" ? "Book of Honour" : "Livro de Honra";
  const subtitle = lang === "en" ? "words from our guests" : "palavras dos nossos convidados";

  return (
    <section
      id="livro"
      className="py-20 sm:py-28 px-5 sm:px-6 scroll-mt-24"
      style={{ background: "var(--cream)" }}
    >
      <div className="max-w-3xl mx-auto">
        {/* Título */}
        <div className="text-center mb-10 sm:mb-12">
          <h2
            className="uppercase text-xl sm:text-2xl md:text-3xl"
            style={{
              fontFamily: "Cinzel, serif",
              color: "var(--olive)",
              letterSpacing: "0.3em",
              fontWeight: 500,
            }}
          >
            {title}
          </h2>
          <p
            className="italic mt-3 text-3xl sm:text-4xl"
            style={{
              fontFamily: "Allura, 'Great Vibes', cursive",
              color: "var(--gold)",
              lineHeight: 1.1,
            }}
          >
            {subtitle}
          </p>
          <div className="flex items-center justify-center gap-4 mt-6 max-w-xs mx-auto">
            <span style={{ flex: 1, borderTop: "1px dashed color-mix(in oklab, var(--olive) 30%, transparent)" }} />
            <BookHeart size={16} strokeWidth={1.25} style={{ color: "var(--gold)" }} />
            <span style={{ flex: 1, borderTop: "1px dashed color-mix(in oklab, var(--olive) 30%, transparent)" }} />
          </div>
        </div>

        {/* Mensagens */}
        {loading ? (
          <p className="text-center text-muted-foreground" style={{ fontFamily: "Cinzel, serif", fontSize: "0.75rem", letterSpacing: "0.1em" }}>
            {lang === "en" ? "Loading…" : "A carregar…"}
          </p>
        ) : (
          <div className="space-y-5">
            {entries.map((e) => (
              <div
                key={e.id}
                style={{
                  background: "var(--ivory)",
                  border: "1px solid color-mix(in oklab, var(--gold) 28%, transparent)",
                  borderRadius: 10,
                  padding: "20px 24px",
                }}
              >
                <p
                  style={{
                    fontFamily: "Georgia, serif",
                    fontSize: "0.95rem",
                    color: "var(--foreground)",
                    lineHeight: 1.65,
                    fontStyle: "italic",
                  }}
                >
                  "{e.message}"
                </p>

              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
