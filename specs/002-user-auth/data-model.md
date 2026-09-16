# Phase 1: Data Model

## Prisma Schema Additions

### Model: `User`
Mapped to table `users` in the database as requested by the user.

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  nome      String
  google_id String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}
```

**Constraints & Rules**:
- `email` and `google_id` must be unique to prevent duplicate accounts.
- Table name is explicitly mapped to `users` via `@@map`.
