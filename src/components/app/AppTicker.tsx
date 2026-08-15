import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";

type Announcement = {
  id: string;
  message: string;
  message_en: string;
  active: boolean;
  updated_at: string;
};

/** Barra de anúncios (ticker) opcional no topo da app. */
export function AppTicker() {
  const { lang } = useI18n();
  const [ann, setAnn] = useState<Announcement | null>(null);

  async function load() {
    const { data } = await supabase
      .from("announcements")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    setAnn((data as Announcement | null) ?? null);
  }

  useEffect(() => {
    load();
    const channel = supabase
      .channel("announcements-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "announcements" },
        () => load(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const activeMessage =
    lang === "en"
      ? ann?.message_en?.trim()
        ? ann.message_en
        : ann?.message ?? ""
      : ann?.message ?? "";

  const visible = !!(ann && ann.active && activeMessage.trim());
  if (!visible) return null;

  const lines = activeMessage
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  let items = [...lines];
  while (items.length < 4) items = [...items, ...lines];

  return (
    <div role="status" aria-live="polite" className="app-ticker">
      <div className="app-ticker-track">
        {[...items, ...items].map((txt, i) => (
          <span key={i} className="app-ticker-item">
            <span className="app-ticker-sep" aria-hidden="true">
              ·
            </span>
            {txt}
          </span>
        ))}
      </div>
    </div>
  );
}
