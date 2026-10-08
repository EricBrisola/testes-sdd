# API Contracts: Cadastro de Movimentações

Todas as rotas abaixo requerem Autenticação prévia (via JWT Cookies), conforme determinado pela Especificação.

## Criar Movimentação

**Endpoint**: `POST /api/movimentacoes`
**Auth**: Bearer (Cookie HTTPOnly)

### Request Body

```json
{
  "nome": "Compra no Supermercado",
  "valor": 150.75,
  "data": "2026-10-08T10:00:00Z",
  "tipo": "SAIDA", // ENTRADA ou SAIDA
  "metodoPagamento": "CARTAO", // PIX, DINHEIRO ou CARTAO
  "categoriaId": "uuid-da-categoria"
}
```

### Responses

**201 Created**
```json
{
  "id": "uuid-da-nova-movimentacao",
  "nome": "Compra no Supermercado",
  "valor": 150.75,
  "data": "2026-10-08T10:00:00Z",
  "tipo": "SAIDA",
  "metodoPagamento": "CARTAO",
  "categoriaId": "uuid-da-categoria",
  "userId": "uuid-do-usuario-logado"
}
```

**400 Bad Request**
```json
{
  "message": "Validation Error",
  "errors": ["Valor deve ser maior que zero", "Categoria é obrigatória"]
}
```

**401 Unauthorized**
```json
{
  "message": "Unauthorized"
}
```
