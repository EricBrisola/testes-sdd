# Tasks: Cadastro e Gestão de Movimentações Parceladas

**Input**: Design documents from `/specs/007-parcelamento-movimentacoes/`  
**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/movimentacoes-api.md](./contracts/movimentacoes-api.md), [quickstart.md](./quickstart.md)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode ser executado em paralelo (arquivos distintos, sem dependência direta de tarefas em andamento)
- **[Story]**: Identificador da User Story correspondente (`[US1]`, `[US2]`, `[US3]`, `[US4]`)
- Todos os caminhos de arquivos são explícitos e baseados na estrutura do repositório

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparação do schema de banco de dados e definições de tipos para parcelamento

- [x] T001 Adicionar campos de parcelamento no modelo Movimentacao em `backend/prisma/schema.prisma` (`isParcela Boolean @default(false)`, `parcelamentoId String?`, `numeroParcela Int?`, `totalParcelas Int?`, com índices `@@index([parcelamentoId])` e `@@index([userId, parcelamentoId])`)
- [x] T002 Sincronizar o schema com o banco de dados PostgreSQL via container Docker executando `docker compose exec backend npx prisma db push` e regenerar o Prisma Client
- [x] T003 [P] Atualizar definições de tipos TypeScript em `frontend/src/types/movimentacao.ts` adicionando `isParcela: boolean`, `parcelamentoId?: string | null`, `numeroParcela?: number | null` e `totalParcelas?: number | null`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Infraestrutura básica e validações de serviço que bloqueiam a implementação das histórias

**⚠️ CRITICAL**: Nenhuma história de usuário deve ser iniciada antes da conclusão desta fase

- [x] T004 Atualizar DTOs e validações em `backend/src/services/movimentacoes.service.ts` incluindo `isParcela?: boolean` e `totalParcelas?: number` com validação de `totalParcelas` entre 2 e 24 e `valor > 0`
- [x] T005 [P] Atualizar schema da rota `POST /api/movimentacoes` em `backend/src/api/routes/movimentacoes.routes.ts` para receber e validar os campos `isParcela` e `totalParcelas` no corpo da requisição
- [x] T006 [P] Atualizar funções de serviço da API no frontend em `frontend/src/services/movimentacao.service.ts` para suportar `isParcela` e `totalParcelas` nas operações de criação e manipulação de movimentações

**Checkpoint**: Base de dados, DTOs e serviços de comunicação configurados e prontos para as histórias de usuário.

---

## Phase 3: User Story 1 - Cadastro de Movimentação Parcelada no Formulário (Priority: P1) 🎯 MVP

**Goal**: Permitir ao usuário cadastrar entradas ou saídas parceladas de 2x até 24x no formulário, dividindo o valor total e alocando resíduo de centavos na 1ª parcela em transação atômica.

**Independent Test**: Preencher o formulário marcando parcelamento em 3x com valor de R$ 100,00, salvar e confirmar que 3 movimentações vinculadas foram criadas com vencimentos mensais (Parcela 1: R$ 33,34, Parcelas 2 e 3: R$ 33,33).

### Implementation for User Story 1

- [x] T007 [US1] Implementar cálculo de divisão de parcelas com rateio de resíduo de centavos na primeira parcela, progressão de datas mensais e inserção em lote atômica via `prisma.$transaction` em `backend/src/services/movimentacoes.service.ts`
- [x] T008 [P] [US1] Adicionar estilos para o checkbox de parcelamento e container flexível responsivo em `frontend/src/components/MovimentacaoForm/styles.ts`
- [x] T009 [US1] Inserir controle de checkbox "Parcelar movimentação" e seletor `<Select>` com opções de 2x até 24x posicionado entre Valor e Data em `frontend/src/components/MovimentacaoForm/index.tsx`
- [x] T010 [US1] Conectar a submissão do formulário ao backend enviando `isParcela` e `totalParcelas` quando selecionado em `frontend/src/components/MovimentacaoForm/index.tsx`

**Checkpoint**: User Story 1 (MVP) 100% funcional e testável de forma independente.

---

## Phase 4: User Story 2 - Exclusão Unificada de Movimentações Parceladas (Priority: P1)

**Goal**: Ao excluir qualquer parcela de um grupo, excluir todas as parcelas vinculadas em transação atômica, informando o usuário claramente no modal de confirmação.

**Independent Test**: Acessar a listagem de movimentações, clicar em excluir em qualquer parcela de uma série parcelada, verificar que o modal alerta sobre a exclusão de todas as parcelas e confirmar a remoção completa do grupo.

### Implementation for User Story 2

- [x] T011 [US2] Implementar exclusão em cascata por `parcelamentoId` e `userId` utilizando `prisma.$transaction` em `backend/src/services/movimentacoes.service.ts`
- [x] T012 [P] [US2] Atualizar o modal de confirmação de exclusão em `frontend/src/components/ConfirmDeleteModal/index.tsx` para exibir mensagem informando que se trata de uma movimentação parcelada e que todas as parcelas serão removidas
- [x] T013 [US2] Atualizar a ação de confirmação de exclusão em `frontend/src/pages/Movimentacoes/index.tsx` para expurgar do estado local todas as parcelas irmãs do mesmo `parcelamentoId`

