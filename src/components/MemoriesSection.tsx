import { useEffect, useState } from "react";
import { Camera, ImagePlus } from "lucide-react";
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
  const [qrSize, setQrSize] = useState(120);

  useEffect(() => {
    const update = () => setQrSize(window.innerWidth < 640 ? 120 : 170);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <section id="fotos" className="py-6 sm:py-12 px-4 sm:px-6 scroll-mt-24" style={{ background: "var(--ivory)" }}>
      <div className="max-w-md mx-auto text-center">
        <h2
          className="uppercase text-base sm:text-xl"
          style={{ fontFamily: "Cinzel, serif", color: "var(--olive)", letterSpacing: "0.25em", fontWeight: 500 }}
        >
          {t("memories.title")}
        </h2>
        <p
          className="italic mt-1 text-xl sm:text-3xl"
          style={{ fontFamily: "Allura, 'Great Vibes', cursive", color: "var(--gold)", lineHeight: 1.1 }}
        >
          {t("memories.subtitle")}
        </p>

        <div
          className="mt-4 sm:mt-6 p-4 sm:p-6"
          style={{
            background: "var(--cream)",
            border: "1px solid var(--gold)",
            borderRadius: 12,
            boxShadow:
              "0 1px 2px color-mix(in oklab, var(--olive) 8%, transparent), 0 18px 36px -20px color-mix(in oklab, var(--olive) 24%, transparent)",
          }}
        >
          <div
            className="inline-flex p-2.5"
            style={{
              background: "var(--ivory)",
              border: "1px solid var(--gold)",
              borderRadius: 10,
            }}
          >
            <QRCodeClient value={ALBUM_URL} size={qrSize} />
          </div>

          <p
            className="mt-3 text-xs sm:text-sm"
            style={{ color: "var(--olive)", opacity: 0.85 }}
          >
            {t("memories.step1")}
          </p>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:gap-3">
            <a
              href={ALBUM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-1.5 px-2 sm:px-4 py-2.5 sm:py-3 uppercase transition-all hover:-translate-y-0.5"
              style={{
                fontFamily: "Cinzel, serif",
                letterSpacing: "0.12em",
                fontSize: "0.6rem",
                background: "var(--olive)",
                color: "var(--cream)",
                border: "1px solid var(--olive)",
                borderRadius: 8,
                minHeight: 40,
              }}
            >
              <Camera size={16} strokeWidth={1.5} />
              {t("memories.primary")}
            </a>
            <a
              href={ALBUM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-1.5 px-2 sm:px-4 py-2.5 sm:py-3 uppercase transition-all hover:-translate-y-0.5"
              style={{
                fontFamily: "Cinzel, serif",
                letterSpacing: "0.12em",
                fontSize: "0.6rem",
                background: "transparent",
                color: "var(--olive)",
                border: "1px solid var(--gold)",
                borderRadius: 8,
                minHeight: 40,
              }}
            >
              <ImagePlus size={16} strokeWidth={1.5} />
              {t("memories.secondary")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
