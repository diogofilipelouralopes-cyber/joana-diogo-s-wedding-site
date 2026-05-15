import { Heart, Copy, Smartphone, CreditCard, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { StripeEmbeddedCheckout } from "@/components/StripeEmbeddedCheckout";

const ibanPT = "PT50 0035 0836 0068 8932 0308 1";
const ibanRev = "BE66 6502 5539 2943";
const mbwayNumber = "+351 912 633 104";

export function GiftsSection() {
  const { t } = useI18n();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const goldToast = (msg: string) =>
    toast(msg, {
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

  const copyIban = (value: string) => {
    navigator.clipboard.writeText(value.replace(/\s/g, ""));
    goldToast(t("gifts.copied.iban"));
  };

  const copyNumber = () => {
    navigator.clipboard.writeText(mbwayNumber.replace(/\s/g, ""));
    goldToast(t("gifts.copied.number"));
  };

  return (
    <section id="gifts" className="py-20 sm:py-28 md:py-40 px-5 sm:px-6 bg-secondary/40 scroll-mt-24">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[0.65rem] sm:text-xs uppercase tracking-[0.4em] text-muted-foreground mb-3">
            {t("gifts.kicker")}
          </p>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-primary">{t("gifts.title")}</h2>
          <div className="divider-ornament mt-6 max-w-xs mx-auto">
            <Heart className="w-3 h-3" strokeWidth={1} />
          </div>
          <p className="mt-6 text-foreground/75 max-w-xl mx-auto text-sm sm:text-base">{t("gifts.desc")}</p>
        </div>

        <div className="grid sm:grid-cols-1 gap-5">
          <GiftCard
            label={t("gifts.pt")}
            owner="Joana Maria Dias Nora"
            value={ibanPT}
            onCopy={() => copyIban(ibanPT)}
            copyLabel={t("gifts.copy.iban")}
          />
          <GiftCard
            label={t("gifts.rev")}
            owner="Diogo Lopes & Joana Nora"
            value={ibanRev}
            onCopy={() => copyIban(ibanRev)}
            copyLabel={t("gifts.copy.iban")}
          />
          <div className="card-gold p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-3">
              <Smartphone className="w-4 h-4 text-primary" strokeWidth={1.5} />
              <h3 className="font-display text-lg sm:text-xl text-primary">{t("gifts.mbway")}</h3>
            </div>
            <p className="text-[0.65rem] sm:text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">
              Joana Nora
            </p>
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <p className="font-display text-xl sm:text-2xl" style={{ color: "var(--gold)" }}>
                {mbwayNumber}
              </p>
              <button
                onClick={copyNumber}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-primary hover:text-primary/70 transition-colors border border-primary/40 px-4 py-2 hover:bg-primary/5 rounded"
                style={{ minHeight: 44 }}
              >
                <Copy className="w-3.5 h-3.5" />
                {t("gifts.copy.number")}
              </button>
            </div>
          </div>

          <div className="card-gold p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="w-4 h-4 text-primary" strokeWidth={1.5} />
              <h3 className="font-display text-lg sm:text-xl text-primary">Contributo para a Lua de Mel</h3>
            </div>
            <p className="text-foreground/75 text-sm mb-4">
              Ajudem-nos a tornar a nossa lua de mel inesquecível com um contributo de 25€ (cartão).
            </p>
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <p className="font-display text-xl sm:text-2xl" style={{ color: "var(--gold)" }}>
                25 €
              </p>
              <button
                onClick={() => setCheckoutOpen(true)}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-primary hover:text-primary/70 transition-colors border border-primary/40 px-4 py-2 hover:bg-primary/5 rounded"
                style={{ minHeight: 44 }}
              >
                <CreditCard className="w-3.5 h-3.5" />
                Contribuir
              </button>
            </div>
          </div>
        </div>
      </div>

      {checkoutOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-start sm:items-center justify-center p-4 overflow-y-auto">
          <div className="bg-background rounded-lg max-w-2xl w-full my-8 relative">
            <button
              onClick={() => setCheckoutOpen(false)}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-background/90 hover:bg-background border border-primary/20"
              aria-label="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="p-2 sm:p-4">
              <StripeEmbeddedCheckout priceId="gift_lua_de_mel_25" />
            </div>
          </div>
        </div>
      )}
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
    <div className="card-gold p-6 sm:p-8">
      <p className="text-[0.65rem] sm:text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">{label}</p>
      <p className="font-display text-lg sm:text-xl text-primary mb-3">{owner}</p>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p className="font-mono text-xs sm:text-sm md:text-base text-foreground/85 tracking-wider break-all">
          {value}
        </p>
        <button
          onClick={onCopy}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-primary hover:text-primary/70 transition-colors border border-primary/40 px-4 py-2 hover:bg-primary/5 rounded"
          style={{ minHeight: 44 }}
        >
          <Copy className="w-3.5 h-3.5" />
          {copyLabel}
        </button>
      </div>
    </div>
  );
}
