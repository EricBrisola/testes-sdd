# Implementation Tasks: Cadastro de Movimentações

**Branch**: `003-cadastro-movimentacoes`
**Spec**: [spec.md](./spec.md)
**Plan**: [plan.md](./plan.md)

## Phase 1: Setup (Shared Infrastructure)
**Purpose**: Project initialization and basic structure

- [x] T001 [P] Ensure development database is running (Docker) in `docker-compose.yml`

---

## Phase 2: Foundational (Blocking Prerequisites)
**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 Add `TipoMovimentacao` and `MetodoPagamento` Enums to `backend/prisma/schema.prisma`
- [x] T003 Add `Categoria` and `Movimentacao` models to `backend/prisma/schema.prisma`
- [x] T004 Apply Prisma schema to database and generate client via CLI commands

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - Acesso à Tela Principal (Priority: P1)
**Goal**: Como um usuário logado, quero ser direcionado automaticamente para a tela de Cadastro de Movimentações.

**Independent Test**: Login redirects to Home displaying the empty layout.

### Implementation for User Story 1
- [x] T005 [US1] Ensure `frontend/src/pages/Home.tsx` is strictly typed and functional, acting as the main dashboard for the user.

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Cadastro de Nova Movimentação (Priority: P1) MVP
**Goal**: Como um usuário, quero preencher um formulário com os detalhes da minha movimentação e salvá-la.

**Independent Test**: API returns 201 Created and Form is cleared upon submission.

### Implementation for User Story 2 (Backend)
- [x] T006 [P] [US2] Implement `backend/src/services/movimentacoes.service.ts` using `prisma.$transaction` for database insertions.
- [x] T007 [US2] Implement endpoint POST `/api/movimentacoes` in `backend/src/api/routes/movimentacoes.routes.ts`
- [x] T008 [US2] Register `movimentacoesRoutes` inside `backend/src/api/server.ts`

### Implementation for User Story 2 (Frontend)
- [x] T009 [P] [US2] Create reusable UI component `frontend/src/components/Input/index.tsx` and `styles.ts`
- [x] T010 [P] [US2] Create reusable UI component `frontend/src/components/Select/index.tsx` and `styles.ts`
- [x] T011 [US2] Create core feature component `frontend/src/components/MovimentacaoForm/index.tsx` and `styles.ts` (Form validation and HTTP POST)
- [x] T012 [US2] Render `<MovimentacaoForm />` inside `frontend/src/pages/Home.tsx`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: Polish & Cross-Cutting Concerns
**Purpose**: Improvements that affect multiple user stories

- [x] T013 Code cleanup and ensure all components comply with the `Constitution` (No inline styles, no React.FC)
- [x] T014 Run validation scenarios described in `quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies
- **Foundational (Phase 2)**: BLOCKS all user stories
- **User Stories (Phase 3 & 4)**: Depend on Foundational phase completion. Backend endpoints must be created before Frontend form integration.
- **Polish (Final Phase)**: Depends on all desired user stories being complete.
