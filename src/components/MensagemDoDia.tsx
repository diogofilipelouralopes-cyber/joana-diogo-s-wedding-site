// Mensagem pessoal dos noivos, visível apenas no próprio dia do casamento.
//
// Aparece a partir da meia-noite de 19 de setembro (TARGET) e desaparece
// sozinha à meia-noite do dia 20 (END) — as mesmas fronteiras usadas pelo
// cronómetro e pelo modo "depois do casamento", para o site nunca ficar a meio.

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { TARGET, END } from "@/lib/countdown";
import { useI18n } from "@/lib/i18n";

const MAX_TIMEOUT = 2_147_483_647;

function eHoje(agora: number = Date.now()): boolean {
  return agora >= TARGET && agora < END;
}

export function MensagemDoDia() {
  const { lang } = useI18n();
  // Calculado também no servidor (relógio certo), por isso não há salto ao hidratar.
  const [visivel, setVisivel] = useState(() => eHoje());

  useEffect(() => {
    const agora = Date.now();
    const proximo = agora < TARGET ? TARGET - agora : END - agora;
    if (proximo <= 0 || proximo > MAX_TIMEOUT) return;
    const id = window.setTimeout(() => setVisivel(eHoje()), proximo + 500);
    return () => window.clearTimeout(id);
  }, [visivel]);

  if (!visivel) return null;

  const en = lang === "en";

  return (
    <section id="mensagem-do-dia" className="section section-cream">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-[0.6rem] sm:text-xs uppercase tracking-[0.35em] text-muted-foreground mb-2">
          {en ? "Today is the day" : "É hoje"}
        </p>

        <h2 className="font-display text-3xl sm:text-5xl text-primary">
          {en ? "A word from us" : "Uma palavra nossa"}
        </h2>

        <div
          className="flex items-center justify-center"
          style={{ marginTop: 14, marginBottom: 18 }}
        >
          <span aria-hidden style={{ width: 52, borderTop: "1px dashed var(--olive)" }} />
          <Heart className="mx-3" size={14} strokeWidth={1.25} style={{ color: "var(--gold)" }} />
          <span aria-hidden style={{ width: 52, borderTop: "1px dashed var(--olive)" }} />
        </div>

        <div className="space-y-4 text-sm sm:text-base leading-relaxed text-muted-foreground">
          {en ? (
            <>
              <p>
                Chegou o dia que imaginámos durante tanto tempo — e a melhor parte é
                que o vamos viver convosco.
              </p>
              <p>
                Thank you for travelling, for rearranging your day and for being here.
                Dance, eat, laugh and stay with us until the very end.
              </p>
              <p>See you at the Glicínia. With all our love,</p>
            </>
          ) : (
            <>
              <p>
                Chegou o dia que imaginámos durante tanto tempo — e a melhor parte é
                podermos vivê-lo convosco.
              </p>
              <p>
                Obrigado por virem de longe, por trocarem planos e por estarem aqui.
                Dancem, comam, riam-se muito e fiquem connosco até ao fim.
              </p>
              <p>Até já na Glicínia. Com todo o nosso amor,</p>
            </>
          )}
        </div>

        <p
          className="italic text-2xl sm:text-3xl"
          style={{
            color: "var(--gold)",
            fontFamily: "Allura, 'Great Vibes', cursive",
            marginTop: 16,
          }}
        >
          Joana &amp; Diogo
        </p>
      </div>
    </section>
  );
}
