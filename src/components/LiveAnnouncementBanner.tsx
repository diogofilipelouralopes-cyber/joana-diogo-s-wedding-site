import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Announcement = {
  id: string;
  message: string;
  active: boolean;
  updated_at: string;
};

export function LiveAnnouncementBanner() {
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

  if (!ann || !ann.active || !ann.message?.trim()) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="w-full text-center px-4 py-2 text-sm"
      style={{
        background: "var(--gold)",
        color: "#000",
        fontFamily: "Cinzel, serif",
        letterSpacing: "0.12em",
        position: "fixed",
        top: 72,
        left: 0,
        right: 0,
        zIndex: 45,
        boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
      }}
    >
      {ann.message}
    </div>
  );
}
