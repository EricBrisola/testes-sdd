# Quickstart Guide: Validação do Dashboard de Movimentações

**Feature**: `006-dashboard-movimentacoes`  
**Date**: 2026-10-30  
**Branch**: `006-dashboard-movimentacoes`  

---

## 1. Pré-Requisitos e Ambiente

Certifique-se de que o ambiente Docker do projeto esteja ativo:

```bash
docker compose up -d
```

Instale a dependência de gráficos no container do frontend:
```bash
docker compose exec frontend npm install recharts --save
```

---

## 2. Cenários de Teste Ponta a Ponta

### Cenário 1: Autenticação e Navegação
1. Acesse `http://localhost:5173` no navegador.
2. Efetue login com sua conta Google ou conta de teste.
3. Observe a barra de navegação (Navbar) no topo:
   - Deve existir um novo link denominado **"Dashboard"**.
4. Clique no link "Dashboard":
   - A URL deve navegar para `http://localhost:5173/dashboard`.
   - Se o usuário não estiver autenticado, a rota deve redirecionar imediatamente para a tela de login.

---

### Cenário 2: Animações e Card Principal (Header de Ponta a Ponta)
1. Ao carregar a página `/dashboard`, observe o estado de carregamento suave (*skeleton loader* ou indicador visual).
2. Assim que os dados chegam da API:
   - O card principal é exibido de ponta a ponta no topo com três montantes: **Total de Entradas**, **Total de Saídas** e **Saldo**.
   - Os gráficos disparam simultaneamente suas animações de abertura:
     - O gráfico de rosca (Donut) realiza um efeito de **varredura circular** ao redor do raio.
     - Os gráficos de barras realizam um efeito de **crescimento progressivo** a partir da linha de base.

---

### Cenário 3: Interação com o Filtro Único (Rosca + Barra Única)
1. Na seção intermediária, observe o gráfico de rosca (Top 5 categorias) e o gráfico de barra única de métodos de pagamento posicionados lado a lado no desktop.
2. O filtro único inicia por padrão em **"Despesas"**:
   - A rosca exibe as categorias de maior gasto em R$.
   - A barra única exibe as proporções de Pix, Dinheiro e Cartão para despesas.
3. Alterne o filtro único para **"Entradas"**:
   - Ambos os gráficos são atualizados instantaneamente sem recarregar a tela ou fazer nova requisição de rede desnecessária.
   - O gráfico de rosca exibe as categorias de receitas e a barra única exibe os métodos de entrada.

---

### Cenário 4: Linha do Tempo e Gráfico Mensal em Colunas Verticais
1. Na seção inferior, confira a lista de linha do tempo e o gráfico de barras verticais lado a lado:
   - **Linha do Tempo**: exibe até 20 itens ordenados pelas movimentações cadastradas mais recentemente no banco, com apenas Nome, Tipo (Pix/Dinheiro/Cartão) e Valor em R$. A lista é puramente informativa (sem cliques/ações).
   - **Gráfico Mensal**: colunas verticais com os últimos 6 meses móveis. Cada coluna possui altura correspondente ao montante total do mês, empilhada com verde (porcentagem de entradas) e vermelho (porcentagem de saídas).
   - Ao passar o mouse nas colunas, o *Tooltip* detalha os valores em R$ e as porcentagens exatas.

---

### Cenário 5: Responsividade Mobile (6 Blocos em Coluna Única)
1. Abra as Ferramentas de Desenvolvedor (F12) e ative a emulação de dispositivos móveis (ex: iPhone, Pixel ou largura < 768px).
2. Verifique o layout da tela:
   - O layout deve colapsar em uma única coluna vertical com exatamente 6 blocos sequenciais:
     1. Card de Resumo Geral
     2. Filtro Único de Natureza (Despesas / Entradas)
     3. Gráfico de Rosca de Categorias
     4. Gráfico de Barra Única de Métodos de Pagamento
     5. Linha do Tempo das Últimas Movimentações
     6. Gráfico de Barras Mensais Verticais
   - Nenhuma barra de rolagem horizontal deve ser gerada.

