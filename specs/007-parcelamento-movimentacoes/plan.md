# Implementation Plan: Cadastro e Gestão de Movimentações Parceladas

**Branch**: `007-parcelamento-movimentacoes` | **Date**: 2026-11-12 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/007-parcelamento-movimentacoes/spec.md` e diretrizes do usuário para suporte a vínculo de parcelas (`isParcela`, `parcelamentoId`), transações atômicas (`prisma.$transaction`) e layout responsivo sem quebras.

---

## Summary

Implementação da funcionalidade de **Parcelamento de Movimentações** (entradas ou saídas) de 2 a 24 parcelas com cálculo automático e rateio preciso de resíduo de centavos.

No **Backend (Fastify + Prisma)**:
1. Extensão do modelo `Movimentacao` no `schema.prisma` com `isParcela` (Boolean), `parcelamentoId` (UUID string), `numeroParcela` (Int) e `totalParcelas` (Int), além de índices dedicados para consultas rápidas.
2. Inclusão de suporte no serviço de movimentações (`movimentacoes.service.ts`):
   - **Criação em lote**: se `isParcela === true`, calcula o valor de cada parcela, aloca a sobra de centavos na 1ª parcela e gera os registros com vencimentos mensais progressivos dentro de `prisma.$transaction`.
   - **Edição sincronizada**: propaga alterações de campos comuns (nome base, categoria, método, tipo, valor) para todas as parcelas do mesmo `parcelamentoId` e desloca as datas de parcelas subsequentes ($j > k$) pelo mesmo delta de dias da alteração, tudo sob `prisma.$transaction`.
   - **Exclusão em cascata**: se o item for parcelado, executa a exclusão de todas as movimentações do grupo (`parcelamentoId`) em uma única operação atômica via `prisma.$transaction`.

No **Frontend (React 19 + styled-components)**:
1. Atualização do formulário `MovimentacaoForm`:
   - Inclusão do checkbox "Parcelar movimentação" estilizado de forma harmoniosa.
   - Quando marcado, renderiza o `<Select>` de parcelas (2x a 24x) posicionado horizontalmente entre o input de **Valor** e o input de **Data**.
   - Redefinição do container flexível (`DynamicFieldsRow`) com `flex: 1 1 0` e `min-width: 0` para que os campos compartilhem a linha sem corte, quebra indesejada ou estouro de largura no desktop, empilhando fluidamente em telas mobile (< 580px).
2. Atualização dos tipos e serviços (`types/movimentacao.ts` e `services/movimentacao.service.ts`).
3. Atualização do modal de confirmação de exclusão (`ConfirmDeleteModal`) e de edição (`MovimentacaoEditModal`) para informar claramente quando a movimentação é parcelada e sincronizar o estado da listagem.

---

## Technical Context

**Language/Version**: TypeScript 5+ no Node.js 20 (Backend Fastify) e Vite / React 19 (Frontend)

**Primary Dependencies**: Fastify 5, `@fastify/jwt`, Prisma ORM 5, React 19, `styled-components` 6, `react-router-dom` 7

**Storage**: PostgreSQL com Prisma ORM (extensão do modelo `Movimentacao` com colunas de parcelamento e índices)

**Testing**: Jest e testes manuais integrados ponta a ponta descritos no `quickstart.md`

**Target Platform**: Web (Design 100% responsivo para mobile, tablet e desktop)

**Project Type**: Web Application (Monorepo Backend/Frontend)

**Performance Goals**:
- Criação em lote de até 24 parcelas em menos de 100ms via `prisma.$transaction`.
- Exclusão em lote e atualização sincronizada em menos de 50ms.
- Renderização visual e transição fluida do formulário a 60fps sem oscilação de layout (CLS zero).

**Constraints**:
- Atomicidade estrita em todas as operações de mutação de parcelas através de `prisma.$transaction`.
- Proibição de CSS inline: todo layout e estilo devem residir estritamente em arquivos `styles.ts` via `styled-components`.
- Componentes funcionais puros com tipagem estrita de Props (sem `React.FC` ou `any`).
- Isolamento multilocatário absoluto por `userId`.
- Responsividade total sem quebra de inputs em resoluções a partir de 320px de largura.

**Scale/Scope**:
- Geração de 2 a 24 registros vinculados por parcelamento.
- Impacto nos componentes de cadastro, listagem, edição e exclusão de movimentações.

---

## Constitution Check

*GATE: Passed*

- **I. Qualidade**:
  - **TypeScript Strictness**: Proibido uso de `any`. Todas as novas propriedades (`isParcela`, `parcelamentoId`, `numeroParcela`, `totalParcelas`) são estritamente tipadas como `boolean`, `string | null` e `number | null`.
  - **Functional Components**: Todos os componentes novos ou modificados utilizam declarações de função padrão (`function Component() {}`), sem `React.FC`.
  - **Props Typing**: Todas as interfaces de Props são explicitamente declaradas e exportadas.
  - **UI Logic**: A lógica de negócio e cálculo matemático de parcelamento reside no serviço / backend; o frontend gerencia apenas a captura e renderização dos dados.
- **II. Arquitetura**:
  - **Separation of Concerns**: Separação rigorosa entre tipos (`src/types/`), serviços (`src/services/`), estilos (`styles.ts`) e componentes visuais.
  - **Styling**: Proibido CSS inline. O comportamento de flexbox adaptativo dos inputs de valor, parcelas e data é isolado no arquivo `styles.ts`.
  - **Dependencies**: Nenhuma nova dependência de terceiros é necessária. Apenas APIs já existentes no projeto são utilizadas.
- **III. Design**:
  - **Responsiveness**: O layout adapta-se de 3 colunas horizontais (`flex: 1 1 0`) no desktop para coluna única vertical empilhada no mobile (< 580px).
- **IV. Workflow**:
  - **Git Branching**: Executando na branch `007-parcelamento-movimentacoes`.
  - **No Deprecated Code**: Uso de padrões modernos do Prisma e React 19.
  - **Docker Dependency Synchronization**: Qualquer migração do Prisma (`npx prisma db push` ou `prisma migrate`) será executada dentro do container Docker ativo (`docker compose exec backend ...`).

---

## Project Structure

### Documentation (this feature)

```text
specs/007-parcelamento-movimentacoes/
├── spec.md              # Especificação de requisitos funcionais e clarificações
├── plan.md              # Este plano de implementação técnica
├── research.md          # Decisões de modelagem, transações e layout flexível (Phase 0)
├── data-model.md        # Extensão do modelo Prisma, DTOs e validações (Phase 1)
├── quickstart.md        # Roteiro de testes ponta a ponta e validação (Phase 1)
├── contracts/
│   └── movimentacoes-api.md # Contratos dos endpoints REST (Phase 1)
└── checklists/
    └── requirements.md  # Checklist de qualidade da especificação
