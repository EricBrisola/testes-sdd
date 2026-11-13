# API Contracts: Movimentações Parceladas

**Feature**: `007-parcelamento-movimentacoes`  
**Base URL**: `/api/movimentacoes`  
**Auth**: Bearer JWT (`onRequest: fastify.jwtVerify`)

---

## 1. Cadastro de Movimentação (Única ou Parcelada)

### `POST /api/movimentacoes`

Cria uma movimentação tradicional ou uma série de 2 a 24 parcelas geradas em lote dentro de uma transação atômica.

#### Request Body

```json
{
  "nome": "Compra Notebook",
  "valor": 3000.0,
  "data": "2026-11-12T00:00:00.000Z",
  "tipo": "SAIDA",
  "metodoPagamento": "CARTAO",
  "categoriaId": "b18b4e15-8854-47be-b27a-8fef2d005ea2",
  "isParcela": true,
  "totalParcelas": 3
}
```

#### Regras de Validação do Payload:

- `nome`: obrigatório, string não vazia.
- `valor`: obrigatório, número positivo (> 0).
- `data`: obrigatória, ISO 8601 string válida.
- `tipo`: obrigatório, `"ENTRADA"` ou `"SAIDA"`.
- `metodoPagamento`: obrigatório, `"PIX"`, `"DINHEIRO"` ou `"CARTAO"`.
- `categoriaId`: obrigatório, UUID de categoria existente e pertencente ao usuário.
- `isParcela`: opcional, booleano. Se `true`, `totalParcelas` torna-se obrigatório.
- `totalParcelas`: opcional, número inteiro entre `2` e `24`.

#### Response (201 Created) - Quando Parcelada

```json
{
  "message": "Parcelamento criado com sucesso",
  "parcelamentoId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "totalParcelas": 3,
  "items": [
    {
      "id": "e4b3c990-1c52-4752-9426-302a0df39a01",
      "nome": "Compra Notebook (1/3)",
      "valor": 1000.0,
      "data": "2026-11-12T00:00:00.000Z",
      "tipo": "SAIDA",
      "metodoPagamento": "CARTAO",
      "categoriaId": "b18b4e15-8854-47be-b27a-8fef2d005ea2",
      "userId": "user-uuid",
      "isParcela": true,
      "parcelamentoId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "numeroParcela": 1,
      "totalParcelas": 3,
      "categoria": {
        "id": "b18b4e15-8854-47be-b27a-8fef2d005ea2",
        "nome": "Tecnologia"
      }
    },
    {
      "id": "e4b3c990-1c52-4752-9426-302a0df39a02",
      "nome": "Compra Notebook (2/3)",
      "valor": 1000.0,
      "data": "2026-12-12T00:00:00.000Z",
      "tipo": "SAIDA",
      "metodoPagamento": "CARTAO",
      "categoriaId": "b18b4e15-8854-47be-b27a-8fef2d005ea2",
      "userId": "user-uuid",
      "isParcela": true,
      "parcelamentoId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "numeroParcela": 2,
      "totalParcelas": 3,
      "categoria": {
        "id": "b18b4e15-8854-47be-b27a-8fef2d005ea2",
        "nome": "Tecnologia"
      }
    },
    {
      "id": "e4b3c990-1c52-4752-9426-302a0df39a03",
      "nome": "Compra Notebook (3/3)",
      "valor": 1000.0,
      "data": "2027-01-12T00:00:00.000Z",
      "tipo": "SAIDA",
      "metodoPagamento": "CARTAO",
      "categoriaId": "b18b4e15-8854-47be-b27a-8fef2d005ea2",
      "userId": "user-uuid",
      "isParcela": true,
      "parcelamentoId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "numeroParcela": 3,
      "totalParcelas": 3,
      "categoria": {
        "id": "b18b4e15-8854-47be-b27a-8fef2d005ea2",
        "nome": "Tecnologia"
      }
    }
  ]
}
```

---

## 2. Edição Sincronizada de Movimentação

### `PUT /api/movimentacoes/:id`

Atualiza os dados de uma movimentação. Caso a movimentação seja parte de um parcelamento (`isParcela === true`), sincroniza os dados compartilhados com todas as parcelas do mesmo `parcelamentoId` e desloca as datas posteriores sob uma transação atômica.

#### Request Body

```json
{
  "nome": "Macbook Pro",
  "valor": 1200.0,
  "data": "2026-11-15T00:00:00.000Z",
  "tipo": "SAIDA",
  "metodoPagamento": "CARTAO",
  "categoriaId": "b18b4e15-8854-47be-b27a-8fef2d005ea2"
}
```

#### Response (200 OK)

```json
{
  "id": "e4b3c990-1c52-4752-9426-302a0df39a01",
  "nome": "Macbook Pro (1/3)",
  "valor": 1200.0,
  "data": "2026-11-15T00:00:00.000Z",
  "tipo": "SAIDA",
  "metodoPagamento": "CARTAO",
  "categoriaId": "b18b4e15-8854-47be-b27a-8fef2d005ea2",
  "isParcela": true,
  "parcelamentoId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "numeroParcela": 1,
  "totalParcelas": 3,
  "categoria": {
    "id": "b18b4e15-8854-47be-b27a-8fef2d005ea2",
    "nome": "Tecnologia"
  }
}
```

---

## 3. Exclusão em Cascata de Movimentação

### `DELETE /api/movimentacoes/:id`

Exclui a movimentação especificada. Se ela pertencer a um parcelamento, exclui todas as parcelas irmãs vinculadas em uma única transação atômica.

#### Response (200 OK)

```json
{
  "success": true,
  "message": "Movimentação excluída com sucesso",
  "isParcela": true,
  "totalExcluidas": 3
}
```

---

## 4. Listagem de Movimentações

### `GET /api/movimentacoes`

Retorna a lista paginada de movimentações já com as propriedades `isParcela`, `parcelamentoId`, `numeroParcela` e `totalParcelas` em cada item.
