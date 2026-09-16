# Phase 1: Validation Quickstart

This guide verifies the authentication flow.

### Prerequisites
- Docker containers running (`docker-compose up -d`)
- A valid Google OAuth Client ID configured in `.env`.

### Validation Scenario 1: Unauthenticated Access
1. Send a `GET` request to `http://localhost:3000/api/users/me` without cookies.
2. **Expected**: System returns `401 Unauthorized`.

### Validation Scenario 2: Frontend Login Flow
1. Open `http://localhost:5173`.
2. Click the "Connect with Google" button.
3. Select your Google account.
4. **Expected**: 
   - The frontend calls `POST /api/auth/google`.
   - The backend responds with `Set-Cookie`.
   - The UI redirects/updates to show the user is logged in.

### Validation Scenario 3: Secure JWT Cookie
1. Open Browser DevTools -> Application -> Cookies.
2. **Expected**: The `token` cookie exists, but its `HttpOnly` flag is checked.
3. Open Browser DevTools -> Console and run `console.log(localStorage)`.
4. **Expected**: The JWT is NOT present in local storage.
