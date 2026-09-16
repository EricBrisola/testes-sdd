# Phase 1: API Contracts

The authentication and user APIs follow RESTful conventions. Since authentication relies on `httpOnly` cookies, the frontend does not need to attach `Authorization` headers manually. The browser handles cookie transmission automatically.

## Endpoints

### 1. Authenticate with Google
- **Method**: `POST`
- **Path**: `/api/auth/google`
- **Body**:
  ```json
  {
    "token": "string (Google ID Token)"
  }
  ```
- **Response** (200 OK):
  - *Headers*: `Set-Cookie: token=JWT_STRING; HttpOnly; Secure; Path=/; SameSite=Strict`
  - *Body*:
    ```json
    {
      "message": "Authenticated successfully",
      "user": {
        "id": "uuid",
        "email": "user@gmail.com",
        "nome": "User Name"
      }
    }
    ```

### 2. Get Current User Profile
- **Method**: `GET`
- **Path**: `/api/users/me`
- **Headers**: Automatically sends the `token` cookie.
- **Response** (200 OK):
  ```json
  {
    "id": "uuid",
    "email": "user@gmail.com",
    "nome": "User Name"
  }
  ```
- **Error** (401 Unauthorized): If cookie is missing or invalid.

### 3. Logout
- **Method**: `POST`
- **Path**: `/api/auth/logout`
- **Response** (200 OK):
  - *Headers*: `Set-Cookie: token=; HttpOnly; Max-Age=0; Path=/`
