# Data Model: Dashboard Detalhado de Movimentações com Gráficos

**Feature**: `006-dashboard-movimentacoes`  
**Date**: 2026-10-30  
**Status**: Ready  

---

## 1. Entidades de Domínio e Banco de Dados (Prisma PostgreSQL)

Os modelos de banco de dados utilizados são os já existentes no schema:

### `User`
- `id` (String UUID, PK): Identificador do usuário.
- `nome` (String): Nome do usuário.
- `email` (String): E-mail do usuário.

### `Categoria`
- `id` (String UUID, PK): Identificador da categoria.
- `nome` (String): Nome descritivo da categoria.
- `userId` (String UUID, FK): Usuário proprietário.

### `Movimentacao`
- `id` (String UUID, PK): Identificador da movimentação.
- `nome` (String): Descrição da movimentação.
- `valor` (Decimal 10,2): Quantia monetária da transação.
- `data` (DateTime): Data e hora da ocorrência financeira informada pelo usuário.
- `tipo` (Enum `TipoMovimentacao`: `ENTRADA` | `SAIDA`).
- `metodoPagamento` (Enum `MetodoPagamento`: `PIX` | `DINHEIRO` | `CARTAO`).
- `userId` (String UUID, FK): Chave do usuário proprietário.
- `categoriaId` (String UUID, FK): Categoria vinculada.
- `createdAt` (DateTime): Timestamp de criação do registro no banco (utilizado para ordenar as 20 últimas movimentações).

---

## 2. Tipos de Transferência de Dados (DTOs) do Dashboard

### 2.1 Resumo Geral (`ResumoFinanceiroGeralDTO`)
Representa o cálculo consolidado de todo o histórico do usuário.
```typescript
interface ResumoFinanceiroGeralDTO {
  totalEntradas: number; // Soma de todas as movimentações tipo ENTRADA
  totalSaidas: number;   // Soma de todas as movimentações tipo SAIDA
  saldo: number;         // totalEntradas - totalSaidas
}
```

### 2.2 Agrupamento por Categoria (`CategoriaMetricaDTO`)
Representa cada uma das Top 5 categorias calculadas pelo backend.
```typescript
interface CategoriaMetricaDTO {
  id: string;            // ID da categoria
  nome: string;          // Nome da categoria
  valor: number;         // Montante total somado em R$
  percentual: number;    // % sobre o total da respectiva natureza (0.00 a 100.00)
}

interface CategoriasDashboardDTO {
  saidas: CategoriaMetricaDTO[];   // Top 5 categorias com maior soma de despesas
  entradas: CategoriaMetricaDTO[]; // Top 5 categorias com maior soma de receitas
}
```

### 2.3 Agrupamento por Método de Pagamento (`MetodoPagamentoMetricaDTO`)
Representa a divisão proporcional por método de pagamento.
```typescript
interface MetodoPagamentoMetricaDTO {
  metodo: 'PIX' | 'DINHEIRO' | 'CARTAO';
  rotulo: string;        // "Pix", "Dinheiro", "Cartão"
  valor: number;         // Montante somado em R$
  percentual: number;    // % sobre o total (0.00 a 100.00)
}

interface MetodosPagamentoDashboardDTO {
  saidas: MetodoPagamentoMetricaDTO[];
  entradas: MetodoPagamentoMetricaDTO[];
}
```

### 2.4 Agrupamento Mensal Proporcional (`MesMetricaDTO`)
Representa cada mês dos últimos 6 meses móveis com suas proporções.
```typescript
interface MesMetricaDTO {
  ano: number;             // Ex: 2026
  mes: number;             // 1 a 12
  mesNome: string;         // Ex: "Out"
  rotulo: string;          // Ex: "Out/26"
  totalEntradas: number;   // Valor em R$ de receitas no mês
  totalSaidas: number;     // Valor em R$ de despesas no mês
  montanteTotal: number;   // totalEntradas + totalSaidas
  percentualEntradas: number; // (totalEntradas / montanteTotal) * 100 (ou 0 se montante 0)
  percentualSaidas: number;   // (totalSaidas / montanteTotal) * 100 (ou 0 se montante 0)
}
```

### 2.5 Item da Linha do Tempo (`UltimaMovimentacaoDTO`)
Item simplificado para exibição rápida e informativa na lista.
```typescript
interface UltimaMovimentacaoDTO {
  id: string;
  nome: string;
  tipo: 'ENTRADA' | 'SAIDA';
  metodoPagamento: 'PIX' | 'DINHEIRO' | 'CARTAO';
  metodoRotulo: string;   // Ex: "Pix", "Cartão", "Dinheiro"
  valor: number;
  createdAt: string;      // ISO String
}
```

### 2.6 Payload Consolidado Completo (`DashboardDataDTO`)
```typescript
interface DashboardDataDTO {
  resumoGeral: ResumoFinanceiroGeralDTO;
  categorias: CategoriasDashboardDTO;
  metodosPagamento: MetodosPagamentoDashboardDTO;
  ultimos6Meses: MesMetricaDTO[];
  ultimasMovimentacoes: UltimaMovimentacaoDTO[];
}
```

---

## 3. Regras de Validação e Consistência

1. **Isolamento por Usuário (`userId`)**: Todas as queries de agregação do Prisma utilizam obrigatoriamente a cláusula `where: { userId }`.
2. **Prevenção de Divisão por Zero**: Se o total for `0`, os percentuais retornados serão rigorosamente `0.00`.
3. **Limite do Top 5**: A consulta de categorias agrupa por `categoriaId`, soma os valores em ordem decrescente (`ORDER BY SUM(valor) DESC`) e limita a 5 resultados (`take: 5`).
4. **Precisão Numérica**: Valores decimais do Prisma (`Decimal`) são convertidos para ponto flutuante com arredondamento em 2 casas decimais (`Number(val.toFixed(2))`).

