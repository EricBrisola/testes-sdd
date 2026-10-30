# Implementation Plan: Listagem e Visualização de Movimentações

**Branch**: `005-listagem-movimentacoes` | **Date**: 2026-10-22 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/005-listagem-movimentacoes/spec.md`

## Summary

Implementação da tela completa de consulta, filtragem e gestão de movimentações financeiras no frontend e backend. No backend Fastify, o endpoint `GET /api/movimentacoes` será expandido com suporte a filtros combináveis multicritério (múltiplas categorias, tipo, método de pagamento e período de datas) e paginação sob demanda, acompanhado dos novos endpoints `PUT /api/movimentacoes/:id` (edição completa) e `DELETE /api/movimentacoes/:id` (exclusão com validação de ownership). Todas as rotas serão autenticadas via JWT. No frontend React, será criada a nova rota `/movimentacoes` com link na Navbar, disponibilizando um painel moderno de filtros (checkboxes para categorias, selects para tipo/natureza e inputs de data com validação via `react-toastify`), alternador dinâmico de visualização entre **Cards** e **Lista** (com inicialização adaptativa por dispositivo), modal de edição interativo e confirmação de exclusão em tempo real sem recarregamento de página.

## Technical Context

**Language/Version**: TypeScript 5+ no Node.js 20 (Backend Fastify) e Vite / React 19 (Frontend)

**Primary Dependencies**: Fastify, Prisma ORM, React 19, Styled-Components, `react-router-dom`, `react-toastify`

**Storage**: PostgreSQL (modelos `Movimentacao` e `Categoria` existentes no `schema.prisma`)

**Testing**: Jest e React Testing Library

**Target Platform**: Web (Mobile-First, interfaces 100% responsivas para smartphones, tablets e desktops)

**Project Type**: Web Application (Monorepo Backend/Frontend)

**Performance Goals**: Tempo de resposta do endpoint com filtros < 100ms; transição visual instantânea na troca de modo Cards/Lista (< 200ms); carregamento progressivo sob demanda ("Carregar Mais") inferior a 500ms.

**Constraints**:
- Autenticação obrigatória em todas as rotas do backend (`onRequest: jwtVerify`).
- Chave estrangeira `userId` obrigatória em toda operação para garantia de isolamento multilocatário (ownership estrito).
- Sem CSS inline: todos os estilos organizados em arquivos `styles.ts` isolados via `styled-components`.
- Componentes funcionais puros (sem uso de `React.FC` ou `React.FunctionComponent`), com tipagem explícita de Props.
- Notificações de inconsistência de datas tratadas via `react-toastify` conforme especificado pelo usuário.

**Scale/Scope**: Histórico financeiro com filtros acumulativos, paginação incremental, modal para edição de 6 atributos e exclusão segura com feedback visual.

## Constitution Check

*GATE: Passed*

- **TypeScript Strictness**: Proibido uso de `any`. Todas as interfaces e DTOs (`FiltrosMovimentacoesDTO`, `AtualizarMovimentacaoDTO`, `MovimentacaoComCategoria`, Props de componentes) são estritamente tipadas.
- **Functional Components**: Componentes React declarados exclusivamente como funções tradicionais (`function Component() {}`) ou arrow functions. Proibido o uso de `React.FC` ou `React.FunctionComponent`.
- **Props Typing**: Todas as props de componentes (`MovimentacaoList`, `MovimentacaoCards`, `MovimentacoesFilters`, `MovimentacaoEditModal`, etc.) com interfaces explícitas.
- **UI Logic**: Separação rigorosa entre componentes visuais, tipos (`src/types/movimentacao.ts`) e chamadas de API (`src/services/movimentacao.service.ts`).
- **Styling**: Proibido CSS inline. Todo o estilo é isolado em arquivos `styles.ts` dedicados para cada componente.
- **Dependencies**: A adição da biblioteca `react-toastify` foi solicitada expressamente pelo usuário para emissão de alertas e feedbacks de validação temporal, mantendo o bundle enxuto.
- **Responsiveness**: Modos Lista e Cards totalmente responsivos, com modo Lista adaptativo no Desktop e Cards no Mobile por padrão.
- **Git Branching**: Operando na branch dedicada `005-listagem-movimentacoes`.
- **No Deprecated Code**: Uso estrito das diretrizes modernas do React 19 e TypeScript.

## Project Structure

### Documentation (this feature)

```text
specs/005-listagem-movimentacoes/
├── spec.md              # Especificação de requisitos funcionais e clarificações
├── plan.md              # Este plano de implementação técnica
├── research.md          # Decisões arquiteturais e justificativas técnicas (Phase 0)
├── data-model.md        # Entidades, DTOs e regras de validação (Phase 1)
├── quickstart.md        # Roteiro de testes e validação ponta a ponta (Phase 1)
├── contracts/
│   └── api.md           # Contratos dos endpoints REST de movimentações (Phase 1)
└── checklists/
    └── requirements.md  # Checklist de qualidade da especificação
