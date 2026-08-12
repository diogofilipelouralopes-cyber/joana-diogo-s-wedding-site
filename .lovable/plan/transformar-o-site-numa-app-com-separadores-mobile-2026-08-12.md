# Transformar o site numa app com separadores (mobile)

Objetivo: reduzir drasticamente o scroll em telemóvel, dividindo a página única em ecrãs
navegáveis por uma barra inferior de separadores. Desktop mantém-se exatamente como está.

## Como fica em mobile

Barra inferior fixa (a atual QuickAccessBar passa a ser a navegação da app) com 5 separadores:

```text
[ Início ]  [ Evento ]  [ RSVP ]  [ Fotos ]  [ Mais ]
```

- **Início** — Hero compacto + contagem decrescente + botão grande "Confirmar presença".
- **Evento** — Local, mapa, horários, como chegar, informações práticas (dress code, alojamento, estacionamento).
- **RSVP** — Só o formulário.
- **Fotos** — Álbum partilhado + galeria pública.
- **Mais** — Nossa História, FAQ, Livro de Mensagens, Presentes, Agradecimento (em lista de cartões que abrem/expandem).

Cada ecrã cabe praticamente sem scroll longo (1 a 2 ecrãs no máximo), em vez da página
única atual com ~12 secções seguidas.

## Regras

- Nenhuma funcionalidade é removida: RSVP, mensagens, galeria, presentes, chatbot, avisos e
  sugestão de músicas continuam iguais.
- O chatbot mantém-se acessível a partir da barra inferior.
- Desktop (≥768px) continua a ver a página única atual, com o menu de topo como hoje.
- Links antigos com âncoras (#rsvp, #event, ...) continuam a funcionar e passam a levar ao
  separador correspondente em mobile.

## Detalhes técnicos

- Novas rotas: `/evento`, `/rsvp`, `/fotos`, `/mais` (mais `/` como Início). Cada rota
  reutiliza os componentes existentes, sem duplicar código.
- Em desktop, essas rotas redirecionam/ancoram para as secções da home; a home mantém o
  render completo atual acima de 768px.
- Head metadata própria por rota (title, description, og:*), canónicos e sitemap atualizados.
- `QuickAccessBar` é convertida em barra de separadores com estado ativo (`Link` +
  `activeProps`), mantendo o visual arredondado atual e o botão do chat.
- Padding inferior global para o conteúdo não ficar tapado pela barra.
- Sem alterações de backend, base de dados ou emails.
