import { useI18n } from "@/lib/i18n";
import { useDepoisDoCasamento } from "@/lib/fase-do-site";

export function SiteFooter() {
  const { lang } = useI18n();
  const depois = useDepoisDoCasamento();
  return (
    <footer
      className="text-center px-5 sm:px-6"
      style={{
        backgroundColor: "#6B7A4F",
        color: "#F5EFE4",
        paddingTop: "28px",
        paddingBottom: "calc(28px + env(safe-area-inset-bottom, 0px))",
      }}
    >
      <div className="max-w-2xl mx-auto flex flex-col items-center gap-2">
        <p
          className="uppercase text-base sm:text-xl"
          style={{
            fontFamily: "Cinzel, serif",
            color: "#F5EFE4",
            letterSpacing: "0.3em",
            fontWeight: 500,
          }}
        >
          Joana &amp; Diogo
        </p>

        <p
          className="text-sm sm:text-lg"
          style={{
            fontFamily: "Cinzel, serif",
            color: "var(--gold)",
            letterSpacing: "0.3em",
          }}
        >
          19 · 09 · 2026
        </p>

        <p
          className="italic text-xs sm:text-sm"
          style={{
            fontFamily: "Lato, sans-serif",
            color: "#F5EFE4",
            opacity: 0.85,
          }}
        >
          {/* Depois do casamento a mesma frase abre a página em grande; aqui
              em baixo passaria a soar a repetição. */}
          {depois
            ? lang === "en"
              ? "With all our love."
              : "Com todo o nosso carinho."
            : lang === "en"
              ? "Thank you for being part of our day."
              : "Obrigado por fazerem parte do nosso dia."}
        </p>
      </div>
    </footer>
  );
}
