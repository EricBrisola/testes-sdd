# Quickstart & Validation Guide: Listagem e Gestão de Movimentações

**Feature**: `005-listagem-movimentacoes`  
**Date**: 2026-10-22  
**Status**: Ready for Implementation  

---

## 1. Pré-Requisitos e Configuração do Ambiente

1. **Dependências do Frontend**:
   Certifique-se de que o pacote `react-toastify` está instalado no diretório `frontend`:
   ```bash
   cd frontend
   npm install react-toastify
   ```
2. **Ambiente em Execução**:
   - Backend na porta `3000`: `npm run dev` (em `backend/`)
   - Frontend na porta `5173`: `npm run dev` (em `frontend/`)
   - PostgreSQL ativo via Docker Compose ou local: `docker compose up -d`

---

## 2. Roteiro de Validação Manual Ponta a Ponta

### Cenário 1: Acesso via Navbar e Listagem Inicial
1. Faça login na aplicação pelo Google SSO.
2. Observe a barra de navegação superior (`Navbar`):
   - Deve exibir o link para a nova tela de movimentações / extrato (ex: "Histórico" ou "Extrato").
3. Clique no link correspondente:
   - A URL muda para `/movimentacoes` sem recarregar a aplicação.
   - Em desktop, a exibição é carregada no formato **Lista**.
   - As movimentações cadastradas previamente são exibidas em ordem decrescente de criação (`createdAt`).
   - Na lista, os dados de cada item aparecem na seguinte ordem: **Nome**, **Valor**, **Entrada ou Despesa**, **Tipo (Pix/Cartão/Dinheiro)** e **Categoria**.

### Cenário 2: Alternância entre Formato Cards e Lista
1. Na parte superior da tela de movimentações, clique no botão alternador (ex: ícone ou botão "Cards / Lista").
2. Verifique se o layout transiciona imediatamente para o modo **Cards**:
   - Cada card exibe exclusivamente: **Nome**, **Valor** e **Entrada ou Despesa**, acompanhado dos botões de ação.
3. Alterne de volta para **Lista** e confirme que a integridade visual permanece intacta.

### Cenário 3: Filtragem por Categorias (Checkboxes Múltiplos)
1. No painel lateral ou barra de filtros, localize a seção de categorias.
2. Marque um checkbox de uma categoria (ex: "Alimentação"):
   - Apenas movimentações associadas a "Alimentação" devem ser exibidas.
3. Marque um segundo checkbox (ex: "Lazer"):
   - Movimentações de "Alimentação" E "Lazer" devem ser exibidas simultaneamente.
4. Desmarque todos os checkboxes:
   - A listagem retorna a exibir movimentações de todas as categorias.

### Cenário 4: Filtros de Tipo, Natureza e Validação de Datas com Fallback e Toast
1. Selecione `tipo = PIX` no select e `natureza = Despesa` no select:
   - Apenas despesas pagas via Pix devem ser listadas.
2. Preencha apenas a **Data Inicial** (ex: `2026-10-01`) e deixe a Data Final em branco:
   - O sistema filtra movimentações entre `2026-10-01` e a data de hoje.
3. Limpe os campos de data. Preencha apenas a **Data Final** com uma data no passado (ex: `2026-09-01`):
   - Um alerta toast via `react-toastify` deve surgir na tela indicando que a data final não pode ser anterior à data de hoje caso a inicial fique em branco.
   - A busca inválida não é executada.
4. Clique no botão **"Limpar Filtros"**:
   - Todos os filtros (checkboxes, selects e datas) são redefinidos e o histórico completo é restaurado.

### Cenário 5: Edição de Movimentação via Modal
1. Em qualquer movimentação (seja no modo card ou lista), clique no botão/ícone de **Editar**.
2. Um modal deve se abrir com todos os campos da movimentação preenchidos.
3. Altere o valor ou a categoria e clique em **Cancelar**:
   - O modal fecha e nenhuma alteração é aplicada.
4. Abra o modal novamente, altere o nome e o valor, e clique em **Salvar Alterações**:
   - Uma requisição `PUT /api/movimentacoes/:id` é disparada.
   - O modal fecha, um toast de sucesso é exibido e a linha/card reflete os novos dados imediatamente.

### Cenário 6: Exclusão com Confirmação
1. Clique no botão/ícone de **Excluir** de uma movimentação.
2. Um diálogo de confirmação deve aparecer perguntando se o usuário confirma a exclusão.
3. Ao confirmar:
   - A requisição `DELETE /api/movimentacoes/:id` é enviada com sucesso.
   - A movimentação é removida da tela instantaneamente sem recarregar a página.

---

## 3. Testes Automatizados

- **Backend**: Executar `npm test` em `backend/` para validar testes de rotas e regras do serviço de movimentações (filtros, paginação, ownership de update e delete).
- **Frontend**: Executar `npm test` em `frontend/` para assegurar que os componentes de filtro, cards, lista e modal renderizam e tratam eventos conforme especificado.
