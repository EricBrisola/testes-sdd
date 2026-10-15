# API Contracts: Gestão de Categorias

Todas as rotas abaixo exigem autenticação obrigatória via JWT (Cookie HTTPOnly ou Header `Authorization: Bearer <token>`). O `userId` do proprietário é sempre obtido a partir da sessão/token validado no hook `onRequest`, nunca aceito diretamente no corpo da requisição.

---

## 1. Listar Categorias

Retorna todas as categorias pertencentes ao usuário autenticado, ordenadas em ordem alfabética crescente (`nome ASC`).

- **Endpoint**: `GET /api/categorias`
- **Auth**: Requerida (JWT)

### Responses

#### 200 OK
```json
[
  {
    "id": "e4b2d130-1845-427f-a18a-679904791599",
    "nome": "Alimentação",
    "userId": "usr_99812903",
    "createdAt": "2026-10-15T12:00:00.000Z",
    "updatedAt": "2026-10-15T12:00:00.000Z"
  },
  {
    "id": "f5c3e241-2956-538a-b29b-780015802600",
    "nome": "Moradia",
    "userId": "usr_99812903",
    "createdAt": "2026-10-15T12:05:00.000Z",
    "updatedAt": "2026-10-15T12:05:00.000Z"
  },
  {
    "id": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
    "nome": "Transporte",
    "userId": "usr_99812903",
    "createdAt": "2026-10-15T12:10:00.000Z",
    "updatedAt": "2026-10-15T12:10:00.000Z"
  }
]
```

#### 401 Unauthorized
```json
{
  "message": "Não autorizado"
}
```

---

## 2. Criar Categoria

Cria uma nova categoria associada ao usuário autenticado.

- **Endpoint**: `POST /api/categorias`
- **Auth**: Requerida (JWT)

### Request Body
```json
{
  "nome": "Lazer"
}
```

### Validações
1. O campo `nome` é obrigatório.
2. O campo `nome` não pode ser vazio ou conter apenas espaços em branco (é normalizado com `.trim()`).
3. O usuário autenticado não pode possuir outra categoria com o mesmo nome (comparação case-insensitive).

### Responses

#### 201 Created
```json
{
  "id": "b3c4d5e6-f7a8-9b0c-1d2e-3f4a5b6c7d8e",
  "nome": "Lazer",
  "userId": "usr_99812903",
  "createdAt": "2026-10-15T14:30:00.000Z",
  "updatedAt": "2026-10-15T14:30:00.000Z"
}
```

#### 400 Bad Request
```json
{
  "message": "O nome da categoria é obrigatório e não pode ser vazio"
}
```

#### 409 Conflict
```json
{
  "message": "Já existe uma categoria cadastrada com este nome"
}
```

#### 401 Unauthorized
```json
{
  "message": "Não autorizado"
}
```

---

## 3. Atualizar Categoria

Atualiza o nome de uma categoria existente pertencente ao usuário autenticado.

- **Endpoint**: `PUT /api/categorias/:id`
- **Auth**: Requerida (JWT)

### Path Parameters
- `id` (string, UUID): Identificador único da categoria a ser atualizada.

### Request Body
```json
{
  "nome": "Educação e Cursos"
}
```

### Validações
1. O parâmetro `:id` deve ser informado.
2. O campo `nome` não pode ser vazio ou conter apenas espaços em branco (`.trim()`).
3. A categoria deve existir e pertencer ao `userId` do usuário autenticado.
4. O novo nome não pode colidir com outra categoria já existente do mesmo usuário (exceto a própria categoria que está sendo atualizada).

### Responses

#### 200 OK
```json
{
  "id": "e4b2d130-1845-427f-a18a-679904791599",
  "nome": "Educação e Cursos",
  "userId": "usr_99812903",
  "createdAt": "2026-10-15T12:00:00.000Z",
  "updatedAt": "2026-10-15T15:00:00.000Z"
}
```

#### 400 Bad Request
```json
{
  "message": "O nome da categoria é obrigatório e não pode ser vazio"
}
```

#### 404 Not Found
```json
{
  "message": "Categoria não encontrada"
}
```
*(Também retornado caso a categoria pertença a outro usuário, preservando o sigilo de dados)*

#### 409 Conflict
```json
{
  "message": "Já existe uma categoria cadastrada com este nome"
}
```

#### 401 Unauthorized
```json
{
  "message": "Não autorizado"
}
```

---

## 4. Excluir Categoria

Exclui uma categoria pertencente ao usuário autenticado. A exclusão é bloqueada caso a categoria possua movimentações financeiras vinculadas (respeitando a integridade referencial `onDelete: Restrict`).

- **Endpoint**: `DELETE /api/categorias/:id`
- **Auth**: Requerida (JWT)

### Path Parameters
- `id` (string, UUID): Identificador único da categoria a ser excluída.

### Responses

#### 204 No Content
*(Sem corpo na resposta)*

#### 404 Not Found
```json
{
  "message": "Categoria não encontrada"
}
```
*(Também retornado caso a categoria pertença a outro usuário)*

#### 409 Conflict
```json
{
  "message": "Não é possível excluir esta categoria pois ela possui movimentações vinculadas"
}
```

#### 401 Unauthorized
```json
{
  "message": "Não autorizado"
}
```
