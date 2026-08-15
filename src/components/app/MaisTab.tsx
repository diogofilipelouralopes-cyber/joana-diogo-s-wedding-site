import { useState } from "react";
import { BookHeart, HelpCircle, Mail, Gift, Phone, ChevronRight, ChevronLeft, Lock } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { AppCard, ListRow, SectionHead } from "./ui";
import { StorySection } from "@/components/StorySection";
import { FaqSection } from "@/components/FaqSection";
import { MessagesSection } from "@/components/MessagesSection";
import { GiftsSection } from "@/components/GiftsSection";

type SubView = null | "story" | "faq" | "messages" | "gifts" | "contacts";

const WHATSAPP_URL = "https://wa.me/351912345678";
const EMAIL = "casamento@joanaediogo.com";

export function MaisTab() {
  const { lang, setLang } = useI18n();
  const [view, setView] = useState<SubView>(null);

  if (view) {
    return (
      <section className="app-section">
        <button type="button" className="app-back" onClick={() => setView(null)}>
          <ChevronLeft size={16} strokeWidth={1.3} aria-hidden="true" />
          {lang === "en" ? "Back" : "Voltar"}
        </button>
        <div className="app-subview">
          {view === "story" && <StorySection />}
          {view === "faq" && <FaqSection />}
          {view === "messages" && <MessagesSection />}
          {view === "gifts" && <GiftsSection />}
          {view === "contacts" && <Contacts />}
        </div>
      </section>
    );
  }

  const chev = <ChevronRight size={16} strokeWidth={1.3} />;

  return (
    <section className="app-section">
      <SectionHead kicker={lang === "en" ? "More" : "Mais"} script="Joana & Diogo" />

      <AppCard className="app-rows">
        <ListRow
          icon={<BookHeart size={18} strokeWidth={1.3} />}
          label={lang === "en" ? "Our story" : "A nossa história"}
          onClick={() => setView("story")}
          trailing={chev}
        />
        <ListRow
          icon={<HelpCircle size={18} strokeWidth={1.3} />}
          label={lang === "en" ? "Frequently asked questions" : "Perguntas frequentes"}
          onClick={() => setView("faq")}
          trailing={chev}
        />
        <ListRow
          icon={<Mail size={18} strokeWidth={1.3} />}
          label={lang === "en" ? "Leave us a message" : "Deixa-nos uma mensagem"}
          onClick={() => setView("messages")}
          trailing={chev}
        />
        <ListRow
          icon={<Gift size={18} strokeWidth={1.3} />}
          label={lang === "en" ? "Gifts" : "Presentes"}
          onClick={() => setView("gifts")}
          trailing={chev}
        />
        <ListRow
          icon={<Phone size={18} strokeWidth={1.3} />}
          label={lang === "en" ? "Contacts" : "Contactos"}
          onClick={() => setView("contacts")}
          trailing={chev}
        />
      </AppCard>

      <AppCard className="app-lang">
        <span className="app-kicker">{lang === "en" ? "Language" : "Idioma"}</span>
        <div className="app-lang-btns">
          <button
            type="button"
            className="app-lang-btn"
            data-active={lang === "pt"}
            onClick={() => setLang("pt")}
          >
            PT
          </button>
          <button
            type="button"
            className="app-lang-btn"
            data-active={lang === "en"}
            onClick={() => setLang("en")}
          >
            EN
          </button>
        </div>
      </AppCard>

      <Link to="/admin" className="app-admin-link">
        <Lock size={14} strokeWidth={1.3} aria-hidden="true" />
        {lang === "en" ? "Private area" : "Área privada dos noivos"}
      </Link>

      <p className="app-note app-center">
        {lang === "en" ? "Made with love for our greatest journey" : "Feito com amor para a nossa maior viagem"}
      </p>
    </section>
  );
}

function Contacts() {
  const { lang } = useI18n();
  return (
    <AppCard className="app-pad">
      <p className="app-kicker">{lang === "en" ? "Talk to us" : "Fala connosco"}</p>
      <p className="app-body app-mt-sm">
        {lang === "en"
          ? "Any question about the wedding? We are here."
          : "Alguma dúvida sobre o casamento? Estamos aqui."}
      </p>
      <div className="app-rows app-mt">
        <ListRow icon={<Phone size={18} strokeWidth={1.3} />} label="WhatsApp" href={WHATSAPP_URL} />
        <ListRow icon={<Mail size={18} strokeWidth={1.3} />} label={EMAIL} href={`mailto:${EMAIL}`} />
      </div>
    </AppCard>
  );
}
