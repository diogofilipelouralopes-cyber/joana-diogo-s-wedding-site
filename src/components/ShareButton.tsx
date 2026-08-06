import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Share2, Link, MessageCircle } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";

const SITE_URL = "https://joanaediogo-com.lovable.app";
const WA_URL = `https://wa.me/?text=${encodeURIComponent("Joana & Diogo - 19 Setembro 2026 🌿 " + SITE_URL)}`;

export function ShareButton() {
  const { lang } = useI18n();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  function copyLink() {
    navigator.clipboard.writeText(SITE_URL).then(() => {
      toast.success(lang === "en" ? "Link copied! 🔗" : "Link copiado! 🔗");
    });
  }

  const btn = (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={lang === "en" ? "Share this site" : "Partilhar o site"}
          style={{
            position: "fixed",
            bottom: "calc(5.5rem + env(safe-area-inset-bottom, 0px))",
            left: "3.5rem",
            zIndex: 54,
            width: 40,
            height: 40,
            borderRadius: "999px",
            background: "color-mix(in oklab, var(--ivory, var(--background)) 85%, transparent)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid color-mix(in oklab, var(--gold) 40%, transparent)",
            boxShadow: "0 2px 12px color-mix(in oklab, var(--gold) 14%, transparent)",
            color: "color-mix(in oklab, var(--gold) 85%, #6b5a2e)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.2s ease",
          }}
        >
          <Share2 size={17} strokeWidth={1.8} />
        </button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="start"
        className="w-52 p-2"
        style={{
          background: "color-mix(in oklab, var(--ivory, var(--background)) 92%, transparent)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          border: "1px solid color-mix(in oklab, var(--gold) 40%, transparent)",
        }}
      >
        <a
          href={WA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="qa-popover-link"
        >
          <MessageCircle size={15} />
          {lang === "en" ? "Share via WhatsApp" : "Partilhar no WhatsApp"}
        </a>
        <button type="button" onClick={copyLink} className="qa-popover-link w-full text-left">
          <Link size={15} />
          {lang === "en" ? "Copy link" : "Copiar link"}
        </button>
      </PopoverContent>
    </Popover>
  );

  return createPortal(btn, document.body);
}
