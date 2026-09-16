---
description: "Task list for user-auth feature implementation"
---

# Tasks: user-auth

**Input**: Design documents from `/specs/002-user-auth/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Update `backend/.env` and `frontend/.env` with `GOOGLE_CLIENT_ID` and `JWT_SECRET` placeholders
- [ ] T002 [P] Install backend dependencies (`@fastify/jwt`, `@fastify/cookie`, `google-auth-library`) in `backend/`
- [ ] T003 [P] Install frontend dependencies (`@react-oauth/google`, `axios`) in `frontend/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 Add `User` model (mapped to `users` table) to `backend/prisma/schema.prisma`
- [ ] T005 Run Prisma migration (`npx prisma db push` or `migrate dev`) in `backend/` to create the table
- [ ] T006 [P] Configure JWT and Cookie plugins in `backend/src/plugins/jwt.ts`
- [ ] T007 [P] Create frontend API service configured to send cookies (`withCredentials: true`) in `frontend/src/services/api.ts`
- [ ] T008 [P] Wrap the React application with `<GoogleOAuthProvider>` in `frontend/src/main.tsx`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Sign in with Google (Priority: P1) 🎯 MVP

**Goal**: Authenticate into the system using an existing Google account.

**Independent Test**: Can be fully tested by navigating to the login screen and completing the Google SSO flow, resulting in a successful session (cookie set).

### Implementation for User Story 1

- [ ] T009 [P] [US1] Create Auth Service logic to verify Google Token and manage users in `backend/src/services/auth.service.ts`
- [ ] T010 [US1] Create Fastify auth routes (`POST /api/auth/google`, `POST /api/auth/logout`) in `backend/src/api/routes/auth.routes.ts`
- [ ] T011 [US1] Register auth routes and JWT plugin in `backend/src/api/server.ts`
- [ ] T012 [P] [US1] Create `GoogleLoginButton` component with styles in `frontend/src/components/GoogleLoginButton/index.tsx` and `styles.ts`
- [ ] T013 [P] [US1] Create `Login` page with styles in `frontend/src/pages/Login/index.tsx` and `styles.ts`
- [ ] T014 [US1] Implement state and routing logic in `frontend/src/App.tsx` to conditionally show `Login` or `Home` depending on authentication status

**Checkpoint**: At this point, User Story 1 should be fully functional. The Google Button should generate a token, send it to the backend, and the backend should return the `HttpOnly` cookie.

---

## Phase 4: User Story 2 - Secure API Access (Priority: P1)

**Goal**: Secure access to user-specific data using industry-standard tokens so that the backend can verify the user's identity.

**Independent Test**: Can be fully tested by making authenticated and unauthenticated requests to a protected endpoint.

### Implementation for User Story 2

- [ ] T015 [P] [US2] Create Fastify user routes (`GET /api/users/me`) in `backend/src/api/routes/users.routes.ts`
- [ ] T016 [US2] Protect `/api/users/me` route by verifying the JWT cookie in `backend/src/api/routes/users.routes.ts`
- [ ] T017 [US2] Register user routes in `backend/src/api/server.ts`
- [ ] T018 [P] [US2] Fetch user profile on frontend using `api.ts` and display the user's name in `frontend/src/pages/Home.tsx`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T019 Run the validation steps described in `quickstart.md`
- [ ] T020 Run `npm run typecheck` on both frontend and backend to validate TypeScript rules

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
- Frontend and backend implementation tasks within a User Story can generally run in parallel
