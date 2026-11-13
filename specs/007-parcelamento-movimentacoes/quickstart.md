# Quickstart Guide: Validação de Movimentações Parceladas

**Feature**: `007-parcelamento-movimentacoes`  
**Date**: 2026-11-12

---

## 1. Pré-requisitos e Ambiente

Certifique-se de que a aplicação está executando com o banco de dados PostgreSQL ativo via Docker:

```powershell
# Na raiz do projeto:
docker compose up -d

# Executar a migration/sync do Prisma no container do backend:
docker compose exec backend npx prisma db push
```

Acesse a aplicação no navegador em `http://localhost:5173`.

---

## 2. Cenários de Validação Ponta a Ponta

### Cenário 1: Cadastro de Compra Parcelada e Verificação do Layout Fluido

1. Acesse o formulário principal em **Nova Movimentação** (`/` ou Home).
2. Observe a linha contendo os campos **Valor (R$)** e **Data**.
3. Marque o checkbox **"Parcelar movimentação"**:
   - **Resultado esperado**: O seletor `<Select>` de parcelas aparece suavemente entre o input de Valor e o input de Data.
   - **Verificação de Layout**: No desktop, os três campos compartilham a linha harmoniosamente (`flex: 1 1 0; min-width: 0`), sem quebras, cortes de rótulo ou estouro de largura. Em telas menores que 580px (mobile), os 3 campos empilham-se verticalmente em largura total (100%).
4. Preencha os dados:
   - **Nome**: `Curso de Especialização`
   - **Valor (R$)**: `100.00`
   - **Parcelas**: `3x`
   - **Data**: `2026-11-12`
   - **Categoria**: Selecione qualquer categoria ativa (ex: Educação)
   - **Tipo**: `Saída (Despesa)`
   - **Método**: `Cartão`
5. Clique em **Salvar Movimentação**.
   - **Resultado esperado**: Mensagem de sucesso exibida.

---

### Cenário 2: Validação da Geração e Distribuição de Centavos

1. Acesse a tela de **Movimentações** na Navbar (`/movimentacoes`).
2. Verifique os três registros recém-criados:
   - Parcela 1: `Curso de Especialização (1/3)` — Valor: `R$ 33,34` — Data: `12/11/2026` (resíduo alocado aqui)
   - Parcela 2: `Curso de Especialização (2/3)` — Valor: `R$ 33,33` — Data: `12/12/2026`
   - Parcela 3: `Curso de Especialização (3/3)` — Valor: `R$ 33,33` — Data: `12/01/2027`
3. A soma exata $33,34 + 33,33 + 33,33 = 100,00$ é rigorosamente preservada.

---

### Cenário 3: Edição Sincronizada e Deslocamento Temporal

1. Na listagem de movimentações, clique no botão de **Editar** na Parcela 2 (`Curso de Especialização (2/3)`).
2. Altere o **Nome** para `Pós-Graduação` e altere a **Data** de `12/12/2026` para `15/12/2026` (+3 dias de acréscimo).
3. Salve a edição.
4. **Resultado esperado**:
   - Parcela 1 (`1/3`): Nome atualizado para `Pós-Graduação (1/3)`, data permanece `12/11/2026` (não afetada).
   - Parcela 2 (`2/3`): Nome atualizado para `Pós-Graduação (2/3)`, data torna-se `15/12/2026`.
   - Parcela 3 (`3/3`): Nome atualizado para `Pós-Graduação (3/3)`, data desloca-se automaticamente em +3 dias para `15/01/2027`.

---

### Cenário 4: Exclusão em Cascata com Confirmação

1. Na listagem, clique no botão de **Excluir** em qualquer uma das 3 parcelas (ex: na Parcela 3).
2. O modal de confirmação se abre informando que se trata de uma movimentação parcelada e que **todas as 3 parcelas vinculadas serão excluídas**.
3. Confirme a exclusão.
4. **Resultado esperado**:
   - Uma única transação atômica remove todas as 3 parcelas.
   - A listagem é atualizada instantaneamente e nenhuma das 3 parcelas permanece no sistema.
