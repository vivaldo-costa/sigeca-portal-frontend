# SIGECA — Portal (nova arquitectura frontend)

Fundação do novo frontend do portal SIGECA em **React + Vite + TypeScript + Tailwind v4**,
mantendo a identidade visual actual (preto/branco do login + azul institucional `#003366`).

## Stack

| Camada | Escolha | Porquê |
|---|---|---|
| Build | Vite | HMR instantâneo, build rápido |
| UI | React 19 + TypeScript | tipagem forte, ecossistema maduro |
| Estilo | Tailwind v4 (`@theme`, sem `tailwind.config.js`) | tokens de design centralizados em CSS |
| Routing | React Router v6 | rotas protegidas, layouts aninhados |
| Dados assíncronos | TanStack Query | cache, revalidação, loading/error automáticos |
| Estado local (auth) | Zustand | mais leve que Redux, suficiente para sessão/UI |
| HTTP | Axios (`withCredentials`) | mantém sessão PHP via cookie, sem gerir tokens à mão |
| Ícones | lucide-react | consistente, tree-shakeable |

## Estrutura de pastas

```
src/
  app/                 # (reservado para providers/config globais futuros)
  components/
    ui/                # primitivos: Button, Input, Alert, Card, Preloader
    layout/            # Sidebar, Topbar, AppShell, ProtectedRoute
  pages/
    auth/              # Login (feito), Recuperar (a fazer)
    dashboard/         # placeholder — próximo módulo
    perfil/            # a fazer
    carrinho/          # a fazer
    cartao/            # a fazer
    actividades/       # a fazer
  lib/                 # api.ts (cliente axios), cn.ts (merge de classes)
  store/               # auth.ts (Zustand)
  types/               # tipos partilhados do domínio
```

## Design system (`src/index.css`)

Tokens definidos em `@theme`, derivados directamente do CSS do login actual:

