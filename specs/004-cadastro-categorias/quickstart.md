# Quickstart Validation: Cadastro de Categorias e Seleção em Movimentações

Este guia detalha o fluxo completo de validação da feature `004-cadastro-categorias`, cobrindo tanto a interface de usuário (UI) quanto os testes diretos via API (backend).

---

## 1. Pré-requisitos

1. **Docker e Banco de Dados**: Os containers do PostgreSQL e do backend devem estar em execução:
   ```bash
   docker compose up -d
   ```
2. **Dependências do Frontend**: Garantir dependências instaladas (incluindo `react-router-dom`):
   ```bash
   cd frontend && npm install && npm run dev
   ```
3. **Usuário Autenticado**: Estar logado na aplicação (via Google SSO ou sessão com JWT cookie).

---

## 2. Cenários de Validação via Interface de Usuário (UI)

### Cenário 0: Categorias Padrão no Primeiro Acesso (Onboarding)
1. Faça login na aplicação com um novo usuário (ou usuário recém-criado).
2. Na tela principal de Movimentações, observe o campo `<select>` de Categorias.
3. **Resultado Esperado**:
   - As 3 categorias padrão criadas automaticamente já constam disponíveis para seleção imediata em ordem alfabética:
     1. `Alimentação`
     2. `Geral`
     3. `Lazer`
   - O usuário pode lançar sua primeira movimentação imediatamente sem precisar cadastrar categorias antes.

### Cenário 1: Navegação para a Tela de Categorias
1. Acesse `http://localhost:5173`.
2. Após o login, observe o cabeçalho/menu de navegação com link para "Categorias" (`/categorias`).
3. Clique no link.
4. **Resultado Esperado**: A URL muda para `/categorias` e a tela de gestão de categorias é renderizada exibindo o formulário de criação no topo e a tabela com as categorias já existentes (as 3 padrão) logo abaixo.

### Cenário 2: Cadastro de Nova Categoria com Sucesso
1. No campo de texto "Nome da Categoria", digite: `Transporte`.
2. Clique no botão **Criar** (ou pressione Enter).
3. **Resultado Esperado**:
   - Uma notificação visual de sucesso é apresentada ("Categoria criada com sucesso").
   - O campo de texto é limpo automaticamente.
   - A linha `Transporte` surge imediatamente na tabela de categorias abaixo, com os ícones de editar e excluir.

### Cenário 3: Validação de Campo Vazio
1. Deixe o campo "Nome da Categoria" em branco ou digite apenas espaços (`   `).
2. Clique no botão **Criar**.
3. **Resultado Esperado**:
   - O envio é bloqueado.
   - Uma mensagem de validação em vermelho é exibida indicando que o nome não pode ser vazio.
   - Nenhuma requisição é enviada ao backend ou a tabela permanece inalterada.

### Cenário 4: Validação de Nome Duplicado
1. Tente cadastrar uma categoria com o nome `transporte` (mesmo nome já cadastrado, mudando apenas maiúsculas/minúsculas).
2. Clique em **Criar**.
3. **Resultado Esperado**:
   - O sistema exibe um aviso informando que já existe uma categoria com este nome.
   - Nenhuma duplicata é adicionada à tabela.

### Cenário 5: Edição Inline de Categoria
1. Na linha da categoria `Transporte`, localize e clique no ícone de **Editar** (ou clique na linha).
2. O nome `Transporte` se transforma em um campo de texto editável com o texto pré-carregado.
3. Altere o texto para `Transporte Urbano` e pressione a tecla **Enter** (ou clique no botão de salvar).
4. **Resultado Esperado**:
   - A tabela atualiza imediatamente o texto da linha para `Transporte Urbano`.
   - Uma notificação de sucesso confirma a alteração.
5. *(Teste de cancelamento)*: Clique no ícone de editar em qualquer linha, digite um texto qualquer e pressione **Escape** (ou o botão cancelar). O nome original deve ser restaurado sem alteração.

### Cenário 6: Exclusão de Categoria Sem Movimentações
1. Cadastre uma categoria temporária: `Teste Temporário`.
2. Na linha correspondente, clique no ícone de **Excluir**.
3. Confirme a ação se solicitado modal de confirmação.
4. **Resultado Esperado**:
   - A linha é removida imediatamente da tabela.
   - Notificação de sucesso confirma a exclusão.

### Cenário 7: Bloqueio de Exclusão de Categoria com Movimentações
1. Crie uma movimentação vinculada à categoria `Transporte Urbano`.
2. Volte à tela de categorias (`/categorias`).
3. Tente excluir a categoria `Transporte Urbano` clicando no ícone de **Excluir**.
4. **Resultado Esperado**:
   - O backend rejeita com status `409 Conflict`.
   - O frontend exibe uma mensagem amigável: "Não é possível excluir esta categoria pois ela possui movimentações vinculadas".
   - A categoria permanece na tabela.

### Cenário 8: Seleção em Ordem Alfabética na Tela de Movimentações
1. Cadastre três categorias na seguinte sequência: `Viagem`, `Alimentação`, `Saúde`.
2. Navegue até a tela de criação de movimentações (`/` ou `/movimentacoes`).
3. Abra o campo `<select>` de Categorias.
4. **Resultado Esperado**:
   - O select carrega as categorias do usuário em **ordem alfabética**:
     1. Alimentação
     2. Saúde
     3. Transporte Urbano
     4. Viagem
   - Ao selecionar `Alimentação` e preencher os dados da movimentação, o envio persiste a transação vinculada ao id dessa categoria.

---

## 3. Cenários de Validação via Backend (cURL)

Utilize os comandos abaixo substituindo `<TOKEN_JWT>` por um token válido gerado no login.

### 3.1. Listar Categorias
```bash
curl -X GET http://localhost:3000/api/categorias \
  -H "Authorization: Bearer <TOKEN_JWT>"
```
**Status Esperado**: `200 OK` (array JSON ordenado alfabeticamente por `nome`).

### 3.2. Criar Categoria
```bash
curl -X POST http://localhost:3000/api/categorias \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN_JWT>" \
  -d '{"nome": "Educação"}'
```
**Status Esperado**: `201 Created` contendo o objeto com `id`, `nome`, `userId`.

### 3.3. Testar Duplicidade
```bash
curl -X POST http://localhost:3000/api/categorias \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN_JWT>" \
  -d '{"nome": "educação"}'
```
**Status Esperado**: `409 Conflict` com mensagem `"Já existe uma categoria cadastrada com este nome"`.

### 3.4. Atualizar Categoria
```bash
curl -X PUT http://localhost:3000/api/categorias/<CATEGORIA_ID> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN_JWT>" \
  -d '{"nome": "Educação e Cursos"}'
```
**Status Esperado**: `200 OK` com os dados atualizados.

### 3.5. Excluir Categoria
```bash
curl -X DELETE http://localhost:3000/api/categorias/<CATEGORIA_ID> \
  -H "Authorization: Bearer <TOKEN_JWT>"
```
**Status Esperado**: `204 No Content` (ou `409 Conflict` se vinculada a movimentações).

---

## 4. Referências

- [Contratos da API (endpoints e schemas)](./contracts/api.md)
- [Modelo de Dados e DTOs](./data-model.md)
- [Especificação Funcional](./spec.md)
- [Pesquisa Técnica e Decisões de Arquitetura](./research.md)
