import { useState } from "react";
import { Copy, Check, ChevronDown, Landmark, Smartphone, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

const ibanPT = "PT50 0035 0836 0068 8932 0308 1";
const ibanRev = "BE66 6502 5539 2943";
const mbwayNumber = "+351 912 633 104";

type Entry = {
  id: string;
  icon: typeof Landmark;
  label: string;
  owner: string;
  value: string;
  copyLabel: string;
  copiedLabel: string;
};

export function GiftsSection() {
  const { t } = useI18n();
  const [openId, setOpenId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const entries: Entry[] = [
    {
      id: "pt",
      icon: Landmark,
      label: t("gifts.pt"),
      owner: "Joana Maria Dias Nora",
      value: ibanPT,
      copyLabel: t("gifts.copy.iban"),
      copiedLabel: t("gifts.copied.iban"),
    },
    {
      id: "rev",
      icon: CreditCard,
      label: t("gifts.rev"),
      owner: "Diogo Lopes & Joana Nora",
      value: ibanRev,
      copyLabel: t("gifts.copy.iban"),
      copiedLabel: t("gifts.copied.iban"),
    },
    {
      id: "mbway",
      icon: Smartphone,
      label: t("gifts.mbway"),
      owner: "Joana Nora",
      value: mbwayNumber,
      copyLabel: t("gifts.copy.number"),
      copiedLabel: t("gifts.copied.number"),
    },
  ];

  const copy = (entry: Entry) => {
    navigator.clipboard.writeText(entry.value.replace(/\s/g, ""));
    setCopiedId(entry.id);
    window.setTimeout(() => setCopiedId((c) => (c === entry.id ? null : c)), 2000);
    toast(entry.copiedLabel, {
      style: {
        background: "var(--gold)",
        color: "var(--ivory)",
        border: "1px solid var(--gold)",
        fontFamily: "Cinzel, serif",
        letterSpacing: "0.15em",
        fontSize: "0.8rem",
        textTransform: "uppercase",
      },
      duration: 2000,
    });
  };

  return (
    <section id="gifts" className="py-6 sm:py-10 px-4 sm:px-6 bg-secondary/40 scroll-mt-24">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-3 sm:mb-5">
          <p className="text-[0.6rem] sm:text-xs uppercase tracking-[0.35em] text-muted-foreground mb-1">
            {t("gifts.kicker")}
          </p>
          <h2 className="font-display text-2xl sm:text-4xl text-primary">{t("gifts.title")}</h2>
          <p className="mt-2 text-foreground/75 text-[0.8rem] sm:text-sm leading-snug">
            {t("gifts.desc")}
          </p>
        </div>

        <div className="card-gold overflow-hidden divide-y divide-primary/15">
          {entries.map((entry) => {
            const Icon = entry.icon;
            const isOpen = openId === entry.id;
            return (
              <div key={entry.id}>
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : entry.id)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-primary/5"
                  style={{ minHeight: 52 }}
                >
                  <Icon className="w-4 h-4 shrink-0 text-primary" strokeWidth={1.5} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[0.7rem] sm:text-xs uppercase tracking-[0.2em] text-primary">
                      {entry.label}
                    </span>
                    <span className="block truncate text-[0.7rem] text-muted-foreground">
                      {entry.owner}
                    </span>
                  </span>
                  <ChevronDown
                    className="w-4 h-4 shrink-0 text-primary/70 transition-transform"
                    style={{ transform: isOpen ? "rotate(180deg)" : undefined }}
                    strokeWidth={1.5}
                  />
                </button>

                {isOpen && (
                  <div className="flex items-center justify-between gap-2 px-4 pb-3 flex-wrap">
                    <p className="font-mono text-xs sm:text-sm text-foreground/85 tracking-wider break-all">
                      {entry.value}
                    </p>
                    <button
                      type="button"
                      onClick={() => copy(entry)}
                      className="inline-flex items-center gap-2 rounded border border-primary/40 px-3 py-1.5 text-[0.7rem] uppercase tracking-[0.18em] text-primary transition-colors hover:bg-primary/5"
                      style={{ minHeight: 40 }}
                    >
                      {copiedId === entry.id ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      {entry.copyLabel}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
