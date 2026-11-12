# Contract: Dashboard Metrics API

**Feature**: `006-dashboard-movimentacoes`  
**Endpoint**: `GET /api/movimentacoes/dashboard`  
**Auth**: Bearer JWT (via Cookie `token` ou Header `Authorization: Bearer <token>`)  

---

## 1. Descrição do Endpoint

Retorna todas as métricas agregadas e consolidadas para renderização do Dashboard de Movimentações:
- Resumo financeiro global (Entradas, Saídas e Saldo).
- Top 5 categorias com maior volume de gastos e receitas.
- Distribuição proporcional de pagamentos (Pix, Dinheiro, Cartão) para Entradas e Saídas.
- Montante dos últimos 6 meses móveis com divisão percentual entre entradas (verde) e saídas (vermelho).
- Lista com as 20 movimentações mais recentemente inseridas no banco de dados.

---

## 2. Requisição

### Headers
```http
GET /api/movimentacoes/dashboard HTTP/1.1
Host: localhost:3000
Cookie: token=eyJhbGciOi...
```

*(Nenhum parâmetro de query ou body é obrigatório).*

---

## 3. Respostas

### 200 OK (Sucesso)
Retorna os dados consolidados.

```json
{
  "resumoGeral": {
    "totalEntradas": 15450.00,
    "totalSaidas": 8320.50,
    "saldo": 7129.50
  },
  "categorias": {
    "saidas": [
      {
        "id": "c1a2b3c4-0001-4000-8000-000000000001",
        "nome": "Moradia",
        "valor": 3200.00,
        "percentual": 38.46
      },
      {
        "id": "c1a2b3c4-0002-4000-8000-000000000002",
        "nome": "Alimentação",
        "valor": 2100.50,
        "percentual": 25.24
      },
      {
        "id": "c1a2b3c4-0003-4000-8000-000000000003",
        "nome": "Transporte",
        "valor": 1200.00,
        "percentual": 14.42
      },
      {
        "id": "c1a2b3c4-0004-4000-8000-000000000004",
        "nome": "Lazer",
        "valor": 980.00,
        "percentual": 11.78
      },
      {
        "id": "c1a2b3c4-0005-4000-8000-000000000005",
        "nome": "Saúde",
        "valor": 840.00,
        "percentual": 10.10
      }
    ],
    "entradas": [
      {
        "id": "c1a2b3c4-0006-4000-8000-000000000006",
        "nome": "Salário",
        "valor": 12000.00,
        "percentual": 77.67
      },
      {
        "id": "c1a2b3c4-0007-4000-8000-000000000007",
        "nome": "Freelance",
        "valor": 3450.00,
        "percentual": 22.33
      }
    ]
  },
  "metodosPagamento": {
    "saidas": [
      {
        "metodo": "PIX",
        "rotulo": "Pix",
        "valor": 4500.00,
        "percentual": 54.08
      },
      {
        "metodo": "CARTAO",
        "rotulo": "Cartão",
        "valor": 2900.50,
        "percentual": 34.86
      },
      {
        "metodo": "DINHEIRO",
        "rotulo": "Dinheiro",
        "valor": 920.00,
        "percentual": 11.06
      }
    ],
    "entradas": [
      {
        "metodo": "PIX",
        "rotulo": "Pix",
        "valor": 14000.00,
        "percentual": 90.61
      },
      {
        "metodo": "DINHEIRO",
        "rotulo": "Dinheiro",
        "valor": 1450.00,
        "percentual": 9.39
      },
      {
        "metodo": "CARTAO",
        "rotulo": "Cartão",
        "valor": 0.00,
        "percentual": 0.00
      }
    ]
  },
  "ultimos6Meses": [
    {
      "ano": 2026,
      "mes": 5,
      "mesNome": "Mai",
      "rotulo": "Mai/26",
      "totalEntradas": 7000.00,
      "totalSaidas": 3500.00,
      "montanteTotal": 10500.00,
      "percentualEntradas": 66.67,
      "percentualSaidas": 33.33
    },
    {
      "ano": 2026,
      "mes": 6,
      "mesNome": "Jun",
      "rotulo": "Jun/26",
      "totalEntradas": 7500.00,
      "totalSaidas": 4000.00,
      "montanteTotal": 11500.00,
      "percentualEntradas": 65.22,
      "percentualSaidas": 34.78
    },
    {
      "ano": 2026,
      "mes": 7,
      "mesNome": "Jul",
      "rotulo": "Jul/26",
      "totalEntradas": 8000.00,
      "totalSaidas": 4200.00,
      "montanteTotal": 12200.00,
      "percentualEntradas": 65.57,
      "percentualSaidas": 34.43
    },
    {
      "ano": 2026,
      "mes": 8,
      "mesNome": "Ago",
      "rotulo": "Ago/26",
      "totalEntradas": 8000.00,
      "totalSaidas": 5100.00,
      "montanteTotal": 13100.00,
      "percentualEntradas": 61.07,
      "percentualSaidas": 38.93
    },
    {
      "ano": 2026,
      "mes": 9,
      "mesNome": "Set",
      "rotulo": "Set/26",
      "totalEntradas": 9000.00,
      "totalSaidas": 4800.00,
      "montanteTotal": 13800.00,
      "percentualEntradas": 65.22,
      "percentualSaidas": 34.78
    },
    {
      "ano": 2026,
      "mes": 10,
      "mesNome": "Out",
      "rotulo": "Out/26",
      "totalEntradas": 9500.00,
      "totalSaidas": 5200.00,
      "montanteTotal": 14700.00,
      "percentualEntradas": 64.63,
      "percentualSaidas": 35.37
    }
  ],
  "ultimasMovimentacoes": [
    {
      "id": "mov-001",
      "nome": "Supermercado Extra",
      "tipo": "SAIDA",
      "metodoPagamento": "CARTAO",
      "metodoRotulo": "Cartão",
      "valor": 384.50,
      "createdAt": "2026-10-29T16:45:00.000Z"
    },
    {
      "id": "mov-002",
      "nome": "Projeto Consultoria",
      "tipo": "ENTRADA",
      "metodoPagamento": "PIX",
      "metodoRotulo": "Pix",
      "valor": 1200.00,
      "createdAt": "2026-10-29T11:20:00.000Z"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "message": "Não autorizado"
}
```

