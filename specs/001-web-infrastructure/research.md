# Phase 0: Outline & Research

## Decision 1: Frontend Framework & Build Tool
- **Decision**: React + Vite + TypeScript
- **Rationale**: User explicitly requested the latest React version with Vite. Vite provides extremely fast HMR which meets the < 2s startup requirement.
- **Alternatives considered**: Next.js (rejected as Vite was explicitly requested).

## Decision 2: Frontend Styling
- **Decision**: Styled Components
- **Rationale**: User explicitly requested Styled Components. It inherently prevents inline CSS violations (banned by constitution) while maintaining component-scoped styling.
- **Alternatives considered**: Tailwind CSS (used in previous prompt but overridden by the latest prompt).

## Decision 3: Backend Framework
- **Decision**: Node.js + Fastify + TypeScript
- **Rationale**: User requested Fastify. It is highly performant and integrates well with TypeScript.
- **Alternatives considered**: Express.js (rejected due to Fastify requirement).

## Decision 4: Database & ORM
- **Decision**: PostgreSQL + Prisma ORM
- **Rationale**: User requested PostgreSQL and Prisma. Prisma provides excellent Type Safety which aligns with the strict TypeScript constitution rules.
- **Alternatives considered**: TypeORM / Sequelize (rejected as Prisma was requested).

## Decision 5: Infrastructure orchestration
- **Decision**: Docker + Docker Compose
- **Rationale**: User requested containerization for frontend, backend, and database. Docker Compose will manage the multi-container setup locally.
- **Alternatives considered**: Local native installations (rejected due to explicit Docker requirement).
