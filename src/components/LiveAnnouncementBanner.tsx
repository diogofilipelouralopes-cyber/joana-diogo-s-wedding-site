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

  const visible = !!(ann && ann.active && ann.message?.trim());

  // Empurra o header para baixo enquanto o ticker está visível
  useEffect(() => {
    const cls = "has-announcement";
    if (visible) document.body.classList.add(cls);
    else document.body.classList.remove(cls);
    return () => document.body.classList.remove(cls);
  }, [visible]);

  if (!visible) return null;

  // Repete a mensagem algumas vezes para preencher a linha em loop contínuo
  const text = ann!.message.trim();
  const repeated = Array.from({ length: 4 }, () => text);

  return (
    <div
      role="status"
      aria-live="polite"
      className="announcement-ticker"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 60,
        background: "var(--gold)",
        color: "#1a1a1a",
        height: 34,
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
      }}
    >
      <div className="announcement-track">
        {repeated.map((t, i) => (
          <span key={i} className="announcement-item">
            <span style={{ margin: "0 1.5rem" }}>✦</span>
            {t}
          </span>
        ))}
        {/* duplicado para loop perfeito */}
        {repeated.map((t, i) => (
          <span key={`dup-${i}`} className="announcement-item">
            <span style={{ margin: "0 1.5rem" }}>✦</span>
            {t}
          </span>
        ))}
      </div>
      <style>{`
        .announcement-track {
          display: inline-flex;
          white-space: nowrap;
          will-change: transform;
          animation: ticker-scroll 28s linear infinite;
        }
        .announcement-item {
          font-family: "Cinzel", serif;
          font-size: 0.72rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          display: inline-flex;
          align-items: center;
        }
        @keyframes ticker-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .announcement-ticker:hover .announcement-track {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .announcement-track { animation: none; }
        }
      `}</style>
    </div>
  );
}
