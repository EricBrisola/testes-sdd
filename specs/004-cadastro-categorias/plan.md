# Implementation Plan: Cadastro de Categorias e Seleção em Movimentações

**Branch**: `004-cadastro-categorias` | **Date**: 2026-10-15 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/004-cadastro-categorias/spec.md`

## Summary

Implementação do módulo completo de gestão de categorias financeiras no frontend e backend. No backend Fastify, serão criadas as rotas RESTful protegidas (`GET`, `POST`, `PUT`, `DELETE` em `/api/categorias`) com persistência no PostgreSQL via Prisma ORM, ordenação alfabética nativa (`nome ASC`), criação automática de categorias padrão (`Alimentação`, `Lazer`, `Geral`) no primeiro acesso do usuário (onboarding), validação de duplicidade por usuário, verificação estrita de ownership e bloqueio de exclusão quando houver movimentações vinculadas (tratando constraint `Restrict` com HTTP `409`). No frontend React, será introduzido o roteamento via `react-router-dom`, a tela dedicada `/categorias` composta pelo formulário de criação e tabela responsiva com edição inline e exclusão, além da substituição do mock de categorias no formulário de movimentações (`MovimentacaoForm`) por uma integração real e dinâmica.

## Technical Context

**Language/Version**: TypeScript 5+ no Node.js 20 (Backend Fastify) e Vite / React 19 (Frontend)

**Primary Dependencies**: Fastify, Prisma ORM, React, Styled-Components, `react-router-dom` (novo para rotas de SPA)

**Storage**: PostgreSQL (modelos `Categoria` e `Movimentacao` já presentes no `schema.prisma`)

**Testing**: Jest e React Testing Library

**Target Platform**: Web (Mobile-First, interfaces 100% responsivas para smartphones e desktops)

**Project Type**: Web Application (Monorepo Backend/Frontend)

**Performance Goals**: Tempo de resposta de API < 100ms; atualização visual instantânea da tabela após criar/editar/excluir; carregamento dinâmico sem atraso perceptível no select de categorias.

**Constraints**:
- Autenticação obrigatória em todas as rotas de backend (JWT via Cookie/Bearer).
- Chave estrangeira obrigatória `userId` em toda categoria vinculando ao usuário logado.
- Categorias vinculadas a movimentações não podem ser excluídas (`onDelete: Restrict`).
- Nenhuma dependência depreciada ou APIs obsoletas (ex: sem `React.FormEvent` depreciado, sem inline CSS).

**Scale/Scope**: Gerenciamento individual de categorias por usuário, listagem alfabética ordenada no banco de dados, tabela com edição inline sem navegação externa.

## Constitution Check

*GATE: Passed*

- **TypeScript Strictness**: Interfaces rigorosas para DTOs, entidades (`Categoria`, `CriarCategoriaDTO`, `AtualizarCategoriaDTO`), Props e retornos de funções. Proibido uso de `any`.
- **Functional Components**: Componentes React declarados exclusivamente como funções tradicionais (`function Component() {}`) ou arrow functions. Proibido o uso de `React.FC` ou `React.FunctionComponent`.
- **Props Typing**: Todas as props de componentes (`CategoriaForm`, `CategoriaTable`, etc.) explicitamente tipadas com interfaces.
- **UI Logic**: Separação clara entre camada de apresentação (componentes UI), tipos (`src/types/`) e comunicação de rede/serviços (`src/services/`).
- **Styling**: Proibido CSS inline. Todos os componentes terão seus estilos definidos em arquivos `styles.ts` isolados utilizando `styled-components`.
- **Dependencies**: Adição única e justificada da biblioteca `react-router-dom` para viabilizar navegação entre rotas (`/` e `/categorias`), sem dependências supérfluas.
- **Responsiveness**: Formulário de criação, tabela de categorias e navegação projetados com abordagem mobile-first e responsividade total.
- **Git Branching**: Operando na branch dedicada `004-cadastro-categorias`.
- **No Deprecated Code**: Uso estrito de padrões modernos do React 19 e TypeScript, sem referências a APIs obsoletas.

## Project Structure

### Documentation (this feature)

```text
specs/004-cadastro-categorias/
├── plan.md              # Este plano de implementação
├── research.md          # Pesquisa técnica e decisões de arquitetura (Phase 0)
├── data-model.md        # Modelagem de dados, DTOs e entidades (Phase 1)
├── quickstart.md        # Guia de validação ponta a ponta (Phase 1)
├── contracts/           
│   └── api.md           # Contratos dos endpoints REST de categorias (Phase 1)
└── tasks.md             # Tarefas ordenadas de execução (Phase 2 - /speckit-tasks)
```

### Source Code (repository root)

```text
backend/
├── prisma/
│   └── schema.prisma                 # Schema existente com Categoria e Movimentacao
├── src/
│   ├── services/
│   │   ├── categorias.service.ts     # CRUD com regras de duplicidade, ownership e Restrict
│   │   └── movimentacoes.service.ts  # Serviço existente de movimentações
│   ├── api/
│   │   ├── routes/
│   │   │   ├── categorias.routes.ts  # Endpoints GET, POST, PUT, DELETE /api/categorias
│   │   │   └── movimentacoes.routes.ts # Endpoints de movimentações
│   │   └── server.ts                 # Registro do prefixo /api/categorias com hooks JWT
│   └── tests/
│       └── unit/
│           └── categorias.service.test.ts

frontend/
├── src/
│   ├── types/
│   │   └── categoria.ts              # Tipos TypeScript: Categoria, CriarCategoriaPayload, etc.
│   ├── services/
│   │   └── categoria.service.ts      # Funções de chamada HTTP à API de categorias
│   ├── components/
│   │   ├── CategoriaForm/            # Formulário de criação de categorias
│   │   │   ├── index.tsx
│   │   │   └── styles.ts
│   │   ├── CategoriaTable/           # Tabela com listagem, edição inline e exclusão
│   │   │   ├── index.tsx
│   │   │   └── styles.ts
│   │   ├── MovimentacaoForm/         # Atualização para consumir categorias reais
│   │   │   ├── index.tsx
│   │   │   └── styles.ts
│   │   └── Navbar/                   # Navegação entre Home (Movimentações) e Categorias
│   │       ├── index.tsx
│   │       └── styles.ts
│   ├── pages/
│   │   ├── Categorias/               # Página da rota /categorias
│   │   │   ├── index.tsx
│   │   │   └── styles.ts
│   │   └── Home.tsx                  # Página principal de movimentações atualizada
│   ├── App.tsx                       # Configuração de rotas (BrowserRouter, Routes, Route)
│   └── main.tsx
└── tests/
    └── unit/
        ├── CategoriaForm.test.tsx
        └── CategoriaTable.test.tsx
```

**Structure Decision**: Monorepo com divisão rígida de responsabilidades entre `backend/` e `frontend/`. No backend, a camada de rotas (`routes/`) delega toda a validação e integridade ao serviço (`categorias.service.ts`), garantindo consistência transacional e isolamento multilocatário por `userId`. No frontend, a nova rota `/categorias` adota componentes desacoplados (`CategoriaForm`, `CategoriaTable`), estilizados exclusivamente via `styled-components` em arquivos `styles.ts` dedicados, respeitando a Constituição do projeto.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Adição da dependência `react-router-dom` | A feature exige uma nova rota na aplicação com URL própria (`/categorias`), histórico de navegação e botões voltar do browser | Gerenciar telas por estado local `useState` no `App.tsx` quebra navegação padrão web, compartilhamento de URLs e deep linking |
