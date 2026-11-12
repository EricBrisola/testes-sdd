# Implementation Plan: Dashboard Detalhado de Movimentações com Gráficos

**Branch**: `006-dashboard-movimentacoes` | **Date**: 2026-10-30 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/006-dashboard-movimentacoes/spec.md`

## Summary

Implementação do Dashboard Financeiro Analítico de Movimentações com gráficos interativos e animados utilizando a biblioteca `recharts`, com 100% dos cálculos e agregações executados no backend Fastify e consumidos por uma interface moderna, responsiva e estritamente tipada em React 19 e `styled-components`.

No **Backend**, será criado o serviço de métricas e o endpoint protegido `GET /api/movimentacoes/dashboard`, que executa as consultas analíticas otimizadas com Prisma ORM e PostgreSQL, entregando em payload único:
1. Resumo financeiro geral do histórico global da conta (total de entradas, saídas e saldo).
2. Top 5 categorias agrupadas por maior valor financeiro acumulado (R$), separadas por despesas e receitas.
3. Proporções percentuais por método de pagamento (Pix, Dinheiro, Cartão) para despesas e receitas.
4. Montante dos últimos 6 meses móveis em colunas verticais com divisão percentual entre entradas (verde) e saídas (vermelho).
5. As últimas 20 movimentações inseridas no banco ordenadas por `createdAt` decrescente.

No **Frontend**, a nova rota `/dashboard` e o link na Navbar darão acesso ao dashboard composto por 3 seções no Desktop (Card Header de ponta a ponta, Seção de Gráficos de Rosca e Barra Única com filtro unificado, e Seção com Linha do Tempo e Barras Mensais) e 6 blocos sequenciais em coluna única no Mobile. Os gráficos do `recharts` terão efeitos de animação suaves ao carregar (varredura angular na rosca e crescimento vertical nas barras) e estados elegantes de carregamento (skeletons) e lista vazia.

---

## Technical Context

**Language/Version**: TypeScript 5+ no Node.js 20 (Backend Fastify) e Vite / React 19 (Frontend)

**Primary Dependencies**: Fastify 5, `@fastify/jwt`, Prisma ORM 5, React 19, `styled-components` 6, `react-router-dom` 7, `recharts` (adicionada ao frontend)

**Storage**: PostgreSQL (modelos `Movimentacao` e `Categoria` existentes no `schema.prisma`)

**Testing**: Jest e React Testing Library

**Target Platform**: Web (Design 100% responsivo para mobile, tablet e desktop)

**Project Type**: Web Application (Monorepo Backend/Frontend)

**Performance Goals**: Tempo de resposta do endpoint consolidado < 150ms; transição instantânea (< 50ms) ao alternar o filtro unificado entre Despesas e Entradas; animações de gráficos suaves a 60fps sem bloqueio da UI.

**Constraints**:
- Todos os cálculos analíticos de métricas, somatórios e percentuais pertencem estritamente ao backend; o frontend apenas apresenta e formata visualmente os dados recebidos.
- Autenticação obrigatória em todas as rotas (backend via JWT `onRequest: jwtVerify` e frontend via guarda de sessão em `App.tsx`).
- Isolamento absoluto multilocatário: todas as consultas no banco utilizam estritamente o `userId` autenticado.
- Estilização exclusiva com `styled-components` em arquivos `styles.ts` isolados (proibido CSS inline conforme a Constituição).
- Componentes funcionais puros com Props explicitamente tipadas (sem uso de `React.FC` ou `any`).
- Responsividade total: no mobile, a interface organiza-se em uma coluna única de 6 blocos empilhados.

**Scale/Scope**: Dashboard financeiro analítico integrado, 1 endpoint REST consolidado, 4 componentes visuais modulares de gráficos e linha do tempo, link na Navbar e rota autenticada `/dashboard`.

---

## Constitution Check

*GATE: Passed*

- **TypeScript Strictness**: Proibido o uso de `any`. Todas as interfaces e DTOs (`DashboardDataDTO`, `ResumoFinanceiroGeralDTO`, `CategoriaMetricaDTO`, `MetodoPagamentoMetricaDTO`, `MesMetricaDTO`, `UltimaMovimentacaoDTO` e Props dos componentes) possuem tipagem estrita.
- **Functional Components**: Todos os novos componentes (`DashboardPage`, `SummaryCard`, `CategoryDonutChart`, `PaymentMethodBarChart`, `TimelineList`, `MonthlyAmountBarChart`) são declarados como funções normais (`function Component() {}`) ou arrow functions, sem `React.FC` ou `React.FunctionComponent`.
- **Props Typing**: Cada componente exporta e tipa explicitamente sua interface de Props.
- **UI Logic**: Separação rigorosa entre tipos (`src/types/dashboard.ts`), requisições de API (`src/services/dashboard.service.ts`), estilos (`styles.ts`) e interface pura. Zero cálculos de métricas no front-end.
- **Styling**: Proibido CSS inline. Todo o estilo é isolado em arquivos `styles.ts` dedicados para cada componente via `styled-components`.
- **Dependencies**: A biblioteca `recharts` foi solicitada expressamente pelo usuário para prover gráficos com animações personalizadas e responsividade.
- **Responsiveness**: O layout é 100% responsivo, adaptando-se de 3 seções horizontais no desktop para 6 blocos sequenciais em coluna única no mobile.
- **Git Branching**: Operando na branch dedicada `006-dashboard-movimentacoes`.
- **No Deprecated Code**: Utilização das APIs modernas do React 19, Recharts e Fastify.

---

## Project Structure

### Documentation (this feature)

```text
specs/006-dashboard-movimentacoes/
├── spec.md              # Especificação de requisitos funcionais e clarificações
├── plan.md              # Este plano de implementação técnica
├── research.md          # Decisões de arquitetura, Recharts e animações (Phase 0)
├── data-model.md        # DTOs, entidades e regras de agregação matemática (Phase 1)
├── quickstart.md        # Roteiro de testes ponta a ponta e validação (Phase 1)
├── contracts/
│   └── dashboard.md     # Contrato do endpoint GET /api/movimentacoes/dashboard (Phase 1)
└── checklists/
    └── requirements.md  # Checklist de qualidade da especificação
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── services/
│   │   └── dashboard.service.ts      # Consultas Prisma: agregações, Top 5, métodos, meses e timeline
│   ├── api/
│   │   ├── routes/
│   │   │   └── movimentacoes.routes.ts # Registro do endpoint GET /dashboard com jwtVerify
│   │   └── server.ts
│   └── tests/
│       └── unit/
│           └── dashboard.service.test.ts