```

### Source Code (repository root)

```text
backend/
├── prisma/
│   └── schema.prisma                 # Schema existente com Movimentacao e Categoria
├── src/
│   ├── services/
│   │   ├── movimentacoes.service.ts  # Implementação de listagem filtrada/paginada, update e delete
│   │   └── categorias.service.ts     # Serviço de categorias existente
│   ├── api/
│   │   ├── routes/
│   │   │   └── movimentacoes.routes.ts # Rotas GET, PUT, DELETE /api/movimentacoes autenticadas
│   │   └── server.ts                 # Servidor Fastify com rotas registradas
│   └── tests/
│       └── unit/
│           └── movimentacoes.service.test.ts

frontend/
├── src/
│   ├── types/
│   │   └── movimentacao.ts           # Tipos TypeScript: Movimentacao, FiltroMovimentacoes, etc.
│   ├── services/
│   │   └── movimentacao.service.ts   # Funções de requisição HTTP (listar, atualizar, excluir)
│   ├── components/
│   │   ├── Navbar/                   # Atualização da barra de navegação com link para Movimentações
│   │   │   ├── index.tsx
│   │   │   └── styles.ts
│   │   ├── MovimentacoesFilters/     # Filtros: checkboxes de categorias, selects de tipo/natureza e datas
│   │   │   ├── index.tsx
│   │   │   └── styles.ts
│   │   ├── MovimentacaoList/         # Exibição em formato Lista (tabela/linhas ordenadas)
│   │   │   ├── index.tsx
│   │   │   └── styles.ts
│   │   ├── MovimentacaoCards/        # Exibição em formato Cards
│   │   │   ├── index.tsx
│   │   │   └── styles.ts
│   │   ├── MovimentacaoEditModal/    # Modal com campos de edição e confirmação de salvamento
│   │   │   ├── index.tsx
│   │   │   └── styles.ts
│   │   └── ConfirmDeleteModal/       # Diálogo modal de confirmação antes de excluir
│   │       ├── index.tsx
│   │       └── styles.ts
│   ├── pages/
│   │   └── Movimentacoes/            # Nova página (/movimentacoes) orquestrando filtros e listagens
│   │       ├── index.tsx
│   │       └── styles.ts
│   ├── App.tsx                       # Registro da nova rota /movimentacoes e container do Toastify
│   └── main.tsx
└── tests/
    └── unit/
        ├── MovimentacoesFilters.test.tsx
        ├── MovimentacaoList.test.tsx
        └── MovimentacaoEditModal.test.tsx
```

**Structure Decision**: Monorepo desacoplado seguindo o padrão estabelecido no projeto. No backend, a camada de serviço centraliza toda a lógica de paginação, filtros Prisma e validação de propriedade (`userId`). No frontend, a nova página `/movimentacoes` decompõe a interface em componentes especializados e reutilizáveis (`MovimentacoesFilters`, `MovimentacaoList`, `MovimentacaoCards`, `MovimentacaoEditModal`, `ConfirmDeleteModal`), cada um com seu respectivo arquivo `styles.ts` via `styled-components`, garantindo estética limpa, responsividade e aderência estrita à Constituição.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|---|---|---|
| Adição da dependência `react-toastify` | Exigência explícita do usuário para emissão de avisos visuais de inconsistência de datas e feedbacks de operação | Alertas nativos `window.alert()` são síncronos e quebram a estética da aplicação; mensagens estáticas inline ocupam espaço fixo e poluem a grade de filtros |
| Criação de Modal dedicado para Edição | Movimentações possuem 6 campos obrigatórios e seletores que não cabem de forma limpa em edição inline em cards ou em linhas compactas | Edição inline em tabela/card gera quebra de layout em mobile e complexidade de validação simultânea; criar rota externa (`/editar`) quebra o fluxo de filtros do usuário |
