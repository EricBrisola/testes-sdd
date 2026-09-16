# Phase 0: Research & Decisions

## JWT Storage Strategy
- **Decision**: Store JWTs in `httpOnly` and `secure` cookies.
- **Rationale**: User explicitly requested to NEVER store JWTs in `localStorage`. `httpOnly` cookies prevent XSS attacks from reading the token via JavaScript. The Fastify backend will handle setting and clearing these cookies using `@fastify/cookie`.
- **Alternatives**: `localStorage` (rejected by user request), `sessionStorage` (same vulnerabilities).

## Authentication Flow (Google SSO)
- **Decision**: Use `@react-oauth/google` on the frontend to get the Google OAuth credential, then send it to the backend via a RESTful `POST /api/auth/google` route. The backend verifies the token using `google-auth-library` and issues the JWT cookie.
- **Rationale**: Keeps the flow simple and allows the backend to independently verify the Google identity and manage the local session securely.

## RESTful Routing
- **Decision**: Adhere to RESTful resource naming.
- **Rationale**: User explicitly requested RESTful routes.
  - `POST /api/auth/google` for login.
  - `POST /api/auth/logout` to clear cookie.
  - `GET /api/users/me` to get current session user data.
