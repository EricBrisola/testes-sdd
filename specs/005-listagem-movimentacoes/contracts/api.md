# API Contracts: Endpoints de Movimentações

**Feature**: `005-listagem-movimentacoes`  
**Base Path**: `/api/movimentacoes`  
**Security**: Todas as rotas exigem token JWT válido (`onRequest: jwtVerify`).

---

## 1. Listar Movimentações com Filtros e Paginação

- **Método**: `GET`
- **Caminho**: `/api/movimentacoes`
- **Descrição**: Retorna a lista de movimentações pertencentes ao usuário autenticado, com filtros opcionais combináveis e paginação progressiva.

### Query Parameters

| Parâmetro | Tipo | Obrigatório | Padrão | Descrição |
|---|---|:---:|:---:|---|
| `categorias` | `string` | Não | - | IDs de categorias separados por vírgula (ex: `uuid1,uuid2`) |
| `tipo` | `string` | Não | - | `ENTRADA` ou `SAIDA` |
| `metodoPagamento` | `string` | Não | - | `PIX`, `DINHEIRO` ou `CARTAO` |
| `dataInicial` | `string` | Não | - | Data ISO/YYYY-MM-DD (ex: `2026-10-01`) |
| `dataFinal` | `string` | Não | - | Data ISO/YYYY-MM-DD (ex: `2026-10-31`) |
| `page` | `integer` | Não | `1` | Página atual |
| `limit` | `integer` | Não | `15` | Quantidade de itens por página |

### Resposta de Sucesso (`200 OK`)

```json
{
  "items": [
    {
      "id": "c1f7b9e0-827a-4b95-a4b5-123456789abc",
      "nome": "Supermercado Semanal",
      "valor": 245.50,
      "data": "2026-10-22T00:00:00.000Z",
      "tipo": "SAIDA",
      "metodoPagamento": "CARTAO",
      "userId": "d72b2260-84a1-4235-968b-5688a2da0418",
      "categoriaId": "e3a8907b-1a92-4822-8356-9d33261cf2a4",
      "categoria": {
        "id": "e3a8907b-1a92-4822-8356-9d33261cf2a4",
        "nome": "Alimentação"
      },
      "createdAt": "2026-10-22T14:30:00.000Z",
      "updatedAt": "2026-10-22T14:30:00.000Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 15,
  "totalPages": 1,
  "hasMore": false
}
```

### Respostas de Erro

- `401 Unauthorized`:
  ```json
  { "message": "Não autorizado" }
  ```
- `500 Internal Server Error`:
  ```json
  { "message": "Erro ao listar movimentações" }
  ```

---

## 2. Atualizar Movimentação

- **Método**: `PUT`
- **Caminho**: `/api/movimentacoes/:id`
- **Descrição**: Atualiza os dados de uma movimentação pertencente exclusivamente ao usuário logado.

### Parâmetros de Rota

- `id`: UUID da movimentação a ser editada.

### Corpo da Requisição (`application/json`)

```json
{
  "nome": "Supermercado Mensal",
  "valor": 320.00,
  "data": "2026-10-22",
  "tipo": "SAIDA",
  "metodoPagamento": "PIX",
  "categoriaId": "e3a8907b-1a92-4822-8356-9d33261cf2a4"
}
```

### Resposta de Sucesso (`200 OK`)

```json
{
  "id": "c1f7b9e0-827a-4b95-a4b5-123456789abc",
  "nome": "Supermercado Mensal",
  "valor": 320.00,
  "data": "2026-10-22T00:00:00.000Z",
  "tipo": "SAIDA",
  "metodoPagamento": "PIX",
  "userId": "d72b2260-84a1-4235-968b-5688a2da0418",
  "categoriaId": "e3a8907b-1a92-4822-8356-9d33261cf2a4",
  "createdAt": "2026-10-22T14:30:00.000Z",
  "updatedAt": "2026-10-22T15:00:00.000Z"
}
```

### Respostas de Erro

- `400 Bad Request`:
  ```json
  { "message": "O valor deve ser maior que zero" }
  ```
- `401 Unauthorized`:
  ```json
  { "message": "Não autorizado" }
  ```
- `404 Not Found`:
  ```json
  { "message": "Movimentação não encontrada" }
  ```

---

## 3. Excluir Movimentação

- **Método**: `DELETE`
- **Caminho**: `/api/movimentacoes/:id`
- **Descrição**: Remove a movimentação especificada caso ela pertença ao usuário logado.

### Parâmetros de Rota

- `id`: UUID da movimentação.

### Resposta de Sucesso (`204 No Content`)

Corpo vazio.

### Respostas de Erro

- `401 Unauthorized`:
  ```json
  { "message": "Não autorizado" }
  ```
- `404 Not Found`:
  ```json
  { "message": "Movimentação não encontrada" }
  ```
