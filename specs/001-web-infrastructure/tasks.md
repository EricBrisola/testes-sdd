---
description: "Task list for Web Infrastructure feature implementation"
---

# Tasks: Web Infrastructure

**Input**: Design documents from `/specs/001-web-infrastructure/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Initialize backend Node.js project in `backend/`
- [x] T002 Initialize frontend React Vite TypeScript project in `frontend/`
- [x] T003 Create `docker-compose.yml` at project root for orchestration (PostgreSQL, frontend, backend)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 Setup backend Prisma schema and migrations framework in `backend/prisma/schema.prisma`
- [x] T005 [P] Setup strict TypeScript configuration (no any) in `backend/tsconfig.json`
- [x] T006 [P] Setup strict TypeScript configuration (no any) in `frontend/tsconfig.json`
- [x] T007 Configure Jest unit testing framework in `backend/`
- [x] T008 Configure Jest unit testing framework in `frontend/`
- [x] T009 [P] Install and configure Styled Components in `frontend/`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Developer runs the project locally (Priority: P1) 🎯 MVP

**Goal**: Start the application locally using a single command, so that developers can begin developing features immediately.

**Independent Test**: Can be tested by running the dev server command and verifying the default page loads in the browser without errors.

### Implementation for User Story 1

- [x] T010 [P] [US1] Create backend `backend/Dockerfile`
- [x] T011 [P] [US1] Create frontend `frontend/Dockerfile`
- [x] T012 [P] [US1] Implement basic backend Fastify server and health route in `backend/src/api/server.ts`
- [x] T013 [P] [US1] Create basic frontend default page with Styled Components in `frontend/src/pages/Home.tsx`
- [x] T014 [US1] Update `backend/package.json` with dev scripts
- [x] T015 [US1] Update `frontend/package.json` with dev scripts

**Checkpoint**: At this point, User Story 1 should be fully functional. Running `docker-compose up` should start everything successfully.

---

## Phase 4: User Story 2 - Automated quality checks pass (Priority: P1)

**Goal**: Automatically enforce type safety, linting, and formatting rules.

**Independent Test**: Can be tested by intentionally violating a rule (e.g., adding an `any` type or inline CSS) and verifying the build or linter fails.

### Implementation for User Story 2

- [x] T016 [P] [US2] Configure ESLint and Prettier in `backend/` to enforce strict rules
- [x] T017 [P] [US2] Configure ESLint and Prettier in `frontend/` to enforce functional components and block inline CSS
- [x] T018 [P] [US2] Write dummy passing health test in `backend/tests/unit/health.test.ts`
- [x] T019 [P] [US2] Write dummy passing page test in `frontend/tests/unit/Home.test.tsx`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently. Code quality is fully enforced.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T020 Run `docker-compose up -d` to validate the steps described in `quickstart.md`
- [x] T021 Run `npm run typecheck` and `npm run test` on both frontend and backend to validate rules

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, US1 and US2 can theoretically start in parallel
- Dockerfile creations [P] can run concurrently
- Test creation [P] can run concurrently

---

## Implementation Strategy

### MVP First

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Ensure Docker containers start perfectly.
5. Complete Phase 4: User Story 2
6. **STOP and VALIDATE**: Ensure linters and tests enforce constitution rules.
