import { Heart, Copy, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

const ibanPT = "PT50 0035 0836 0068 8932 0308 1";
const ibanRev = "BE66 6502 5539 2943";

export function GiftsSection() {
  const { t } = useI18n();

  const copy = (value: string) => {
    navigator.clipboard.writeText(value.replace(/\s/g, ""));
    toast.success(t("gifts.copied"));
  };

  return (
    <section id="gifts" className="py-24 sm:py-32 px-6 bg-secondary/40 scroll-mt-20">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground mb-3">
            With gratitude
          </p>
          <h2 className="font-display text-5xl sm:text-6xl text-primary">{t("gifts.title")}</h2>
          <div className="divider-ornament mt-6 max-w-xs mx-auto">
            <Heart className="w-3 h-3" strokeWidth={1} />
          </div>
          <p className="mt-6 text-foreground/75 max-w-xl mx-auto">{t("gifts.desc")}</p>
        </div>

        <div className="grid sm:grid-cols-1 gap-5">
          <GiftCard
            label={t("gifts.pt")}
            owner="Joana Maria Dias Nora"
            value={ibanPT}
            onCopy={() => copy(ibanPT)}
            copyLabel={t("gifts.copy")}
          />
          <GiftCard
            label={t("gifts.rev")}
            owner="Diogo Lopes & Joana Nora"
            value={ibanRev}
            onCopy={() => copy(ibanRev)}
            copyLabel={t("gifts.copy")}
          />
          <div className="bg-background border border-border p-7 sm:p-8">
            <div className="flex items-center gap-2 mb-3">
              <Smartphone className="w-4 h-4 text-primary" strokeWidth={1.5} />
              <h3 className="font-display text-xl text-primary">{t("gifts.mbway")}</h3>
            </div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">
              Joana Nora
            </p>
            <p className="font-display text-2xl text-foreground">+351 912 633 104</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function GiftCard({
  label,
  owner,
  value,
  onCopy,
  copyLabel,
}: {
  label: string;
  owner: string;
  value: string;
  onCopy: () => void;
  copyLabel: string;
}) {
  return (
    <div className="bg-background border border-border p-7 sm:p-8">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">{label}</p>
      <p className="font-display text-xl text-primary mb-3">{owner}</p>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p className="font-mono text-sm sm:text-base text-foreground/85 tracking-wider">
          {value}
        </p>
        <button
          onClick={onCopy}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-primary hover:text-primary/70 transition-colors border border-primary/40 px-4 py-2 hover:bg-primary/5"
        >
          <Copy className="w-3.5 h-3.5" />
          {copyLabel}
        </button>
      </div>
    </div>
  );
}
