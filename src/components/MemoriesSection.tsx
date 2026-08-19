import { useEffect, useState } from "react";
import { Camera, Smartphone, Heart, Sparkles, ImagePlus } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export const ALBUM_URL = "https://photos.app.goo.gl/ZfRKu3pg8oHait6eA";

function QRCodeClient({ value, size }: { value: string; size: number }) {
  const [Comp, setComp] = useState<React.ComponentType<any> | null>(null);
  useEffect(() => {
    let mounted = true;
    import("react-qr-code").then((mod) => {
      if (!mounted) return;
      const C = (mod as any).default ?? mod;
      setComp(() => C);
    });
    return () => {
      mounted = false;
    };
  }, []);
  if (!Comp) {
    return (
      <div
        style={{
          width: size,
          height: size,
          background: "#F5EFE4",
          border: "1px dashed var(--gold)",
          borderRadius: 8,
        }}
        aria-label="QR code loading"
      />
    );
  }
  return <Comp value={value} size={size} bgColor="#F5EFE4" fgColor="#6B7A4F" level="M" />;
}

export function MemoriesSection() {
  const { t } = useI18n();
  const [qrSize, setQrSize] = useState(140);

  useEffect(() => {
    const update = () => setQrSize(window.innerWidth < 768 ? 140 : 220);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <section id="fotos" className="py-8 sm:py-20 px-4 sm:px-6 scroll-mt-24" style={{ background: "var(--ivory)" }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-4 sm:mb-10">
          <h2
            className="uppercase text-lg sm:text-2xl md:text-3xl"
            style={{ fontFamily: "Cinzel, serif", color: "var(--olive)", letterSpacing: "0.3em", fontWeight: 500 }}
          >
            {t("memories.title")}
          </h2>
          <p
            className="italic mt-1 sm:mt-3 text-2xl sm:text-4xl"
            style={{ fontFamily: "Allura, 'Great Vibes', cursive", color: "var(--gold)", lineHeight: 1.1 }}
          >
            {t("memories.subtitle")}
          </p>
          <div className="divider-ornament mt-3 sm:mt-6 max-w-xs mx-auto">
            <Camera className="w-4 h-4" strokeWidth={1.25} />
          </div>
          <p
            className="mt-3 sm:mt-6 mx-auto text-[0.85rem] sm:text-base leading-snug sm:leading-relaxed"
            style={{ color: "var(--olive)", opacity: 0.9, maxWidth: 560 }}
          >
            {t("memories.desc")}
          </p>
        </div>

        <div
          className="mx-auto p-4 sm:p-12 relative"
          style={{
            maxWidth: 780,
            background: "var(--cream)",
            border: "1px solid var(--gold)",
            borderRadius: 14,
            boxShadow:
              "0 1px 2px color-mix(in oklab, var(--olive) 8%, transparent), 0 22px 48px -24px color-mix(in oklab, var(--olive) 28%, transparent)",
          }}
        >
          {/* Detalhe dourado interior */}
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 8,
              borderRadius: 10,
              border: "1px solid color-mix(in oklab, var(--gold) 32%, transparent)",
              pointerEvents: "none",
            }}
          />

          <div className="grid md:grid-cols-2 gap-4 sm:gap-7 items-center relative">
            {/* QR */}
            <div className="flex justify-center order-2 md:order-1">
              <div
                className="p-3 sm:p-5"
                style={{
                  background: "var(--cream)",
                  border: "1px solid var(--gold)",
                  borderRadius: 12,
                }}
              >
                <QRCodeClient value={ALBUM_URL} size={qrSize} />
              </div>
            </div>

            {/* Steps */}
            <div className="order-1 md:order-2">
              <p
                className="uppercase text-sm sm:text-base mb-3 sm:mb-5"
                style={{ fontFamily: "Cinzel, serif", color: "var(--olive)", letterSpacing: "0.2em", fontWeight: 500 }}
              >
                {t("memories.stepsTitle")}
              </p>
              <ol className="space-y-2.5 sm:space-y-4">
                <Step n={1} icon={<Smartphone size={18} strokeWidth={1.5} />} text={t("memories.step1")} />
                <Step n={2} icon={<Heart size={18} strokeWidth={1.5} />} text={t("memories.step2")} />
                <Step n={3} icon={<Sparkles size={18} strokeWidth={1.5} />} text={t("memories.step3")} />
              </ol>
            </div>
          </div>

          {/* CTAs */}
          <div className="mt-4 sm:mt-9 grid grid-cols-2 gap-2 sm:gap-3 relative">
            <a
              href={ALBUM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-3 sm:px-6 py-3 sm:py-4 uppercase transition-all hover:-translate-y-0.5 text-center"
              style={{
                fontFamily: "Cinzel, serif",
                letterSpacing: "0.14em",
                fontSize: "0.68rem",
                background: "var(--olive)",
                color: "var(--cream)",
                border: "1px solid var(--olive)",
                borderRadius: 8,
                minHeight: 46,
              }}
            >
              <Camera size={18} strokeWidth={1.5} />
              {t("memories.primary")}
            </a>
            <a
              href={ALBUM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-3 sm:px-6 py-3 sm:py-4 uppercase transition-all hover:-translate-y-0.5 text-center"
              style={{
                fontFamily: "Cinzel, serif",
                letterSpacing: "0.14em",
                fontSize: "0.68rem",
                background: "transparent",
                color: "var(--olive)",
                border: "1px solid var(--gold)",
                borderRadius: 8,
                minHeight: 46,
              }}
            >
              <ImagePlus size={18} strokeWidth={1.5} />
              {t("memories.secondary")}
            </a>
          </div>
        </div>

        <p className="text-center italic mt-3 sm:mt-6 text-[0.8rem] sm:text-sm" style={{ color: "var(--olive)", opacity: 0.85 }}>
          {t("memories.note")}
        </p>
      </div>
    </section>
  );
}

function Step({ n, icon, text }: { n: number; icon: React.ReactNode; text: string }) {
  return (
    <li className="flex items-start gap-2.5">
      <span
        className="shrink-0 inline-flex items-center justify-center"
        style={{
          width: 28,
          height: 28,
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
        <p className="text-[0.82rem] sm:text-sm leading-snug sm:leading-relaxed" style={{ color: "var(--olive)" }}>
          {text}
        </p>
      </div>
    </li>
  );
}