- **Marca**: `--color-brand-600: #003366` (azul institucional AECA) + escala 50→900
- **Neutros**: `ink` (#0a0a0a), `paper` (#fff), `mist-50…600` (cinzas do login actual)
- **Tipografia**: `Outfit` para títulos (`font-display`), `Inter` para corpo de texto
- **Raios/sombras**: `--radius-sig-sm/md/lg`, `--shadow-sig-card/float`

Usa-se directamente como classes Tailwind: `bg-brand-600`, `text-mist-600`, `rounded-[var(--radius-sig-md)]`, etc.

## Backend real: SIGECA API (Node.js/Express + MySQL, JWT)

> Actualização: a recomendação inicial abaixo era manter PHP e expor uma API fina por cima.
> Na prática foi construída uma **API nova em Node.js/Express + MySQL**, com autenticação
> JWT — não sessão PHP por cookie. Este frontend já está alinhado com essa API real; o texto
> antigo fica em baixo só como registo da decisão original.

### Diferenças-chave face à hipótese inicial (já corrigidas neste projecto)

| | Hipótese inicial | API real |
|---|---|---|
| Auth | Sessão PHP por cookie (`withCredentials`) | **JWT Bearer** — `accessToken` (8h) + `refreshToken` (30d) |
| Envelope de resposta | `{ success, data, message }` | `{ sucesso, dados, mensagem }` |
| Login | `{ codigo_associado, senha }` | `{ identificador, senha }` (aceita nº SIGECA ou e-mail) |
| Logout | `POST /auth/logout` | **Não existe** — sem sessão no servidor, "sair" é só limpar os tokens locais |
| Ficheiros enviados | `/src/img/...` (placeholder) | `https://api.aeca.ao/uploads/<subpasta>/<ficheiro>` |
| Downloads protegidos | `<a href>` / `window.location.href` | Têm de passar pelo cliente `api` (Bearer) e sair como Blob — ver `lib/download.ts` |

`GET /auth/me` devolve só `{ id, codigo_associado, nome, perfil_id, perfil_nome }` (o que vem no
JWT) — bem menos do que `POST /auth/login`, que devolve a linha completa do utilizador. Depois
de um refresh de página, campos como `foto`/`email` ficam `undefined` até haver um pedido que os
devolva de novo (ex.: `GET /perfil`).

### Módulos já implementados na API real

`auth`, `utilizadores`, `dashboard` (este, o do Portal), `perfil`, `carrinho`. Os hooks destes
módulos neste projecto já estão a bater certo com o backend real.

### Módulos ainda por implementar (o frontend já está pronto, só falta o backend)

Cada hook destes tem um comentário `⚠️ Backend ainda não implementado` no código:
- `/votacoes/votar` (votar numa votação do Perfil)
- `/pedidos/:id/recibo` (gerar/baixar recibo de uma compra)
- `/cartao/validar`, `/cartao/pdf`, `/cartao/gerar` (fluxos de Cartão Digital)
- `/documentos/declaracao`, `/documentos/ficha`
- `/inscricoes`, `/pagamentos/evento` (módulo Actividades/Inscrições/Pagamentos)

### Nota histórica: recomendação original (PHP), não seguida

Dado que:
- o stack principal era PHP/MySQL/PDO e o SIGECA já corria em produção (cPanel, PHP 8.1);
- a lógica de negócio já estava toda escrita e testada em PHP;
- migrar para Node.js/Express implicaria reescrever ~9000 linhas de lógica de acesso a dados;

a recomendação tinha sido **não migrar o backend**, mas sim expor os ficheiros PHP actuais como
endpoints JSON finos. Não foi o caminho seguido — a API real é Node.js — mas o raciocínio fica
registado para contexto.

## Roteiro de módulos (ordem sugerida)

1. ✅ **Fundação** — scaffold, design system, layout shell, auth store, routing
2. ✅ **Login** — `pages/auth/Login.tsx`, já ligado ao `useAuthStore`
3. ✅ **Dashboard** — `pages/dashboard/Dashboard.tsx`, réplica completa de `portal/index.php`:
   cartão digital 3D interactivo (arrastar/flip), loja (slider + carrossel de produtos com
   pesquisa), comunidade (carrossel de funcionalidades + avatares + estatísticas), actividades
   & formações (filtro por tipo + estado de inscrição), votações, documentos (declaração,
   cartão, ficha de dados), tutoriais em vídeo (modal de reprodução) e FAQ.
   *Pendente para o módulo Carrinho*: os modais de adicionar ao carrinho, inscrição e
   pagamento — ficam melhor construídos já integrados nesse módulo, para não duplicar trabalho.
4. ✅ **Perfil** — `pages/perfil/Perfil.tsx`, réplica completa de `portal/perfil/index.php`:
   cabeçalho (foto, nome, badges de secção/agrupamento), 5 tabs — **Sobre** (dados pessoais,
   percurso escutista, linha do tempo de transferências/mudanças de secção carregada sob-
   -demanda), **Actividades** e **Formações** (inscrições com estado/vagas), **Minhas Compras**
   (acordeão de pedidos com itens e geração de recibo em PDF) e **Votações** (só visível se
   `pode_ver_votacoes`, com formulário de voto ou resultado consoante o estado) — e modal de
   edição (dados pessoais, foto, sacramentos, alteração de palavra-passe opcional).
5. ⬜ **Carrinho & Checkout** — a partir de `portal/carrinho/index.php` + `checkout.php` (o maior módulo, 1013 linhas)
6. ✅ **Cartão digital (fluxos restantes)** — `pages/publico/ValidarCartao.tsx`, réplica de
   `portal/cartao/validar-cartao.php`: página **pública** (sem sessão, fora do `AppShell`/
   `ProtectedRoute`) acedida ao ler o QR Code do cartão — mostra estado (válido/expirado),
   dados do associado, eventos/formações inscritas e histórico de compras. Os fluxos de
   geração (`gerar.php`) e download em PDF (`pdf.php`) já tinham sido cobertos no Dashboard.
7. ✅ **Actividades / Inscrições / Pagamentos** — dois modais ligados aos botões que já
   existiam no Dashboard (`AtividadesSection`):
   - `InscreverModal` — confirmação de inscrição, equivalente a `inscricao_unificada.php`
     (o backend deve continuar a validar diocese/idade e criar o registo como `pendente`)
   - `PagamentoModal` — pagamento completo ou por prestações com upload de comprovativo,
     equivalente a `pagamento_evento.php`
   `actividades/index.php` (a listagem simples "Minhas Actividades") não foi replicado à parte
   — o seu conteúdo já está coberto, de forma mais completa, pelas tabs Actividades/Formações/
   Compras/Votações do módulo Perfil.

8. ✅ **Carrinho & Checkout** — o maior módulo, completo:
   - `AdicionarCarrinhoModal` — liga finalmente o botão "Adicionar" da Loja (com selecção de
     tamanho/cor quando o produto tem variações) — equivalente ao `INSERT` em `carrinho`
   - `pages/carrinho/Carrinho.tsx` — lista de itens com quantidade (+/-) e remoção, resumo
     lateral com total — equivalente a `carrinho/index.php`
   - `pages/carrinho/Checkout.tsx` — wizard de 3 passos (Resumo → Pagamento → Entrega) +
     ecrã de confirmação, equivalente a `checkout.php` + `api/finalizar_pedido.php`:
     método de pagamento (transferência/Multicaixa), upload de comprovativo, entrega por
     levantamento gratuito ou ao domicílio com custo por zona (Luanda Cidade, Talatona,
     Viana, Kilamba, Cacuaco — os mesmos preços do original)

Com isto, **todos os módulos do roteiro original estão feitos**: Fundação, Login, Dashboard,
Perfil, Cartão digital, Actividades/Inscrições/Pagamentos e Carrinho & Checkout. O que fica
para uma fase seguinte, fora deste roteiro, é o **Sistema de gestão** (a segunda metade do
SIGECA, para uso interno dos dirigentes) — ver a secção "Sistema de gestão vs Portal do
Escuteiro" mais abaixo.

### Endpoints do módulo Carrinho & Checkout

```
GET    /api/v1/carrinho                 → { itens[], total }
POST   /api/v1/carrinho                 { produto_id, quantidade, tamanho?, cor? }
PATCH  /api/v1/carrinho/:id             { quantidade }  → { quantidade, subtotal, total, aviso_stock? }
DELETE /api/v1/carrinho/:id             → { total, total_carrinho, resumo_itens[], vazio }

POST /api/v1/carrinho/checkout (multipart/form-data)
  { metodo_pagamento, referencia_pagamento, comprovativo (ficheiro),
    tipo_entrega: 'levantamento'|'domicilio', zona_entrega?, municipio?, bairro?,
    referencia_morada?, telefone? }
  → { success, message, pedido_id }
  Deve reaproveitar a mesma transacção de api/finalizar_pedido.php: validar stock
  (produto_variacoes ou produtos), criar pedido com status 'aguardando_pagamento',
  criar entrega e pagamento, decrementar stock, esvaziar o carrinho e enfileirar os
  e-mails de confirmação.

GET /api/v1/pedidos/:id/recibo          → binário PDF (já usado também pelo Perfil)
```

### Endpoints do módulo Inscrições/Pagamentos

```
POST /api/v1/inscricoes                  { evento_id } | { formacao_id }
  → valida diocese/idade (evento) e duplicados, cria registo 'pendente',
    incrementa num_inscritos quando aplicável

POST /api/v1/pagamentos/evento (multipart/form-data)
  { inscricao_id, evento_id, metodo_pagamento, tipo_pagamento: 'completo'|'prestacao',
    transacao, numero_prestacao?, comprovativo (ficheiro) }
  → valida transacção única e prestação não paga, regista o pagamento,
    actualiza valor_pago e o estado da inscrição ('confirmada' quando valor_pago >= valor)
```

Para o pagamento funcionar, o objecto `Atividade` devolvido por `GET /api/v1/dashboard` deve
incluir, quando o utilizador já está inscrito, `inscricao_id`, `valor_pago` e `prestacoes`
(hoje só existem no lado do `pagamento_evento.php`) — sem esses três campos o modal de
pagamento não consegue calcular o valor da prestação nem identificar a inscrição a actualizar.

### Endpoint da validação pública de cartão

```
GET /api/v1/cartao/validar?codigo=LA1006001
  → { encontrado, expirado, codigo_associado, nome, seccao, agrupamento, diocese,
      validade, eventos[], formacoes[], pedidos[] }
```

Este endpoint **não deve exigir sessão** — é chamado por quem lê o QR Code físico do cartão
(ex. staff de um evento), tal como `validar-cartao.php` hoje. O QR gerado em `cartao/pdf.php`
deve passar a apontar para a nova URL do frontend, por exemplo:
`https://portal.aeca.ao/validar-cartao?codigo=<codigo_associado>` em vez do actual
`https://aeca.ao/SIGECA/page/cartao/validar-cartao.php?codigo=`.

### Endpoints consumidos pelo Perfil

```
GET  /api/v1/perfil                              → { dados, atividades[], formacoes[], pedidos[], votacoes[] }
PUT  /api/v1/perfil            (multipart/form-data) → actualiza dados pessoais / foto / senha
GET  /api/v1/perfil/timeline?escuteiro_id=       → { eventos[] } (transferências + mudanças de secção/cargo)
POST /api/v1/votacoes/votar    { votacao_id, opcao_id }
POST /api/v1/pedidos/:id/recibo                  → { url } (gera e devolve o PDF do recibo)
```

`PUT /api/v1/perfil` deve validar a senha actual (equivalente a `password_verify`) só quando
`nova_senha` é enviado, tal como em `perfil/save.php`, e reaproveitar a mesma lógica de
upload/validação de imagem (tipo, tamanho) já existente.

### Endpoints já consumidos pelo Dashboard

```
GET  /api/v1/dashboard
  → {
      produtos[], atividades[], faqs[], cartao|null, totalItensCarrinho,
      totalUtilizadores, utilizadoresAvatares[], stats: { eventos, formacoes, produtos },
      votacoes[]  // já com totalVotos e votantes[] resolvidos
    }
POST /api/v1/cartao/gerar        → gera o cartão do utilizador autenticado
GET  /api/v1/cartao/pdf?id=      → binário PDF do cartão
GET  /api/v1/documentos/declaracao?id=  → binário PDF (ex-config/gerar_declaracao.php)
GET  /api/v1/documentos/ficha?id=       → binário PDF (ex-config/gerar_ficha.php)
```

O tipo `Atividade` unifica `eventos` e `formacoes` (que na BD são a mesma tabela `eventos`
distinguida por `tipo`) — o endpoint deve devolver ambos já com esse campo `tipo` preenchido.
As contagens de `stats` (eventos, formações, produtos) e a lista de `votacoes` (com contagem
de votos e amostra de 5 votantes) devem ser resolvidas no backend, tal como já acontece nas
queries actuais de `portal/index.php`.

## Como correr

```bash
npm install
npm run dev      # http://localhost:5173 — /api é encaminhado para aeca.ao em dev (ver vite.config.ts)
npm run build    # build de produção em dist/
```

> Nota: o proxy de `/api` em `vite.config.ts` aponta para `https://aeca.ao` como placeholder —
> ajustar para o endereço real da nova API REST assim que os endpoints `/api/v1/*` existirem.
