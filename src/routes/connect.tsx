import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { SiteFooter } from "@/components/SiteFooter";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Copy, Check, Bot, MessageSquare, Terminal, ExternalLink, Heart } from "lucide-react";

const SITE_URL = "https://joanaediogo-com.lovable.app";

function useMcpUrl() {
  const [mcpUrl, setMcpUrl] = useState<string>("");
  useEffect(() => {
    setMcpUrl(new URL("/mcp", window.location.origin).toString());
  }, []);
  return mcpUrl;
}

function appSlug() {
  return "joana-diogo-s-wedding-site";
}

export const Route = createFileRoute("/connect")({
  head: () => ({
    meta: [
      { title: "Ligar um assistente AI · Joana & Diogo" },
      {
        name: "description",
        content:
          "Instruções para ligar o site do casamento de Joana e Diogo a um assistente AI (ChatGPT, Claude ou Claude Code).",
      },
      { property: "og:title", content: "Ligar um assistente AI · Joana & Diogo" },
      {
        property: "og:description",
        content: "Instruções para ligar o site do casamento a um assistente AI.",
      },
      { property: "og:url", content: SITE_URL + "/connect" },
      { property: "og:type", content: "website" },
      { name: "robots", content: "noindex,nofollow" },
    ],
    links: [{ rel: "canonical", href: SITE_URL + "/connect" }],
  }),
  component: ConnectPage,
});

function ConnectPage() {
  const mcpUrl = useMcpUrl();
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Toaster position="top-center" />
      <Header />

      <main className="pt-28 sm:pt-32 pb-20 sm:pb-28 px-5 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10 sm:mb-12">
            <p className="text-[0.65rem] sm:text-xs uppercase tracking-[0.4em] text-muted-foreground mb-3">
              Integrações
            </p>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-primary">
              Ligar um assistente AI
            </h1>
            <div className="divider-ornament mt-6 max-w-xs mx-auto">
              <Heart className="w-3 h-3" strokeWidth={1} />
            </div>
            <p className="mt-4 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
              Usa estas instruções para ligar o ChatGPT, Claude ou Claude Code ao painel do casamento.
              Depois de ligado, o assistente pode ler confirmações, mensagens e atualizar o aviso em direto.
            </p>
          </div>

          <section className="card-gold p-6 sm:p-8 mb-8">
            <h2 className="font-display text-sm sm:text-base mb-4" style={{ letterSpacing: "0.2em" }}>
              Endereço do servidor MCP
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Copia este endereço e cola-o no assistente. Ele aponta sempre para o site atual.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  readOnly
                  value={mcpUrl}
                  aria-label="Endereço do servidor MCP"
                  className="w-full h-11 px-4 rounded-md border border-input bg-background text-foreground text-sm font-mono focus:outline-none focus:ring-1 focus:ring-ring"
                  onFocus={(e) => e.currentTarget.select()}
                />
              </div>
              <CopyButton text={mcpUrl} />
            </div>
          </section>

          <div className="space-y-6">
            <ClientCard
              icon={<Bot className="w-5 h-5" strokeWidth={1.5} />}
              name="ChatGPT"
              connectSteps={[
                "Abre o ChatGPT e ativa o modo de programador (se ainda não estiver ativo).",
                "Vai a Plugins → Configurações → Criar plugin.",
                "Cola o nome \"Joana & Diogo\" e o endereço MCP em cima.",
                "Revisa os detalhes, aceita o aviso de segurança e clica em Criar.",
                "Ativa o plugin no compositor de uma nova conversa e pede ao ChatGPT para usar o site.",
              ]}
              refreshSteps={[
                "Abre a página de Plugins no ChatGPT e seleciona \"Joana & Diogo\".",
                "Desce até Informação e clica em Atualizar.",
                "Se o endereço mudou, remove o plugin antigo e cria um novo com o endereço atual.",
                "Inicia um novo chat e pede ao ChatGPT para usar o site.",
              ]}
              href="https://chatgpt.com/plugins#settings/Connectors?create-connector=true&redirectAfter=%2Fplugins"
            />

            <ClientCard
              icon={<MessageSquare className="w-5 h-5" strokeWidth={1.5} />}
              name="Claude"
              connectSteps={[
                "Abre a página de conectores do Claude.",
                "Escolhe Adicionar conector personalizado.",
                "Cola o nome \"Joana & Diogo\" e o endereço MCP em cima.",
                "Revisa os detalhes e clica em Adicionar.",
                "Ativa o conector no compositor e pede ao Claude para usar o site.",
              ]}
              refreshSteps={[
                "Abre a página de Conectores no Claude e seleciona \"Joana & Diogo\".",
                "Atualiza ou recarrega a lista de ferramentas.",
                "Se o endereço mudou, remove o conector antigo e adiciona de novo com o endereço atual.",
                "Inicia uma nova conversa e pede ao Claude para usar o site.",
              ]}
              href={`https://claude.ai/customize/connectors?modal=add-custom-connector&connectorName=${encodeURIComponent(
                "Joana & Diogo",
              )}&connectorUrl=${encodeURIComponent(mcpUrl)}`}
            />

            <ClientCard
              icon={<Terminal className="w-5 h-5" strokeWidth={1.5} />}
              name="Claude Code"
              connectSteps={[
                "Copia o comando em baixo.",
                "Abre um terminal e cola-o.",
                "Inicia o Claude Code e corre /mcp para confirmar a ligação.",
                "Se pedido, faz login com a conta admin do site.",
                "Pede ao Claude Code para usar o site.",
              ]}
              refreshSteps={[
                "Inicia uma nova sessão do Claude Code — ele carrega as ferramentas mais recentes automaticamente.",
                "Se o endereço mudou, corre claude mcp remove joana-diogo-s-wedding-site.",
                "Volta a colar o comando de instalação com o endereço atual.",
                "Pede ao Claude Code para usar o site.",
              ]}
              command={`claude mcp add --scope user --transport http ${appSlug()} '${mcpUrl.replace(
                /'/g,
                "'\\''",
              )}'`}
            />

            <ClientCard
              icon={<ExternalLink className="w-5 h-5" strokeWidth={1.5} />}
              name="Outros clientes MCP"
              connectSteps={[
                "Abre as definições de servidor MCP ou conector personalizado do cliente.",
                "Cria uma nova ligação para um servidor MCP remoto.",
                "Dá o nome \"Joana & Diogo\" e cola o endereço MCP.",
                "Completa os passos de autenticação (login como admin do site).",
                "Ativa a ligação e pede ao assistente para usar o site.",
              ]}
              refreshSteps={[
                "Abre as definições do servidor MCP ou conector do cliente.",
                "Seleciona a ligação criada para \"Joana & Diogo\".",
                "Atualiza a lista de ferramentas, recarrega o servidor ou volta a ligar.",
                "Se o endereço mudou, cola o endereço atual.",
                "Inicia um novo chat ou sessão e pede ao assistente para usar o site.",
              ]}
            />
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm uppercase transition-colors hover:text-primary"
              style={{ fontFamily: "Cinzel, serif", letterSpacing: "0.2em", color: "var(--olive)" }}
            >
              <Heart className="w-3 h-3" strokeWidth={1.5} />
              Voltar ao site
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Endereço copiado");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Não foi possível copiar. Seleciona o texto manualmente.");
    }
  }

  return (
    <Button
      onClick={handleCopy}
      disabled={!text}
      className="h-11 px-4 sm:px-6"
      style={{ fontFamily: "Cinzel, serif", letterSpacing: "0.15em", textTransform: "uppercase" }}
    >
      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      {copied ? "Copiado" : "Copiar"}
    </Button>
  );
}

