import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "pt" | "en";

const dict = {
  pt: {
    "nav.story": "História",
    "nav.event": "Evento",
    "nav.info": "Informações",
    "nav.rsvp": "Confirmar",
    "nav.gifts": "Presentes",

    "hero.welcome": "Bem-vindos ao nosso casamento",
    "hero.date": "19 de Setembro de 2026",
    "hero.location": "Quinta Glicínia Wedding House · Freamunde",
    "hero.cta": "Confirmar Presença",
    "hero.cal": "Adicionar ao Calendário",

    "count.days": "Dias",
    "count.hours": "Horas",
    "count.mins": "Minutos",
    "count.secs": "Segundos",

    "story.title": "A Nossa História",
    "story.1.title": "O Início",
    "story.1.desc": "A nossa primeira viagem oficial. Foi aqui que percebemos que queríamos percorrer o mundo lado a lado.",
    "story.2.title": "Paris",
    "story.2.desc": "Na cidade das luzes, celebrámos o amor e criámos memórias que guardaremos para sempre.",
    "story.3.title": "Cumplicidade",
    "story.3.desc": "Cada descoberta, cada sorriso e cada pôr do sol juntos fortaleceu a nossa união.",
    "story.4.title": "O Pedido",
    "story.4.desc": "O momento em que o \"Sim\" mudou as nossas vidas para sempre. O início da nossa maior aventura!",

    "event.title": "O Evento",
    "event.venue": "GLICÍNIA WEDDING HOUSE",
    "event.place": "Freamunde, Portugal",
    "event.desc": "Cerimónia e Recepção às 14h00",
    "event.maps": "Abrir no Google Maps",

    "info.title": "Informações",
    "info.dress.title": "Dress Code",
    "info.dress.desc": "Sintam-se confortáveis e incríveis! Guardem o branco apenas para a noiva. Cores alegres são ótimas opções.",
    "info.hotel.title": "Hospedagem",
    "info.hotel.desc": "A Quinta Glicínia dispõe de alojamento no local. Check-in a partir das 15h00. Para reservas, contactem-nos diretamente.",
    "info.parking.title": "Estacionamento",
    "info.parking.desc": "A quinta possui um grande parque de estacionamento privativo e gratuito para todos os convidados.",

    "rsvp.title": "Confirmar Presença",
    "rsvp.subtitle": "Por favor responde até 1 de Agosto de 2026",
    "rsvp.name": "Nome Completo *",
    "rsvp.attend": "Vais estar presente? *",
    "rsvp.yes": "Sim, com alegria",
    "rsvp.no": "Infelizmente não",
    "rsvp.allergies": "Restrições alimentares",
    "rsvp.allergiesPh": "Alergias, vegano, etc.",
    "rsvp.song": "Música favorita",
    "rsvp.songPh": "O que queres ouvir na pista?",
    "rsvp.send": "Enviar Resposta",
    "rsvp.sending": "A enviar...",
    "rsvp.thanks": "Obrigado!",
    "rsvp.thanksDesc": "A tua resposta foi recebida. Mal podemos esperar para celebrar este dia contigo.",
    "rsvp.errMissing": "Por favor preenche o nome e indica se vais estar presente.",
    "rsvp.errSubmit": "Não foi possível enviar. Tenta novamente.",
    "rsvp.success": "Obrigado! A tua resposta foi recebida.",

    "gifts.title": "Presentes",
    "gifts.desc": "A vossa presença é o nosso maior presente. Caso queiram contribuir, deixamos os nossos dados.",
    "gifts.pt": "Conta Nacional (Portugal)",
    "gifts.rev": "Revolut (Joint Account)",
    "gifts.mbway": "MB WAY",
    "gifts.copy": "Copiar IBAN",
    "gifts.copied": "Copiado!",

    "footer.tagline": "Com amor,",
  },
  en: {
    "nav.story": "Story",
    "nav.event": "Event",
    "nav.info": "Information",
    "nav.rsvp": "RSVP",
    "nav.gifts": "Gifts",

    "hero.welcome": "Welcome to our wedding",
    "hero.date": "September 19, 2026",
    "hero.location": "Glicínia Wedding House · Freamunde",
    "hero.cta": "RSVP",
    "hero.cal": "Add to Calendar",

    "count.days": "Days",
    "count.hours": "Hours",
    "count.mins": "Minutes",
    "count.secs": "Seconds",

    "story.title": "Our Story",
    "story.1.title": "The Beginning",
    "story.1.desc": "Our first official trip. That's when we knew we wanted to travel the world side by side.",
    "story.2.title": "Paris",
    "story.2.desc": "In the city of lights, we celebrated love and made memories we'll keep forever.",
    "story.3.title": "Togetherness",
    "story.3.desc": "Every discovery, every smile, and every sunset together strengthened our bond.",
    "story.4.title": "The Proposal",
    "story.4.desc": "The moment a single \"Yes\" changed our lives forever. The beginning of our greatest adventure!",

    "event.title": "The Event",
    "event.venue": "GLICÍNIA WEDDING HOUSE",
    "event.place": "Freamunde, Portugal",
    "event.desc": "Ceremony and reception at 2:00 PM",
    "event.maps": "Open in Google Maps",

    "info.title": "Information",
    "info.dress.title": "Dress Code",
    "info.dress.desc": "Feel comfortable and look amazing! Please leave white for the bride. Bright colors are very welcome.",
    "info.hotel.title": "Accommodation",
    "info.hotel.desc": "On-site accommodation available at the venue. Check-in from 3:00 PM. For reservations, please contact us directly.",
    "info.parking.title": "Parking",
    "info.parking.desc": "The venue has a large, free private parking lot for all guests.",

    "rsvp.title": "RSVP",
    "rsvp.subtitle": "Please reply by August 1, 2026",
    "rsvp.name": "Full Name *",
    "rsvp.attend": "Will you attend? *",
    "rsvp.yes": "Joyfully accept",
    "rsvp.no": "Regretfully decline",
    "rsvp.allergies": "Dietary restrictions",
    "rsvp.allergiesPh": "Allergies, vegan, etc.",
    "rsvp.song": "Song suggestion",
    "rsvp.songPh": "What would you like to hear?",
    "rsvp.send": "Send response",
    "rsvp.sending": "Sending...",
    "rsvp.thanks": "Thank you!",
    "rsvp.thanksDesc": "Your reply has been received. We can't wait to celebrate this day with you.",
    "rsvp.errMissing": "Please enter your name and let us know if you'll attend.",
    "rsvp.errSubmit": "Could not submit. Please try again.",
    "rsvp.success": "Thank you! Your reply has been received.",

    "gifts.title": "Gifts",
    "gifts.desc": "Your presence is our greatest gift. If you'd like to contribute, here are our details.",
    "gifts.pt": "National Account (Portugal)",
    "gifts.rev": "Revolut (Joint Account)",
    "gifts.mbway": "MB WAY",
    "gifts.copy": "Copy IBAN",
    "gifts.copied": "Copied!",

    "footer.tagline": "With love,",
  },
} as const;

type Key = keyof (typeof dict)["pt"];

const I18nCtx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (k: Key) => string }>({
  lang: "pt",
  setLang: () => {},
  t: (k) => k,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("pt");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("lang") as Lang | null;
      if (saved === "pt" || saved === "en") setLangState(saved);
      else if (typeof navigator !== "undefined" && navigator.language.startsWith("en"))
        setLangState("en");
    } catch {}
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("lang", l);
    } catch {}
  };

  const t = (k: Key) => dict[lang][k] ?? k;
  return <I18nCtx.Provider value={{ lang, setLang, t }}>{children}</I18nCtx.Provider>;
}

export const useI18n = () => useContext(I18nCtx);