```

### Source Code (repository root)

```text
backend/
├── prisma/
│   └── schema.prisma                 # Adição de isParcela, parcelamentoId, numeroParcela, totalParcelas
├── src/
│   ├── services/
│   │   └── movimentacoes.service.ts   # Criação em lote, edição sincronizada e exclusão atômica em transaction
│   └── api/
│       └── routes/
│           └── movimentacoes.routes.ts # Schema e rota de criação com suporte a parcelas

frontend/
├── src/
│   ├── types/
│   │   └── movimentacao.ts           # Adição dos campos de parcelamento nos tipos TypeScript
│   ├── services/
│   │   └── movimentacao.service.ts    # Suporte a campos de parcelamento nas chamadas de API
│   ├── components/
│   │   ├── MovimentacaoForm/
│   │   │   ├── index.tsx              # Checkbox de parcelamento, select 2x-24x e cálculo
│   │   │   └── styles.ts              # Row flexível sem quebras e estilos do checkbox
│   │   ├── MovimentacaoEditModal/
│   │   │   ├── index.tsx              # Exibição informativa de parcelamento e edição sincronizada
│   │   │   └── styles.ts
│   │   └── ConfirmDeleteModal/
│   │       └── index.tsx              # Alerta de exclusão em lote quando for parcela
│   └── pages/
│       └── Movimentacoes/
│           └── index.tsx              # Atualização do estado local ao editar/excluir parcelas irmãs
```

**Structure Decision**: Monorepo Web Application padrão do projeto (`backend/` e `frontend/`), reutilizando a infraestrutura existente de rotas Fastify e componentes React com `styled-components`.

---

## Complexity Tracking

Nenhuma violação aos princípios da Constituição foi identificada. Todos os critérios de qualidade e arquitetura foram atendidos.
