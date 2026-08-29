import { useI18n } from "@/lib/i18n";
import { useDepoisDoCasamento } from "@/lib/fase-do-site";
import { Marca } from "@/components/Marca";

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
        {/* A marca substitui o nome e a data soltos que aqui estavam. */}
        <span className="sm:hidden">
          <Marca base={13} cor="escura" />
        </span>
        <span className="hidden sm:inline-flex">
          <Marca base={17} cor="escura" />
        </span>

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
