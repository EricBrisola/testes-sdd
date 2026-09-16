# Quickstart & Validation Guide

Follow these steps to validate that the Web Infrastructure is correctly set up.

## Prerequisites
- Docker and Docker Compose installed.
- Node.js 20+ installed locally (for running tasks outside containers if needed).

## Running the Application

1. **Start all services**:
   ```bash
   docker-compose up -d
   ```
   This will start:
   - PostgreSQL Database on port `5432`
   - Fastify Backend API on port `3000`
   - React+Vite Frontend on port `5173`

2. **Verify Frontend**:
   - Open `http://localhost:5173` in your browser.
   - You should see the default React Vite application page.

3. **Verify Backend**:
   - Open `http://localhost:3000/health` (or equivalent initial route).
   - You should receive a JSON response indicating the server is running.

4. **Verify Database**:
   - The backend logs should indicate a successful connection to the PostgreSQL database via Prisma.

5. **Verify Quality Checks (Locally)**:
   - In `frontend/`: run `npm run typecheck` to ensure no TypeScript errors.
   - In `backend/`: run `npm run typecheck`.