frontend/
├── src/
│   ├── types/
│   │   └── dashboard.ts              # Interfaces TypeScript dos dados do Dashboard
│   ├── services/
│   │   └── dashboard.service.ts      # Cliente HTTP para GET /api/movimentacoes/dashboard
│   ├── components/
│   │   ├── Navbar/
│   │   │   ├── index.tsx             # Adiciona link para /dashboard
│   │   │   └── styles.ts
│   │   ├── DashboardSummaryCard/     # Header de ponta a ponta: Entradas, Saídas e Saldo
│   │   │   ├── index.tsx
│   │   │   └── styles.ts
│   │   ├── CategoryDonutChart/       # Gráfico de Rosca Recharts (Top 5) com varredura
│   │   │   ├── index.tsx
│   │   │   └── styles.ts
│   │   ├── PaymentMethodBarChart/    # Gráfico de Barra Única Recharts com crescimento
│   │   │   ├── index.tsx
│   │   │   └── styles.ts
│   │   ├── TimelineList/             # Linha do tempo informativa das últimas 20 movimentações
│   │   │   ├── index.tsx
│   │   │   └── styles.ts
│   │   ├── MonthlyAmountBarChart/    # Gráfico Recharts de colunas verticais empilhadas (verde/vermelho)
│   │   │   ├── index.tsx
│   │   │   └── styles.ts
│   │   └── DashboardSkeleton/        # Placeholder de carregamento suave
│   │       ├── index.tsx
│   │       └── styles.ts
│   ├── pages/
│   │   └── Dashboard/                # Página principal orquestradora e responsiva
│   │       ├── index.tsx
│   │       └── styles.ts
│   ├── App.tsx                       # Registro da rota protegida /dashboard
│   └── package.json                  # Inclusão da biblioteca recharts
└── tests/
    └── unit/
        ├── DashboardSummaryCard.test.tsx
        ├── CategoryDonutChart.test.tsx
        └── MonthlyAmountBarChart.test.tsx
```

**Structure Decision**: A feature segue estritamente a arquitetura desacoplada do projeto. O backend agrupa a inteligência analítica em `dashboard.service.ts` e expõe a rota autenticada em `movimentacoes.routes.ts`. O frontend isola cada bloco visual em seu próprio componente com `styles.ts` separado, garantindo fidelidade à Constituição e facilidade de manutenção e testes unitários.

---

## Complexity Tracking

*Nenhuma violação aos princípios constitucionais. Nenhuma complexidade não justificada introduzida.*