**Checkpoint**: User Stories 1 e 2 plenamente funcionais e integradas de forma atômica.

---

## Phase 5: User Story 3 - Edição Sincronizada de Movimentações Parceladas (Priority: P2)

**Goal**: Ao editar dados de uma parcela, propagar alterações de campos comuns a todas as parcelas do grupo e deslocar datas subsequentes em transação atômica, mantendo a quantidade total de parcelas fixa.

**Independent Test**: Abrir modal de edição de uma parcela intermediária, alterar nome e adiar a data em 5 dias; verificar que o novo nome foi aplicado em todas as parcelas e as datas das parcelas posteriores foram deslocadas em 5 dias.

### Implementation for User Story 3

- [x] T014 [US3] Implementar atualização sincronizada em lote no backend em `backend/src/services/movimentacoes.service.ts` propagando campos comuns (nome base, categoria, método, valor) e deslocando as datas de parcelas subsequentes via `prisma.$transaction`
- [x] T015 [P] [US3] Atualizar o modal de edição em `frontend/src/components/MovimentacaoEditModal/index.tsx` exibindo informações da parcela em modo somente leitura (sem permitir alterar total de parcelas) e alertando sobre atualização sincronizada do grupo
- [x] T016 [US3] Atualizar a sincronização de estado após edição em `frontend/src/pages/Movimentacoes/index.tsx` para recarregar ou atualizar no estado local todas as parcelas irmãs afetadas

**Checkpoint**: Edição sincronizada de parcelas totalmente operacional.

---

## Phase 6: User Story 4 - Adaptação Fluida e Responsiva do Layout do Formulário (Priority: P2)

**Goal**: Garantir que a inserção do seletor de parcelas entre Valor e Data não comprometa o alinhamento do formulário no desktop e preserve empilhamento limpo no mobile.

**Independent Test**: Alternar o checkbox de parcelamento em resoluções de desktop (1280px) e mobile (375px), verificando que nenhum campo sofre quebra de linha ou corte de texto.

### Implementation for User Story 4

- [x] T017 [P] [US4] Ajustar propriedades de flexbox (`flex: 1 1 0; min-width: 0;`) no container de inputs em `frontend/src/components/MovimentacaoForm/styles.ts` para distribuição balanceada dos 3 campos no desktop e quebra em coluna única no mobile (< 580px)
- [x] T018 [US4] Validar transição visual e responsividade no componente `frontend/src/components/MovimentacaoForm/index.tsx` ao alternar o estado do checkbox

**Checkpoint**: Formulário com responsividade e fluidez visual impecáveis em qualquer resolução.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Verificações de qualidade, conformidade com a Constituição e validação final

- [x] T019 [P] Validar ausência de tipos `any` e verificar compilação TypeScript estrita no frontend e backend
- [x] T020 Executar o roteiro completo de testes manuais ponta a ponta documentado em `specs/007-parcelamento-movimentacoes/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1: Setup (T001-T003)
      │
      ▼
Phase 2: Foundational (T004-T006)
      │
      ├──────────────────────┬──────────────────────┐
      ▼                      ▼                      ▼
Phase 3: US1 (T007-T010)  Phase 4: US2 (T011-T013) Phase 6: US4 (T017-T018)
      │                      │
      ▼                      ▼
Phase 5: US3 (T014-T016) ────┘
      │
      ▼
Phase 7: Polish & Validation (T019-T020)
```

### User Story Dependencies

- **User Story 1 (P1 - MVP)**: Requer Phase 2 concluída. Não depende de nenhuma outra história.
- **User Story 2 (P1)**: Requer Phase 2 concluída. Opera sobre as parcelas geradas por US1.
- **User Story 3 (P2)**: Requer Phase 2 e modelo de exclusão/criação estabilizados.
- **User Story 4 (P2)**: Requer Phase 2 e integra-se diretamente ao formulário de US1.

---

## Parallel Execution Opportunities

- **Phase 1**: `T003` (Frontend types) pode rodar em paralelo com `T001` (Prisma schema).
- **Phase 2**: `T005` (Rotas Fastify) e `T006` (Serviço frontend) podem rodar em paralelo após `T004`.
- **Phase 3 (US1)**: `T008` (Estilos Form) pode rodar em paralelo com `T007` (Serviço Backend).
- **Phase 4 (US2)**: `T012` (Modal exclusão frontend) pode rodar em paralelo com `T011` (Backend delete transaction).
- **Phase 5 (US3)**: `T015` (Modal edição frontend) pode rodar em paralelo com `T014` (Backend update transaction).
- **Phase 7**: `T019` (Type-check) pode rodar em paralelo com `T020`.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Concluir Setup (T001-T003)
2. Concluir Foundational (T004-T006)
3. Concluir User Story 1 (T007-T010)
4. **Validar MVP**: Testar o cadastro de parcelas no formulário e conferir registros gerados no banco

### Entrega Incremental

1. Setup + Foundational → Base pronta
2. User Story 1 → Cadastro de parcelas com cálculo exato (MVP!)
3. User Story 2 → Exclusão em cascata atômica
4. User Story 4 → Ajustes finos de layout responsivo do formulário
5. User Story 3 → Edição sincronizada com deslocamento de datas
6. Polish & Testes Finais
