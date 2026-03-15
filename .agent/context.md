# Contexto do Projeto

## Descrição
Coletor de leads baseado em número de telefone. A aplicação permite selecionar cidade e categoria para carregar leads (produtos) e extrair informações de contato (WhatsApp).

## Stack / Tecnologias
- **Framework**: Next.js 15 (App Router)
- **Runtime**: Bun
- **Auth**: NextAuth.js (se necessário no futuro, por enquanto foco na API externa)
- **UI**: shadcn/ui + Tailwind CSS + sonner (toasts)
- **Linguagem**: TypeScript (strict mode)
- **API Externa**: custom node API com headers `x-api-key`

## Convenções e Padrões
- Arquitetura limpa (Clean Architecture)
- Bun como runtime padrão
- Server Components por padrão
- Validação com Zod
- Nomenclatura em kebab-case para arquivos e PascalCase para componentes

## Notas Importantes
- O token da API está no `.env` como `API_KEY`.
- A API principal é `https://gnarly-unconcertable-fransisca.ngrok-free.dev`.
- Headers obrigatórios: `x-api-key`.

---

## Banco de Dados

### Banco
N/A (Consumo de API Externa)

### ORM / Query Builder
N/A

### Convenções de Migration
N/A

### Estrutura Principal
N/A

### Notas de Banco
N/A

---

## Design

### Design System
Tailwind CSS + shadcn/ui

### Tipografia
- Display: "Outfit" (Google Fonts)
- Corpo: "Inter" (Google Fonts)

### Paleta de Cores
- Primary: #0F172A (Sleek Dark)
- Accent: #10B981 (Emerald/WhatsApp vibe)
- Surface: #F8FAFC

### Espaçamento e Grid
Escala de 4px, Grid de 12 colunas.

### Componentes Base
Botões, Selects, Cards, Badges (shadcn/ui).

### Acessibilidade
WCAG AA.

### Animações e Transições
Framer Motion para micro-interações.

### Breakpoints
sm: 640px, md: 768px, lg: 1024px, xl: 1280px.

---

## Histórico Visual

### Tema Completo - TC - v1
**Data:** 2026-03-15
**Motivo:** Definição inicial do design system. Emerald Green como accent para combinar com o tema de "leads/telefone/whatsapp".

---

## Histórico de Decisões
- [2026-03-15] Inicialização — Criação do projeto com Next.js 15 e Bun.
- [2026-03-15] API — Uso de headers `x-api-key` para comunicação com a API ngrok.
- [2026-03-15] Tipagem — Ajuste no `onValueChange` do `Select` (@base-ui) para lidar com possível valor `null` e incompatibilidade de assinatura com `setState`.
- [2026-03-15] UI/UX — Refatoração do LeadCollector para design "Luxury Sober" com animações fluidas, suporte a input livre para categorias e exportação CSV.
- [2026-03-15] Documentação — Atualização dos tipos e repositórios para suportar slugs de cidades conforme nova versão da API.
- [2026-03-15] Interface — Implementação de paginação client-side para exibição de leads, garantindo performance e melhor experiência em grandes listas.
- [2026-03-15] Bug Fix — Correção de erro de hidratação no `Combobox` através da implementação correta da prop `render` do Base UI no `PopoverTrigger`.
- [2026-03-15] Funcionalidade — Alteração do foco nos contatos; Adição do botão 'Ver no Maps', aproveitando o retorno do endereço nos leads, em substituição ao acesso do site de origem do diretório.
- [2026-03-15] Interface e Funcionalidade — Adição de recurso para controle de Leads; Implementação de um check visual, salvo localmente (`localStorage`), para marcar se um lead já possui um site.
- [2026-03-15] Funcionalidade — Adição de botão para "Ocultar / Excluir" um lead localmente que não é mais relevante ou ativo, persistido via `localStorage`.
