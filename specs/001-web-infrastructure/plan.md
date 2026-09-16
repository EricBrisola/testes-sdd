# Implementation Plan: Web Infrastructure

**Branch**: `[001-web-infrastructure]` | **Date**: 2026-09-10 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-web-infrastructure/spec.md`

## Summary

Set up the full stack infrastructure for the "Controle de Gastos" project. The stack consists of a React/Vite/TS frontend with Styled Components, and a Node/Fastify/TS backend with Prisma and PostgreSQL. The entire environment will be containerized using Docker and Docker Compose.

## Technical Context

**Language/Version**: TypeScript 5.x for both frontend and backend, Node.js 20+

**Primary Dependencies**: React (latest), Vite, Styled Components, Fastify, Prisma

**Storage**: PostgreSQL

**Testing**: Jest

**Target Platform**: Web browsers (Mobile Responsive) / Docker Containers

**Project Type**: Fullstack Web Application (Frontend + Backend)

**Performance Goals**: Fast dev server startup (< 2s), optimized production build

**Constraints**: Strict TypeScript (no any), Functional Components only, No inline CSS

**Scale/Scope**: Initial infrastructure setup for the Controle de Gastos application.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **TypeScript Strictness**: Checked (TS configured without any)
- **Functional Components**: Checked (React setup defaults to FC)
- **Props Typing**: Checked (TS interfaces)
- **UI Logic**: Checked (Separation of concerns planned)
- **Separation of Concerns**: Checked (Frontend/Backend folders, types/ui/data separated)
- **Styling**: Checked (Styled Components used, inline CSS banned)
- **Dependencies**: Checked (Only requested/necessary stack included)
- **Responsiveness**: Checked (Styled components will handle media queries)

## Project Structure

### Documentation (this feature)

```text
specs/001-web-infrastructure/
├── plan.md              
├── research.md          
├── data-model.md        
├── quickstart.md        
├── contracts/           
└── tasks.md             
```

### Source Code (repository root)

```text
docker-compose.yml
backend/
├── Dockerfile
├── src/
│   ├── models/       # Prisma schemas & types
│   ├── services/     # Business logic
│   └── api/          # Fastify routes/controllers
├── prisma/
│   └── schema.prisma
├── package.json
└── tsconfig.json

frontend/
├── Dockerfile
├── src/
│   ├── components/   # UI components (Styled Components)
│   ├── pages/        # View layers
│   ├── types/        # TS Types
│   └── services/     # Data fetching logic
├── package.json
├── vite.config.ts
└── tsconfig.json
```

**Structure Decision**: Web application layout was selected with a distinct `frontend` and `backend` directory, along with a root `docker-compose.yml` to orchestrate both environments and the PostgreSQL database.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Styled Components | Avoid inline CSS while keeping styles scoped | Pure CSS/SCSS was rejected to leverage JS-in-CSS scoping as per modern React patterns and user request |
