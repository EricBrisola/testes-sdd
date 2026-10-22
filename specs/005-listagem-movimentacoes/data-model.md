# Data Model: Listagem e Gestão de Movimentações

**Feature**: `005-listagem-movimentacoes`  
**Date**: 2026-10-22  
**Status**: Completed  

---

## 1. Entidades de Dados

### 1.1 Modelo `Movimentacao` (Prisma)
Entidade existente mapeada na tabela `movimentacoes` do banco de dados relacional (PostgreSQL):

| Campo | Tipo | Nulo | Descrição |
|---|---|:---:|---|
| `id` | `String` (UUID) | Não | Identificador primário da movimentação |
| `nome` | `String` | Não | Nome descritivo da movimentação (ex: "Almoço", "Salário") |
| `valor` | `Decimal(10, 2)` | Não | Quantia monetária da transação |
| `data` | `DateTime` | Não | Data em que a transação ocorreu (informada pelo usuário) |
| `tipo` | `TipoMovimentacao` | Não | Natureza do fluxo: `ENTRADA` ou `SAIDA` |
| `metodoPagamento` | `MetodoPagamento` | Não | Forma de pagamento: `PIX`, `DINHEIRO` ou `CARTAO` |
| `userId` | `String` (UUID) | Não | Chave estrangeira referenciando o usuário proprietário (`User`) |
| `categoriaId` | `String` (UUID) | Não | Chave estrangeira referenciando a categoria associada (`Categoria`) |
| `createdAt` | `DateTime` | Não | Timestamp de criação no banco (ordenação padrão decrescente) |
| `updatedAt` | `DateTime` | Não | Timestamp da última atualização |

### 1.2 Relacionamento Carregado na Listagem
Na consulta de listagem, cada item de `Movimentacao` carrega a relação `categoria`:
```typescript
interface MovimentacaoComCategoria {
  id: string;
  nome: string;
  valor: number;
  data: string;
  tipo: 'ENTRADA' | 'SAIDA';
  metodoPagamento: 'PIX' | 'DINHEIRO' | 'CARTAO';
  userId: string;
  categoriaId: string;
  categoria: {
    id: string;
    nome: string;
  };
  createdAt: string;
  updatedAt: string;
}
```

---

## 2. DTOs de Entrada e Saída

### 2.1 Consulta e Filtros (`FiltrosMovimentacoesDTO`)
Parâmetros aceitos na query string do endpoint `GET /api/movimentacoes`:

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|:---:|---|
| `categorias` | `string` ou `string[]` | Não | ID ou lista de IDs de categorias (separados por vírgula ou múltiplos params) |
| `tipo` | `'ENTRADA' \| 'SAIDA'` | Não | Filtro por natureza de movimentação |
| `metodoPagamento` | `'PIX' \| 'DINHEIRO' \| 'CARTAO'` | Não | Filtro por forma de movimentação |
| `dataInicial` | `string` (YYYY-MM-DD) | Não | Limite inferior da data da movimentação |
| `dataFinal` | `string` (YYYY-MM-DD) | Não | Limite superior da data da movimentação |
| `page` | `number` | Não | Número da página solicitada (default: 1) |
| `limit` | `number` | Não | Quantidade de registros por página (default: 15) |

### 2.2 Resposta Paginada (`MovimentacoesPaginadasResponse`)
```typescript
interface MovimentacoesPaginadasResponse {
  items: MovimentacaoComCategoria[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}
```

### 2.3 Atualização de Movimentação (`AtualizarMovimentacaoDTO`)
Payload para a requisição `PUT /api/movimentacoes/:id`:

```typescript
interface AtualizarMovimentacaoDTO {
  nome?: string;
  valor?: number;
  data?: string;
  tipo?: 'ENTRADA' | 'SAIDA';
  metodoPagamento?: 'PIX' | 'DINHEIRO' | 'CARTAO';
  categoriaId?: string;
}
```

---

## 3. Regras de Validação e Integridade

1. **Isolamento Multilocatário (Ownership)**:
   - Toda consulta (`findMany`), atualização (`update`) e exclusão (`delete`) filtra obrigatoriamente por `userId` extraído do token JWT autenticado.
   - Tentativa de atualizar ou excluir movimentação de outro usuário resulta em HTTP `404 Not Found` (ou `403 Forbidden`).
2. **Validações de Campo**:
   - `nome`: Texto não vazio (mínimo 1 caractere visível).
   - `valor`: Número estritamente positivo (> 0).
   - `data`: Data válida no formato ISO / YYYY-MM-DD.
   - `categoriaId`: Deve pertencer ao mesmo `userId` autenticado.
3. **Regra de Fallback e Consistência Temporal**:
   - `dataInicial > dataFinal` é rejeitado com aviso antes do envio.
   - Se `dataFinal` informada isoladamente for menor que a data de hoje, o envio é bloqueado com toast de aviso.
