# Data Model: Cadastro de Categorias e Seleção em Movimentações

**Feature**: `004-cadastro-categorias`
**Date**: 2026-10-15
**Branch**: `004-cadastro-categorias`

---

## Situação Atual do Schema

O schema Prisma atual (`backend/prisma/schema.prisma`) já contém os modelos necessários. **Nenhuma migração de schema é necessária para esta feature.**

```prisma
model Categoria {
  id            String         @id @default(uuid())
  nome          String
  userId        String
  user          User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  movimentacoes Movimentacao[]
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt

  @@map("categorias")
}

model Movimentacao {
  id              String           @id @default(uuid())
  nome            String
  valor           Decimal          @db.Decimal(10, 2)
  data            DateTime
  tipo            TipoMovimentacao
  metodoPagamento MetodoPagamento
  userId          String
  user            User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  categoriaId     String
  categoria       Categoria        @relation(fields: [categoriaId], references: [id], onDelete: Restrict)
  createdAt       DateTime         @default(now())
  updatedAt       DateTime         @updatedAt

  @@map("movimentacoes")
}
```

---

## Entidades e Operações

### Categoria

| Campo       | Tipo      | Obrigatório | Regras de Negócio |
|-------------|-----------|-------------|-------------------|
| `id`        | `String` (UUID) | Gerado automaticamente | Identificador único, imutável |
| `nome`      | `String`  | Sim | Não pode ser vazio ou apenas espaços; normalizado com `trim()` antes de persistir; case-insensitive para verificação de duplicidade |
| `userId`    | `String` (FK) | Sim | Vinculado ao `id` do usuário autenticado extraído do JWT; nunca aceito do body da requisição |
| `createdAt` | `DateTime` | Gerado automaticamente | Timestamp de criação |
| `updatedAt` | `DateTime` | Atualizado automaticamente | Timestamp de última atualização |

### Regras de Integridade

- **Criação**: `nome` (após `trim()`) não pode ser vazio. Verificar se já existe categoria com mesmo nome (insensitive) para o mesmo `userId` antes de criar.
- **Categorias Padrão (Onboarding)**: Ao criar um novo `User` via OAuth (`auth.service.ts`), o sistema insere automaticamente 3 categorias padrão vinculadas ao seu `userId`: `"Alimentação"`, `"Lazer"` e `"Geral"`.
- **Atualização**: Verificar ownership (`userId`) antes de atualizar. Aplicar mesmas regras de validação do nome. Verificar duplicidade de nome considerando a exclusão da própria categoria editada.
- **Exclusão**: Verificar ownership (`userId`) antes de excluir. A constraint `onDelete: Restrict` em `Movimentacao` impede exclusão de categorias em uso — o serviço capturará o erro `P2003` do Prisma e retornará `409`.
- **Listagem**: Filtrar por `userId` do usuário autenticado. Ordenar por `nome ASC`.

---

## DTOs (Data Transfer Objects)

### `CriarCategoriaDTO`

```typescript
interface CriarCategoriaDTO {
  nome: string;
  userId: string; // extraído do JWT, nunca do body
}
```

### `AtualizarCategoriaDTO`

```typescript
interface AtualizarCategoriaDTO {
  id: string;       // extraído dos params da rota
  nome: string;     // novo nome
  userId: string;   // extraído do JWT
}
```

### `ExcluirCategoriaDTO`

```typescript
interface ExcluirCategoriaDTO {
  id: string;       // extraído dos params da rota
  userId: string;   // extraído do JWT
}
```

### `CategoriaResponse` (payload retornado ao cliente)

```typescript
interface CategoriaResponse {
  id: string;
  nome: string;
  userId: string;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
```

---

## Frontend: Tipos TypeScript

```typescript
// frontend/src/types/categoria.ts

export interface Categoria {
  id: string;
  nome: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CriarCategoriaPayload {
  nome: string;
}

export interface AtualizarCategoriaPayload {
  nome: string;
}
```

---

## Impacto na Tela de Movimentações

O componente `MovimentacaoForm` passará a buscar categorias via `GET /api/categorias` e usará o array retornado para popular o `<Select>` de categorias, substituindo o atual `MOCK_CATEGORIA_ID`.

O estado interno do formulário será atualizado para incluir `categoriaId`:

```typescript
interface FormData {
  nome: string;
  valor: string;
  data: string;
  tipo: string;
  metodoPagamento: string;
  categoriaId: string; // novo campo
}
```

---

## Diagrama de Relacionamentos (relevante para esta feature)

```
User
 │
 ├──(1:N)──► Categoria
 │               │
 │               └──(1:N)──► Movimentacao
 │
 └──(1:N)──► Movimentacao
```

- **User → Categoria**: Um usuário tem muitas categorias. `onDelete: Cascade` — ao excluir o usuário, suas categorias são excluídas.
- **Categoria → Movimentacao**: Uma categoria pode ter muitas movimentações. `onDelete: Restrict` — não é possível excluir uma categoria com movimentações associadas.
- **User → Movimentacao**: Um usuário tem muitas movimentações. `onDelete: Cascade` — ao excluir o usuário, suas movimentações são excluídas.
