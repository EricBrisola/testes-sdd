# Data Model: Movimentações Parceladas

**Feature**: `007-parcelamento-movimentacoes`  
**Date**: 2026-11-12  
**Status**: Ready

---

## 1. Entidades de Dados (Prisma Schema)

### Extensão do Modelo `Movimentacao`

```prisma
model Movimentacao {
  id              String           @id @default(uuid())
  nome            String
  valor           Decimal          @db.Decimal(10, 2)
  data            DateTime
  tipo            TipoMovimentacao
  metodoPagamento MetodoPagamento
  
  // Vínculo com Usuário e Categoria
  userId          String
  user            User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  categoriaId     String
  categoria       Categoria        @relation(fields: [categoriaId], references: [id], onDelete: Restrict)
  
  // Novos campos para suporte a Parcelamento
  isParcela      Boolean          @default(false)
  parcelamentoId String?          // Identificador único do grupo de parcelas (UUID)
  numeroParcela  Int?             // Número ordinal da parcela (1, 2, ..., N)
  totalParcelas  Int?             // Quantidade total de parcelas (2 a 24)

  createdAt       DateTime         @default(now())
  updatedAt       DateTime         @updatedAt

  @@index([userId])
  @@index([categoriaId])
  @@index([parcelamentoId])
  @@index([userId, parcelamentoId])
  @@map("movimentacoes")
}
```

---

## 2. Tipos e DTOs (Data Transfer Objects)

### 2.1 Backend (`backend/src/services/movimentacoes.service.ts`)

#### Criação de Movimentação (`CriarMovimentacaoDTO`)
```typescript
export interface CriarMovimentacaoDTO {
  nome: string;
  valor: number;
  data: string | Date;
  tipo: TipoMovimentacao;
  metodoPagamento: MetodoPagamento;
  categoriaId: string;
  userId: string;
  
  // Suporte a parcelamento opcional
  isParcela?: boolean;
  totalParcelas?: number; // Obrigatório se isParcela === true (2 a 24)
}
```

#### Atualização de Movimentação (`AtualizarMovimentacaoDTO`)
```typescript
export interface AtualizarMovimentacaoDTO {
  id: string;
  userId: string;
  nome?: string;
  valor?: number;
  data?: string | Date;
  tipo?: TipoMovimentacao;
  metodoPagamento?: MetodoPagamento;
  categoriaId?: string;
}
```

*Nota*: Se a movimentação sendo atualizada possuir `isParcela === true` e `parcelamentoId`, a atualização ocorrerá em cascata sincronizada em todas as parcelas do grupo através de `prisma.$transaction`.

#### Exclusão de Movimentação (`ExcluirMovimentacaoDTO`)
```typescript
export interface ExcluirMovimentacaoDTO {
  id: string;
  userId: string;
}
```

*Nota*: Se `isParcela === true` e houver `parcelamentoId`, a exclusão deleta todas as movimentações onde `parcelamentoId === target.parcelamentoId` e `userId === data.userId` em `prisma.$transaction`.

---

### 2.2 Frontend (`frontend/src/types/movimentacao.ts`)

```typescript
export type TipoMovimentacao = 'ENTRADA' | 'SAIDA';
export type MetodoPagamento = 'PIX' | 'DINHEIRO' | 'CARTAO';

export interface Movimentacao {
  id: string;
  nome: string;
  valor: number;
  data: string;
  tipo: TipoMovimentacao;
  metodoPagamento: MetodoPagamento;
  userId: string;
  categoriaId: string;
  isParcela: boolean;
  parcelamentoId?: string | null;
  numeroParcela?: number | null;
  totalParcelas?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface MovimentacaoComCategoria extends Movimentacao {
  categoria: {
    id: string;
    nome: string;
  };
}

export interface CriarMovimentacaoInput {
  nome: string;
  valor: number;
  data: string;
  tipo: TipoMovimentacao;
  metodoPagamento: MetodoPagamento;
  categoriaId: string;
  isParcela?: boolean;
  totalParcelas?: number;
}
```

---

## 3. Regras de Validação e Integridade de Dados

1. **Validação de Intervalo de Parcelas**:
   - `totalParcelas` deve ser um número inteiro estritamente entre `2` e `24`.
   - Se `isParcela === false` ou omitido, `totalParcelas`, `parcelamentoId` e `numeroParcela` devem permanecer nulos.
2. **Validação de Valor Mínimo**:
   - `valor` total deve ser maior que zero.
   - O valor de cada parcela gerada deve ser $\ge 0.01$.
3. **Imutabilidade do Agrupamento**:
   - Uma movimentação criada como não-parcelada não pode ser transformada em parcelada via edição.
   - A quantidade `totalParcelas` de um parcelamento criado não pode ser alterada na edição.
4. **Isolamento de Tenant (Multilocatário)**:
   - Qualquer operação de busca, atualização ou exclusão por `parcelamentoId` DEVE obrigatoriamente incluir `userId`, impedindo acesso ou mutação indevida entre usuários.
5. **Consistência Decimal**:
   - Todos os valores são armazenados no PostgreSQL como `Decimal(10, 2)` garantindo ausência de erros de ponto flutuante binário.

