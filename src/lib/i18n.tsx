import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "pt" | "en";

const dict = {
  pt: {
    "nav.home": "Início",
    "nav.story": "História",
    "nav.event": "Programa",
    "nav.info": "Informações",
    "nav.faq": "FAQ",
    "nav.rsvp": "RSVP",
    "nav.gifts": "Presentes",

    "memories.title": "PARTILHA AS TUAS MEMÓRIAS",
    "memories.subtitle": "as nossas fotos favoritas serão as tuas",
    "memories.stepsTitle": "EM 3 PASSOS SIMPLES",
    "memories.step1": "Aponta a câmara do telemóvel para o QR code",
    "memories.step2": "Adiciona as tuas fotos e vídeos do nosso dia",
    "memories.step3": "Vê todas as memórias partilhadas pelos convidados",
    "memories.openPhone": "Abrir no Telemóvel",
    "memories.note": "Todas as fotos serão guardadas num álbum partilhado privado.",

    "playlist.title": "A BANDA SONORA DA NOSSA FESTA",
    "playlist.subtitle": "sugere as músicas que queres ouvir",
    "playlist.desc": "Esta playlist é colaborativa! Adiciona as tuas músicas favoritas e ajuda-nos a criar a banda sonora perfeita para a nossa festa.",
    "playlist.cta": "Abrir no Spotify e Adicionar Músicas",

    "faq.title": "PERGUNTAS FREQUENTES",
    "faq.subtitle": "tudo o que precisas de saber",
    "faq.q1": "A que horas devo chegar?",
    "faq.a1": "A cerimónia começa pontualmente às 14h00. Sugerimos chegar entre 15 a 30 minutos antes para se acomodarem com tranquilidade.",
    "faq.q2": "Posso levar acompanhante?",
    "faq.a2": "Cada convite indica os nomes das pessoas convidadas. Se tens dúvidas, contacta-nos diretamente.",
    "faq.q3": "As crianças são bem-vindas?",
    "faq.a3": "Adoramos crianças! Se vens acompanhado de crianças, indica-o no RSVP para que possamos preparar tudo para elas.",
    "faq.q4": "Qual é o dress code?",
    "faq.a4": "Cocktail/Formal. Sintam-se confortáveis e incríveis! Guardem o branco apenas para a noiva. Cores alegres são bem-vindas.",
    "faq.q5": "Há estacionamento no local?",
    "faq.a5": "Sim! A Quinta Glicínia dispõe de estacionamento privativo e gratuito para todos os convidados.",
    "faq.q6": "Há alojamento próximo?",
    "faq.a6": "A Quinta Glicínia dispõe de alojamento no local com check-in a partir das 15h00. Para reservas, contactem-nos diretamente.",
    "faq.q7": "Posso tirar fotografias durante a cerimónia?",
    "faq.a7": "Pedimos que durante a cerimónia desfrutem do momento connosco e deixem o trabalho para o nosso fotógrafo. Após a cerimónia, à vontade — e não te esqueças do nosso álbum partilhado!",
    "faq.q8": "Como ofereço um presente?",
    "faq.a8": "A vossa presença é o nosso maior presente. Caso queiram contribuir, deixamos os nossos dados na secção 'Presentes'.",
    "faq.q9": "Tenho restrições alimentares. O que faço?",
    "faq.a9": "Sem problema! Indica todas as restrições no formulário RSVP e nós tratamos do resto.",
    "faq.q10": "Até que horas dura a festa?",
    "faq.a10": "A festa vai até ao amanhecer! Estamos preparados para dançar a noite inteira convosco.",

    "hero.tagline": "A Nossa Maior Viagem",
    "hero.tagline.script": "começa agora",
    "hero.cta": "Confirmar Presença",
    "hero.cal": "Adicionar ao Calendário",

    "count.title": "A Contagem Começou",
    "count.subtitle": "para o nosso grande dia",
    "count.days": "Dias",
    "count.hours": "Horas",
    "count.mins": "Minutos",
    "count.secs": "Segundos",
    "count.over": "O dia chegou! 💍",

    "story.kicker": "2020 — 2026",
    "story.title": "A Nossa História",
    "story.1.title": "O Início",
    "story.1.desc": "A nossa primeira viagem oficial. Foi aqui que percebemos que queríamos percorrer o mundo lado a lado.",
    "story.2.title": "Paris",
    "story.2.desc": "Na cidade das luzes, celebrámos o amor e criámos memórias que guardaremos para sempre.",
    "story.3.title": "Cumplicidade",
    "story.3.desc": "Cada descoberta, cada sorriso e cada pôr do sol juntos fortaleceu a nossa união.",
    "story.4.title": "O Pedido",
    "story.4.desc": "O momento em que o \"Sim\" mudou as nossas vidas para sempre. O início da nossa maior aventura!",

    "std.title": "Reserva Esta Data",
    "std.month": "Setembro",
    "std.daysLeft": "Faltam",
    "std.day": "dia",
    "std.days": "dias",

    "event.kicker": "A Cerimónia",
    "event.title": "O Evento",
    "event.venue": "GLICÍNIA WEDDING HOUSE",
    "event.place": "Freamunde, Portugal",
    "event.desc": "Cerimónia e Recepção às 14h00",
    "event.maps": "Abrir no Google Maps",

    "info.kicker": "Para os nossos convidados",
    "info.title": "Informações",
    "info.dress.title": "Dress Code",
    "info.dress.desc": "Sintam-se confortáveis e incríveis! Guardem o branco apenas para a noiva. Cores alegres são ótimas opções.",
    "info.hotel.title": "Hospedagem",
    "info.hotel.desc": "A Quinta Glicínia dispõe de alojamento no local. Check-in a partir das 15h00. Para reservas, contactem-nos diretamente.",
    "info.parking.title": "Estacionamento",
    "info.parking.desc": "A quinta possui um grande parque de estacionamento privativo e gratuito para todos os convidados.",

    "travel.title": "Como Chegar",
    "travel.porto": "Porto",
    "travel.porto.desc": "30 min de carro",
    "travel.aveiro": "Aveiro",
    "travel.aveiro.desc": "1h00 de carro",
    "travel.airport": "Aeroporto Porto",
    "travel.airport.desc": "35 min de carro",
    "travel.parking": "Estacionamento",
    "travel.parking.desc": "Gratuito no local",

    "rsvp.title": "Confirmar Presença",
    "rsvp.subtitle": "Por favor responde até 1 de Agosto de 2026",
    "rsvp.name": "Nome Completo",
    "rsvp.email": "Email",
    "rsvp.phone": "Contacto Telefónico",
    "rsvp.guests": "Número de Pessoas",
    "rsvp.guests.one": "pessoa",
    "rsvp.guests.many": "pessoas",
    "rsvp.attend": "Vais estar presente?",
    "rsvp.yes": "Sim, com alegria",
    "rsvp.no": "Infelizmente não",
    "rsvp.allergies": "Restrições alimentares",
    "rsvp.song": "Música favorita",
    "rsvp.message": "Mensagem para os noivos",
    "rsvp.send": "Enviar Resposta",
    "rsvp.sending": "A enviar...",
    "rsvp.thanks": "Obrigado!",
    "rsvp.thanksDesc": "A tua resposta foi recebida com amor. Mal podemos esperar por ti no dia 19 de Setembro!",
    "rsvp.err.name": "Indica o teu nome completo.",
    "rsvp.err.email": "Email inválido.",
    "rsvp.err.phone": "Indica 9 dígitos (ex: 912345678).",
    "rsvp.err.attending": "Indica se vais estar presente.",
    "rsvp.err.submit": "Algo correu mal. Por favor tenta novamente ou contacta-nos diretamente.",

    "gifts.kicker": "Com gratidão",
    "gifts.title": "Presentes",
    "gifts.desc": "A vossa presença é o nosso maior presente. Caso queiram contribuir, deixamos os nossos dados.",
    "gifts.pt": "Conta Nacional (Portugal)",
    "gifts.rev": "Revolut (Conta Conjunta)",
    "gifts.mbway": "MB WAY",
    "gifts.copy.iban": "Copiar IBAN",
    "gifts.copy.number": "Copiar Número",
    "gifts.copied.iban": "IBAN copiado!",
    "gifts.copied.number": "Número copiado!",

    "footer.tagline": "Com amor,",
    "footer.made": "Feito com ♡ para a nossa maior viagem",

    "cal.added": "Adicionado ao teu calendário! 📅",
  },
  en: {
    "nav.home": "Home",
    "nav.story": "Story",
    "nav.event": "Event",
    "nav.info": "Information",
    "nav.rsvp": "RSVP",
    "nav.gifts": "Gifts",

    "hero.tagline": "Our Greatest Journey",
    "hero.tagline.script": "begins now",
    "hero.cta": "RSVP",
    "hero.cal": "Add to Calendar",

    "count.title": "The Countdown Has Begun",
    "count.subtitle": "to our big day",
    "count.days": "Days",
    "count.hours": "Hours",
    "count.mins": "Minutes",
    "count.secs": "Seconds",
    "count.over": "The day is here! 💍",

    "story.kicker": "2020 — 2026",
    "story.title": "Our Story",
    "story.1.title": "The Beginning",
    "story.1.desc": "Our first official trip. That's when we knew we wanted to travel the world side by side.",
    "story.2.title": "Paris",
    "story.2.desc": "In the city of lights, we celebrated love and made memories we'll keep forever.",
    "story.3.title": "Togetherness",
    "story.3.desc": "Every discovery, every smile, and every sunset together strengthened our bond.",
    "story.4.title": "The Proposal",
    "story.4.desc": "The moment a single \"Yes\" changed our lives forever. The beginning of our greatest adventure!",

    "std.title": "Save the Date",
    "std.month": "September",
    "std.daysLeft": "",
    "std.day": "day to go",
    "std.days": "days to go",

    "event.kicker": "The Ceremony",
    "event.title": "The Event",
    "event.venue": "GLICÍNIA WEDDING HOUSE",
    "event.place": "Freamunde, Portugal",
    "event.desc": "Ceremony and reception at 2:00 PM",
    "event.maps": "Open in Google Maps",

    "info.kicker": "For our guests",
    "info.title": "Information",
    "info.dress.title": "Dress Code",
    "info.dress.desc": "Feel comfortable and look amazing! Please leave white for the bride. Bright colors are very welcome.",
    "info.hotel.title": "Accommodation",
    "info.hotel.desc": "On-site accommodation available at the venue. Check-in from 3:00 PM. For reservations, please contact us directly.",
    "info.parking.title": "Parking",
    "info.parking.desc": "The venue has a large, free private parking lot for all guests.",

    "travel.title": "How to Get There",
    "travel.porto": "Porto",
    "travel.porto.desc": "30 min by car",
    "travel.aveiro": "Aveiro",
    "travel.aveiro.desc": "1h by car",
    "travel.airport": "Porto Airport",
    "travel.airport.desc": "35 min by car",
    "travel.parking": "Parking",
    "travel.parking.desc": "Free on-site",

    "rsvp.title": "Confirm Attendance",
    "rsvp.subtitle": "Please reply by August 1, 2026",
    "rsvp.name": "Full Name",
    "rsvp.email": "Email",
    "rsvp.phone": "Phone Number",
    "rsvp.guests": "Number of Guests",
    "rsvp.guests.one": "guest",
    "rsvp.guests.many": "guests",
    "rsvp.attend": "Will you attend?",
    "rsvp.yes": "Joyfully accept",
    "rsvp.no": "Regretfully decline",
    "rsvp.allergies": "Dietary restrictions",
    "rsvp.song": "Song suggestion",
    "rsvp.message": "Message for the couple",
    "rsvp.send": "Send Response",
    "rsvp.sending": "Sending...",
    "rsvp.thanks": "Thank you!",
    "rsvp.thanksDesc": "Your reply has been received with love. We can't wait to celebrate September 19 with you!",
    "rsvp.err.name": "Please enter your full name.",
    "rsvp.err.email": "Invalid email.",
    "rsvp.err.phone": "Enter 9 digits (e.g. 912345678).",
    "rsvp.err.attending": "Please let us know if you'll attend.",
    "rsvp.err.submit": "Something went wrong. Please try again or contact us directly.",

    "gifts.kicker": "With gratitude",
    "gifts.title": "Gifts",
    "gifts.desc": "Your presence is our greatest gift. If you'd like to contribute, here are our details.",
    "gifts.pt": "National Account (Portugal)",
    "gifts.rev": "Revolut (Joint Account)",
    "gifts.mbway": "MB WAY",
    "gifts.copy.iban": "Copy IBAN",
    "gifts.copy.number": "Copy Number",
    "gifts.copied.iban": "IBAN copied!",
    "gifts.copied.number": "Number copied!",

    "footer.tagline": "With love,",
    "footer.made": "Made with ♡ for our greatest journey",

    "cal.added": "Added to your calendar! 📅",
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
