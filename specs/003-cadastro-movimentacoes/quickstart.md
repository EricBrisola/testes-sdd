# Quickstart Validation: Cadastro de Movimentações

Este guia descreve como validar a funcionalidade de Cadastro de Movimentações ponta a ponta.

## Pré-requisitos
1. Os containers Docker do PostgreSQL e Backend devem estar rodando (`docker compose up -d`).
2. O servidor frontend (Vite) deve estar executando e acessível no navegador.
3. Você deve possuir uma conta logada (Via Google SSO).
4. Uma categoria "Geral" padrão será criada via seed ou diretamente no banco para testes iniciais.

## Testando via Frontend (UI)
1. Acesse `http://localhost:5173`.
2. Após o login, você será direcionado para o formulário principal de **Cadastro de Movimentações**.
3. Preencha os campos com os seguintes valores de teste:
   - **Nome**: Salário
   - **Valor**: 5000.00
   - **Data**: Data atual
   - **Tipo**: Entrada
   - **Método**: Pix
   - **Categoria**: Geral (ou a que estiver disponível)
4. Clique em **Salvar**.
5. Verifique visualmente se a notificação de Sucesso apareceu e se o formulário foi limpo em seguida.

## Testando via Backend (cURL)
Caso deseje testar a rota diretamente, primeiro garanta que você possui um JWT Cookie válido, ou injete o Token via Header Authorization:

```bash
curl -X POST http://localhost:3000/api/movimentacoes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <SEU_TOKEN_AQUI>" \
  -d '{
    "nome": "Gasolina",
    "valor": 200.00,
    "data": "2026-10-08T12:00:00Z",
    "tipo": "SAIDA",
    "metodoPagamento": "CARTAO",
    "categoriaId": "<ID_DA_CATEGORIA>"
  }'
```

**Resultado Esperado:** 
Um JSON contendo os dados salvos e o HTTP Status `201 Created`.
