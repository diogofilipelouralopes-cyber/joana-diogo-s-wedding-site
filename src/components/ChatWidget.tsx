import { useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { MessageCircleHeart, X, RotateCcw } from "lucide-react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { useI18n } from "@/lib/i18n";
import assistantMark from "@/assets/chat-assistant.png";

const STORAGE_KEY = "wedding-chat-messages";

const COPY = {
  pt: {
    open: "Perguntas frequentes",
    title: "Assistente do casamento",
    subtitle: "Respostas rápidas às vossas dúvidas",
    intro:
      "Olá! Sou o assistente da Joana e do Diogo. Pergunta-me sobre horário, local, alojamento ou confirmação de presença.",
    placeholder: "Escreve a tua pergunta…",
    thinking: "A escrever…",
    reset: "Nova conversa",
    close: "Fechar",
    error: "Não consegui responder agora. Tenta novamente daqui a pouco.",
    suggestions: [
      "A que horas é a cerimónia?",
      "Onde é o casamento?",
      "Há alojamento no local?",
      "Como confirmo a minha presença?",
    ],
  },
  en: {
    open: "Frequently asked questions",
    title: "Wedding assistant",
    subtitle: "Quick answers to your questions",
    intro:
      "Hi! I'm Joana & Diogo's assistant. Ask me about the schedule, venue, accommodation or RSVP.",
    placeholder: "Type your question…",
    thinking: "Typing…",
    reset: "New conversation",
    close: "Close",
    error: "I couldn't answer right now. Please try again shortly.",
    suggestions: [
      "What time is the ceremony?",
      "Where is the wedding?",
      "Is there accommodation on site?",
      "How do I RSVP?",
    ],
  },
} as const;

function loadStoredMessages(): UIMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as UIMessage[]) : [];
  } catch {
    return [];
  }
}

export default function ChatWidget() {
  const { lang } = useI18n();
  const copy = COPY[lang === "en" ? "en" : "pt"];

  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [initialMessages] = useState<UIMessage[]>(() => loadStoredMessages());
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => setMounted(true), []);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: { lang },
      }),
    [lang],
  );

  const { messages, sendMessage, status, setMessages, error } = useChat({
    id: "wedding-faq",
    messages: initialMessages,
    transport,
  });

  const isBusy = status === "submitted" || status === "streaming";

  // Persistência: uma só conversa, guardada neste navegador.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (status === "streaming" || status === "submitted") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-40)));
    } catch {}
  }, [messages, status]);

  // Abertura controlada pela barra de acesso rápido.
  useEffect(() => {
    const toggle = () => setOpen((v) => !v);
    window.addEventListener("wedding-chat:toggle", toggle);
    return () => window.removeEventListener("wedding-chat:toggle", toggle);
  }, []);

  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => textareaRef.current?.focus(), 120);
    return () => window.clearTimeout(id);
  }, [open]);

  useEffect(() => {
    if (open && !isBusy) textareaRef.current?.focus();
  }, [isBusy, open]);


  const ask = (text: string) => {
    const value = text.trim();
    if (!value || isBusy) return;
    setInput("");
    void sendMessage({ text: value });
  };

  const reset = () => {
    setMessages([]);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {}
    textareaRef.current?.focus();
  };

  if (!mounted || !open) return null;

  return (
    <div
      className="chat-widget-root"
      style={{
        position: "fixed",
        left: "50%",
        transform: "translateX(-50%)",
        bottom: "calc(78px + env(safe-area-inset-bottom, 0px))",
        zIndex: 60,
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        gap: 12,
        maxWidth: "calc(100vw - 24px)",
      }}
    >

      {open && (
        <div
          role="dialog"
          aria-label={copy.title}
          style={{
            width: "min(380px, calc(100vw - 32px))",
            height: "min(560px, calc(100vh - 140px))",
            display: "flex",
            flexDirection: "column",
            background: "var(--ivory, #FBF8F1)",
            border: "1px solid color-mix(in oklab, var(--gold) 55%, transparent)",
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 18px 50px rgba(0,0,0,0.18)",
          }}
        >
          <header
            className="flex items-center gap-3 px-4 py-3"
            style={{ borderBottom: "1px solid color-mix(in oklab, var(--gold) 40%, transparent)" }}
          >
            <img
              src={assistantMark}
              alt=""
              width={512}
              height={512}
              loading="lazy"
              style={{ width: 34, height: 34, objectFit: "contain" }}
            />
            <div className="min-w-0 flex-1">
              <p
                className="truncate text-xs uppercase"
                style={{ fontFamily: "Cinzel, serif", color: "var(--olive)", letterSpacing: "0.16em" }}
              >
                {copy.title}
              </p>
              <p className="truncate text-xs" style={{ color: "var(--gold)" }}>
                {copy.subtitle}
              </p>
            </div>
            <button
              type="button"
              onClick={reset}
              aria-label={copy.reset}
              title={copy.reset}
              className="rounded-md p-1.5 transition-opacity hover:opacity-70"
              style={{ color: "var(--olive)" }}
            >
              <RotateCcw size={16} />
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={copy.close}
              className="rounded-md p-1.5 transition-opacity hover:opacity-70"
              style={{ color: "var(--olive)" }}
            >
              <X size={18} />
            </button>
          </header>

          <Conversation className="flex-1">
            <ConversationContent className="gap-3 px-4 py-4">
              {messages.length === 0 && (
                <div className="space-y-3">
                  <p className="text-sm leading-relaxed text-foreground/80">{copy.intro}</p>
                  <div className="flex flex-wrap gap-2">
                    {copy.suggestions.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => ask(s)}
                        className="rounded-full px-3 py-1.5 text-xs transition-colors"
                        style={{
                          border: "1px solid color-mix(in oklab, var(--gold) 60%, transparent)",
                          color: "var(--olive)",
                          background: "transparent",
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((message) => {
                const text = message.parts
                  .map((part) => (part.type === "text" ? part.text : ""))
                  .join("");
                if (!text.trim()) return null;
                return (
                  <Message from={message.role} key={message.id}>
                    <MessageContent
                      className={message.role === "user" ? "text-primary-foreground" : ""}
                      style={
                        message.role === "user"
                          ? { background: "var(--olive)", color: "#FBF8F1" }
                          : undefined
                      }
                    >
                      <MessageResponse>{text}</MessageResponse>
                    </MessageContent>
                  </Message>
                );
              })}

              {status === "submitted" && (
                <Shimmer className="text-sm">{copy.thinking}</Shimmer>
              )}

              {error && (
                <p className="text-sm" style={{ color: "#a3352f" }}>
                  {copy.error}
                </p>
              )}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>

          <div className="px-3 pb-3">
            <PromptInput
              onSubmit={(_message, event) => {
                event.preventDefault();
                ask(input);
              }}
            >
              <PromptInputTextarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={copy.placeholder}
              />
              <PromptInputFooter className="justify-end">
                <PromptInputSubmit status={status} disabled={!input.trim() && !isBusy} />
              </PromptInputFooter>
            </PromptInput>
          </div>
        </div>
      )}

    </div>
  );
}