function ClientCard({
  icon,
  name,
  connectSteps,
  refreshSteps,
  href,
  command,
}: {
  icon: React.ReactNode;
  name: string;
  connectSteps: string[];
  refreshSteps: string[];
  href?: string;
  command?: string;
}) {
  return (
    <article className="card-gold p-5 sm:p-7">
      <div className="flex items-center gap-3 mb-5">
        <div className="text-primary">{icon}</div>
        <h2 className="font-display text-base sm:text-lg" style={{ letterSpacing: "0.2em" }}>
          {name}
        </h2>
      </div>

      <div className="space-y-5">
        <div>
          <h3
            className="text-xs uppercase mb-3"
            style={{ fontFamily: "Cinzel, serif", letterSpacing: "0.2em", color: "var(--gold)" }}
          >
            Ligar
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-foreground/80">
            {connectSteps.map((step, i) => (
              <li key={`connect-${i}`}>{step}</li>
            ))}
          </ol>
            {href && href.startsWith("http") && (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 text-sm transition-colors hover:text-primary"
                style={{ color: "var(--gold)" }}
              >
                Abrir {name}
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            {command && (
            <div className="mt-4 relative group">
              <pre
                className="p-4 rounded-md text-xs sm:text-sm overflow-x-auto font-mono"
                style={{ background: "var(--olive)", color: "var(--cream)", borderRadius: 8 }}
              >
                <code>{command}</code>
              </pre>
              <Button
                size="icon"
                variant="secondary"
                className="absolute top-2 right-2 h-8 w-8 opacity-70 group-hover:opacity-100 transition-opacity"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(command);
                    toast.success("Comando copiado");
                  } catch {
                    toast.error("Não foi possível copiar");
                  }
                }}
                aria-label="Copiar comando"
              >
                <Copy className="w-3.5 h-3.5" />
              </Button>
            </div>
          )}
        </div>

        <div
          className="border-t"
          style={{ borderColor: "color-mix(in oklab, var(--gold) 35%, transparent)" }}
        />

        <div>
          <h3
            className="text-xs uppercase mb-3"
            style={{ fontFamily: "Cinzel, serif", letterSpacing: "0.2em", color: "var(--gold)" }}
          >
            Atualizar depois de alterações
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-foreground/80">
            {refreshSteps.map((step, i) => (
              <li key={`refresh-${i}`}>{step}</li>
            ))}
          </ol>
        </div>
      </div>
    </article>
  );
}
