# Data Model: Cadastro de Movimentações

A modelagem de dados utilizará o Prisma ORM e PostgreSQL, baseada nas decisões da fase de pesquisa.

## Enums

```prisma
enum TipoMovimentacao {
  ENTRADA
  SAIDA
}

enum MetodoPagamento {
  PIX
  DINHEIRO
  CARTAO
}
```

## Entidades (Prisma Schema)

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

**Nota sobre as Relações:**
A entidade `User` precisará ser atualizada para incluir a relação inversa (`movimentacoes Movimentacao[]` e `categorias Categoria[]`). A `Categoria` também será vinculada a um usuário, impedindo que os usuários vejam categorias de outros.
