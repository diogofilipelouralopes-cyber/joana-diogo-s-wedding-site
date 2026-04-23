import * as QRCodeModule from "react-qr-code";
const QRCode = (QRCodeModule as unknown as { default: typeof QRCodeModule }).default ?? QRCodeModule;
import { Camera, Smartphone, Heart, Sparkles, ExternalLink } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const ALBUM_URL = "https://photos.app.goo.gl/fRgpcdDbq9YgNJhi6";

export function MemoriesSection() {
  const { t } = useI18n();

  return (
    <section id="memories" className="py-20 sm:py-28 px-5 sm:px-6 scroll-mt-24" style={{ background: "var(--ivory)" }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10 sm:mb-12">
          <h2
            className="uppercase text-xl sm:text-2xl md:text-3xl"
            style={{ fontFamily: "Cinzel, serif", color: "var(--olive)", letterSpacing: "0.3em", fontWeight: 500 }}
          >
            {t("memories.title")}
          </h2>
          <p
            className="italic mt-3 text-3xl sm:text-4xl"
            style={{ fontFamily: "Allura, 'Great Vibes', cursive", color: "var(--gold)", lineHeight: 1.1 }}
          >
            {t("memories.subtitle")}
          </p>
          <div className="divider-ornament mt-6 max-w-xs mx-auto">
            <Camera className="w-4 h-4" strokeWidth={1.25} />
          </div>
        </div>

        <div
          className="mx-auto p-7 sm:p-12"
          style={{
            maxWidth: 760,
            background: "var(--cream)",
            border: "1px solid var(--gold)",
            borderRadius: 12,
            boxShadow:
              "0 1px 2px color-mix(in oklab, var(--olive) 8%, transparent), 0 18px 40px -22px color-mix(in oklab, var(--olive) 25%, transparent)",
          }}
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* QR */}
            <div className="flex justify-center">
              <div
                style={{
                  padding: 20,
                  background: "var(--cream)",
                  border: "1px solid var(--gold)",
                  borderRadius: 12,
                }}
              >
                <QRCode
                  value={ALBUM_URL}
                  size={200}
                  bgColor="#F5EFE4"
                  fgColor="#6B7A4F"
                  level="M"
                />
              </div>
            </div>

            {/* Steps */}
            <div>
              <p
                className="uppercase text-base mb-5"
                style={{ fontFamily: "Cinzel, serif", color: "var(--olive)", letterSpacing: "0.2em", fontWeight: 500 }}
              >
                {t("memories.stepsTitle")}
              </p>
              <ol className="space-y-4">
                <Step n={1} icon={<Smartphone size={18} strokeWidth={1.5} />} text={t("memories.step1")} />
                <Step n={2} icon={<Heart size={18} strokeWidth={1.5} />} text={t("memories.step2")} />
                <Step n={3} icon={<Sparkles size={18} strokeWidth={1.5} />} text={t("memories.step3")} />
              </ol>

              <a
                href={ALBUM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 px-5 py-3 uppercase transition-all hover:-translate-y-0.5"
                style={{
                  fontFamily: "Cinzel, serif",
                  letterSpacing: "0.22em",
                  fontSize: "0.7rem",
                  color: "var(--gold)",
                  border: "1px solid var(--gold)",
                  borderRadius: 8,
                  background: "transparent",
                  minHeight: 44,
                }}
              >
                <ExternalLink size={14} strokeWidth={1.5} />
                {t("memories.openPhone")}
              </a>
            </div>
          </div>
        </div>

        <p
          className="text-center italic mt-6 text-sm"
          style={{ color: "var(--olive)", opacity: 0.85 }}
        >
          {t("memories.note")}
        </p>
      </div>
    </section>
  );
}

function Step({ n, icon, text }: { n: number; icon: React.ReactNode; text: string }) {
  return (
    <li className="flex items-start gap-3">
      <span
        className="shrink-0 inline-flex items-center justify-center"
        style={{
          width: 32,
          height: 32,
          borderRadius: 999,
          background: "var(--ivory)",
          border: "1px solid var(--gold)",
          color: "var(--olive)",
        }}
      >
        {icon}
      </span>
      <div>
        <p
          className="uppercase text-[0.65rem] mb-0.5"
          style={{ fontFamily: "Cinzel, serif", color: "var(--gold)", letterSpacing: "0.25em" }}
        >
          {String(n).padStart(2, "0")}
        </p>
        <p className="text-sm leading-relaxed" style={{ color: "var(--olive)" }}>
          {text}
        </p>
      </div>
    </li>
  );
}
