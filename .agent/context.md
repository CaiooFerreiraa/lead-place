# Contexto do Projeto

## Descrição
Coletor de leads baseado em número de telefone. A aplicação permite selecionar cidade e categoria para carregar leads (produtos) e extrair informações de contato (WhatsApp).

## Stack / Tecnologias
- **Framework**: Next.js 15 (App Router)
- **Runtime**: Bun
- **Auth**: NextAuth.js (se necessário no futuro, por enquanto foco na API externa)
- **UI**: shadcn/ui + Tailwind CSS
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
