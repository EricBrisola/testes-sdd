# Research & Architecture Decisions: Dashboard Detalhado de Movimentações com Gráficos

**Feature**: `006-dashboard-movimentacoes`  
**Date**: 2026-10-30  
**Status**: Completed  

---

## 1. Escolha e Integração da Biblioteca de Gráficos: Recharts

### Contexto
O usuário solicitou explicitamente o uso da biblioteca `recharts` para a renderização dos três gráficos:
1. Gráfico de Rosca (Donut) para o Top 5 Categorias.
2. Gráfico de Barra Única para Métodos de Pagamento (Pix, Dinheiro, Cartão).
3. Gráfico de Barras em Colunas Verticais Empilhadas Proporcionais para os últimos 6 meses móveis.

### Decisão
- **Biblioteca**: `recharts` (versão compatível com React 19, instalada no frontend via container Docker).
- **Componentes do Recharts Utilizados**:
  - `ResponsiveContainer`: Para garantir adaptação fluida à largura de cada seção.
  - `PieChart`, `Pie`, `Cell`, `Tooltip`, `Legend`: Para o gráfico de rosca (Donut), configurando `innerRadius` e `outerRadius`.
  - `BarChart`, `Bar`, `XAxis`, `YAxis`, `CartesianGrid`, `Tooltip`, `Legend`: Para as colunas verticais mensais e para a barra única proporcional.
- **Animações Solicitadas**:
  - **Gráfico de Rosca (Donut)**: Efeito de varredura circular (`isAnimationActive={true}`, `animationBegin={0}`, `animationDuration={1500}`, `animationEasing="ease-out"`).
  - **Gráficos de Barras (Colunas Verticais e Barra Única)**: Efeito de crescimento vertical/horizontal progressivo a partir da base (`isAnimationActive={true}`, `animationDuration={1200}`, `animationEasing="ease-out"`).

### Compatibilidade com React 19 e Docker
- **Instalação**: Executar no container `docker compose exec frontend npm install recharts --save`. Em caso de aviso de peer-dependencies com React 19 em builds npm padrão, utilizar flag de compatibilidade `--legacy-peer-deps`.
- **Renderização**: Envolver os gráficos em `ResponsiveContainer width="100%" height={300}` com containers pai estáticos (`min-height`) para evitar saltos de layout durante a montagem do DOM.

---

## 2. Estratégia de Cálculo das Métricas: 100% no Backend

### Contexto
A especificação e o usuário determinaram que **todos os cálculos de métricas ficam no backend e nada no frontend**. Além disso, a Constituição do projeto proíbe regras de negócio em componentes de interface.

### Decisão
Criar um endpoint dedicado e protegido:
`GET /api/movimentacoes/dashboard` (ou `GET /api/dashboard`)

O endpoint executará consultas otimizadas no PostgreSQL através do Prisma ORM e retornará um JSON consolidado com estrutura pronta para consumo:

```json
{
  "resumoGeral": {
    "totalEntradas": 12500.50,
    "totalSaidas": 4320.00,
    "saldo": 8180.50
  },
  "categorias": {
    "saidas": [
      { "id": "uuid-1", "nome": "Alimentação", "valor": 1500.00, "percentual": 34.72 },
      { "id": "uuid-2", "nome": "Moradia", "valor": 1200.00, "percentual": 27.78 }
    ],
    "entradas": [
      { "id": "uuid-3", "nome": "Salário", "valor": 10000.00, "percentual": 80.00 }
    ]
  },
  "metodosPagamento": {
    "saidas": [
      { "metodo": "PIX", "valor": 2000.00, "percentual": 46.30 },
      { "metodo": "CARTAO", "valor": 1800.00, "percentual": 41.67 },
      { "metodo": "DINHEIRO", "valor": 520.00, "percentual": 12.03 }
    ],
    "entradas": [
      { "metodo": "PIX", "valor": 9000.00, "percentual": 72.00 },
      { "metodo": "DINHEIRO", "valor": 3500.50, "percentual": 28.00 },
      { "metodo": "CARTAO", "valor": 0.00, "percentual": 0.00 }
    ]
  },
  "ultimos6Meses": [
    {
      "ano": 2026,
      "mes": 5,
      "mesNome": "Mai",
      "rotulo": "Mai/26",
      "totalEntradas": 5000.00,
      "totalSaidas": 2000.00,
      "montanteTotal": 7000.00,
      "percentualEntradas": 71.43,
      "percentualSaidas": 28.57
    }
  ],
  "ultimasMovimentacoes": [
    {
      "id": "uuid-mov",
      "nome": "Supermercado",
      "tipo": "SAIDA",
      "metodoPagamento": "CARTAO",
      "valor": 350.20,
      "createdAt": "2026-10-29T14:00:00.000Z"
    }
  ]
}
```

### Raciocínio da Resposta Unificada
Ao retornar as duas visões (`entradas` e `saidas`) no mesmo payload inicial:
- O frontend não precisa fazer refetch ao alternar o filtro único entre "Despesas" e "Entradas".
- A alternância é instantânea (< 16ms), respeitando o critério de sucesso **SC-002** (< 300ms).
- Nenhum cálculo matemático (percentual, soma, divisão) é realizado no frontend. O frontend apenas renderiza os valores já calculados e formatados pelo backend.

---

## 3. Arquitetura de Responsividade (Desktop vs Mobile)

### Contexto
- **Desktop**: 3 linhas de seções:
  1. Card principal (header 100% largura de ponta a ponta).
  2. Gráfico de rosca + Gráfico de barra única de métodos lado a lado, com filtro unificado.
  3. Linha do tempo de 20 movimentações + Gráfico de barras verticais mensais lado a lado.
- **Mobile**: 1 coluna única contínua com 6 blocos sequenciais:
  1. Card principal
  2. Filtro unificado
  3. Gráfico de rosca
  4. Gráfico de barra única de tipos
  5. Linha do tempo
  6. Gráfico de barras mensais verticais

### Decisão
- Utilizar `styled-components` com CSS Grid e Flexbox com media query `(max-width: 900px)` ou `(max-width: 768px)`.
- Arquivo de estilo dedicado `Dashboard.styles.ts` ou pasta de componentes modular.
- Zero CSS inline, em total conformidade com a Constituição.

---

## 4. Autenticação e Segurança

### Contexto
Todas as rotas devem estar devidamente autenticadas.
- **Backend**: Endpoint registrado sob Fastify com hook `fastify.addHook('onRequest', ... jwtVerify)`. O `userId` é extraído do token JWT autenticado para garantir isolamento absoluto de dados entre usuários.
- **Frontend**: O `App.tsx` já intercepta usuários não autenticados redirecionando para `/login`. A nova rota `/dashboard` recebe as props de usuário e logout e exige autenticação ativa.
- **Navbar**: Inclusão do link `Dashboard` navegando para `/dashboard`.

---

## 5. Estados de Carregamento e Vazio (UX)

### Decisão
- Enquanto a requisição `GET /api/movimentacoes/dashboard` estiver em andamento, exibir um skeleton loader elegante com as mesmas proporções dos cards e gráficos.
- Quando a resposta chegar, os gráficos do Recharts montam com suas animações ativas de crescimento e varredura.
- Caso o usuário não tenha nenhuma movimentação (`totalEntradas === 0 && totalSaidas === 0`), exibir componentes amigáveis de Empty State com ilustrações ou mensagens explicativas sem quebrar os gráficos.

