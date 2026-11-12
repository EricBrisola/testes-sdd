# Feature Specification: Dashboard Detalhado de Movimentações com Gráficos

**Feature Branch**: `006-dashboard-movimentacoes`

**Created**: 2026-10-29

**Status**: Draft

**Input**: User description: "implementar uma tela que tenha informações mais detalhadas sobre as movimentações, com gráficos. um card principal mostrando um resumo geral, com somatorio total de todas entradas e saidas, alem do saldo, que seria a diferença entre entradas e saidas. uma seção com gráfico de rosca das categorias, mostrando quais são as 5 categorias mais usadas, outra seção com um gráfico de barras mostrando o montante das movimentações por mes em que em uma barra só em que ela fica com cor vermelha de despesas e verde de entradas, ou seja, os valores de entrada e saidas sao somados e a poorcentagem deles vai fazer com que a barra seja pintada de verde e vermelho com base em suas porcentagems do montante total. Uma linha do tempo em forma de lista com as ultimas movimentações inseridas no banco, mostrando nome, tipo e valor apenas Por fim um gráfico com uma unica barra que contem os tipos ed movimentação (pix, dinheiro e cartão), essa barra tbm terá um filtro para escolher entre entradas e saidas. O card principal com os montantes será o header da tela, ocupando de ponta a ponta. O gráfico de rosca das categorias e o de apenas uma barra, lado a lado (na tela do pc) , com um filtro unico de entradas ou saida que servirá para os dois. por fim, a linha do tempo e o grafico de barras ficarao um ao lado do outro. essa tela será dividida em linha nessas 3 seções que te passei, card principal, seção dos graficos de rosca e barra unica e por fim a linha to tempo com os ultimos 20 movimentações junto com o grafico de barras dos montantes dos meses. quero que coloque um filtro no grafico de rosca e barra unica, um filtro unico, filtro esse que pode alternar entre despesas e entradas. Importante mecionar que o gráfico de barras é em colunas verticais e não horizontais Caso seja aberto no celular, a tela terá um comportamento de uma unica coluna com 6 linhas no total, uma p cada grafico e um para as ultimas movimentações, ou seja, uma tela responsiva"

## Clarifications

### Session 2026-10-29

- Q: Qual intervalo de tempo deve ser exibido no gráfico de barras verticais por mês? → A: Últimos 6 meses móveis (incluindo o mês atual).
- Q: Qual critério deve determinar as "5 categorias mais usadas" exibidas no gráfico de rosca? → A: Maior valor financeiro acumulado (soma em R$ das movimentações da categoria).
- Q: Os itens da linha do tempo de últimas movimentações devem ser estritamente informativos ou devem permitir interação ao clicar (como abrir detalhes ou editar)? → A: Estritamente informativo (apenas texto legível com Nome, Tipo e Valor, sem ação ao clicar).
- Q: Qual campo de data deve determinar a ordem das 20 "últimas movimentações inseridas no banco" na linha do tempo? → A: Data/hora de inserção do registro no banco (createdAt decrescente).
- Q: Os montantes de entradas, saídas e saldo do card principal (header) devem considerar todo o histórico financeiro da conta ou apenas o período dos últimos 6 meses? → A: Todo o histórico financeiro da conta (acumulado global do usuário).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visualização do Card Principal de Resumo Financeiro (Priority: P1)

Como um usuário autenticado, quero visualizar no topo da tela um card consolidado de ponta a ponta com o total de entradas, o total de saídas e o saldo resultante, para que eu compreenda instantaneamente o estado geral da minha saúde financeira.

**Why this priority**: É a métrica mais crítica e de valor imediato para qualquer gestão financeira pessoal. Fornece o panorama macro antes do aprofundamento nos detalhes.

**Independent Test**: Pode ser testado acessando a tela com movimentações pré-cadastradas e conferindo se os valores exibidos no card principal correspondem exatamente à soma de todas as receitas, soma de todas as despesas e ao saldo final (entradas menos saídas).

**Acceptance Scenarios**:

1. **Given** que o usuário possui movimentações cadastradas, **When** ele acessa a tela de detalhes, **Then** o cabeçalho principal deve ocupar 100% da largura útil da tela e exibir: o valor total somado de todas as entradas, o valor total somado de todas as saídas e o saldo (diferença: total de entradas subtraído do total de saídas).
2. **Given** que o saldo é positivo ou zero, **When** o card principal for renderizado, **Then** o valor do saldo deve ser exibido com destaque visual indicando superávit (ex: tom esverdeado neutro).
3. **Given** que o saldo é negativo, **When** o card principal for renderizado, **Then** o valor do saldo deve ser exibido com destaque visual indicando déficit (ex: tom avermelhado).
4. **Given** que o usuário não possui movimentações cadastradas, **When** o card principal for exibido, **Then** os montantes de entradas, saídas e saldo devem exibir o valor zerado (R$ 0,00).

---

### User Story 2 - Gráficos de Categorias e Formas de Pagamento com Filtro Unificado (Priority: P1)

Como um usuário autenticado, quero analisar visualmente a distribuição de gastos ou receitas através de um gráfico de rosca das 5 principais categorias e de uma barra segmentada com os tipos de movimentação (Pix, Dinheiro, Cartão), controlados por um filtro único de natureza (Entradas ou Saídas), para identificar rapidamente para onde vai meu dinheiro ou de onde vêm minhas receitas.

**Why this priority**: Permite entender a composição qualitativa das finanças (quais categorias pesam mais e quais meios de pagamento são mais utilizados) com controles simples e integrados.

**Independent Test**: Pode ser testado alternando o filtro único entre "Despesas" e "Entradas" e validando se o gráfico de rosca atualiza suas fatias para exibir as 5 categorias de maior volume daquela natureza e se a barra única atualiza simultaneamente as proporções de Pix, Dinheiro e Cartão.

**Acceptance Scenarios**:

1. **Given** a seção intermediária da tela em visualização de computador (desktop), **When** a página é renderizada, **Then** o gráfico de rosca e o gráfico de barra única devem ser posicionados lado a lado, compartilhando um filtro único de natureza (Entradas vs Despesas).
2. **Given** que o filtro único está definido como "Despesas" (padrão inicial), **When** os gráficos são carregados, **Then** o gráfico de rosca exibe as 5 categorias de despesas com maior soma financeira (e suas porcentagens), e a barra única exibe as proporções de despesas realizadas por Pix, Dinheiro e Cartão.
3. **Given** que o usuário altera o filtro único para "Entradas", **When** a seleção é confirmada, **Then** ambos os gráficos devem ser atualizados instantaneamente para refletir exclusivamente as movimentações de entrada (as 5 categorias com maior volume de entrada e a divisão de tipos Pix, Dinheiro e Cartão para receitas).
4. **Given** que o usuário possui menos de 5 categorias cadastradas com movimentações na natureza selecionada, **When** o gráfico de rosca for exibido, **Then** todas as categorias existentes devem ser apresentadas sem erros de quebra de layout.

---

### User Story 3 - Linha do Tempo das Últimas Movimentações (Priority: P2)

Como um usuário autenticado, quero visualizar uma linha do tempo vertical em formato de lista contendo as 20 movimentações mais recentes inseridas, exibindo apenas o nome, o tipo e o valor, para auditar minhas transações recentes de maneira ágil e concisa.

**Why this priority**: Complementa as visões gráficas agregadas com uma perspectiva transacional cronológica recente e direta.

**Independent Test**: Pode ser testado cadastrando novas movimentações e verificando se a lista reflete até 20 itens ordenados cronologicamente da mais recente para a mais antiga, apresentando exclusivamente nome, tipo de movimentação e valor financeiro.

**Acceptance Scenarios**:

1. **Given** que existem movimentações registradas no sistema, **When** a seção de linha do tempo é exibida, **Then** devem ser apresentadas até no máximo as 20 últimas movimentações inseridas, ordenadas de forma decrescente pela inserção/data mais recente.
2. **Given** um item qualquer na linha do tempo, **When** ele for renderizado, **Then** deve conter estritamente as três informações solicitadas: Nome da movimentação, Tipo (Pix, Dinheiro ou Cartão) e Valor formatado monetariamente.
3. **Given** que existem mais de 20 movimentações no sistema, **When** a lista é exibida, **Then** apenas as 20 mais recentes devem figurar na linha do tempo.
4. **Given** que não há movimentações cadastradas, **When** a linha do tempo for acessada, **Then** deve apresentar uma mensagem amigável de lista vazia.

---

### User Story 4 - Gráfico Mensal de Montantes com Proporção de Entradas e Despesas em Colunas Verticais (Priority: P2)

Como um usuário autenticado, quero visualizar um gráfico de barras com colunas verticais representando o montante financeiro total de cada mês, onde cada barra única exibe visualmente a proporção entre entradas (verde) e despesas (vermelho), para que eu compreenda a evolução do volume financeiro e o equilíbrio mensal entre receitas e gastos.

**Why this priority**: Apresenta a evolução histórica e o comportamento temporal das finanças, permitindo identificar tendências de economia ou estouro orçamentário mês a mês.

**Independent Test**: Pode ser testado gerando movimentações em meses distintos e verificando se cada mês possui uma coluna vertical cuja altura total reflete a soma (entradas + despesas) e cujo preenchimento interno é dividido em verde (para entradas) e vermelho (para despesas) segundo suas respectivas porcentagens.

**Acceptance Scenarios**:

1. **Given** a seção inferior em ambiente desktop, **When** a tela for renderizada, **Then** o gráfico de barras verticais e a linha do tempo de últimas movimentações devem ser posicionados lado a lado.
2. **Given** o gráfico de barras por mês, **When** ele for desenhado, **Then** as barras devem ser organizadas em colunas verticais (eixo vertical para valores e eixo horizontal para os meses), e nunca em barras horizontais.
3. **Given** os dados de um determinado mês com entradas e saídas, **When** a barra desse mês for exibida, **Then** a barra deve consistir em uma única coluna vertical empilhada proporcionalmente, com o segmento de entradas na cor verde e o segmento de despesas na cor vermelha, correspondendo às respectivas porcentagens sobre o montante total daquele mês.
4. **Given** um mês que contenha apenas entradas (zero despesas), **When** sua coluna for renderizada, **Then** a coluna deve estar 100% preenchida na cor verde.
5. **Given** um mês que contenha apenas despesas (zero entradas), **When** sua coluna for renderizada, **Then** a coluna deve estar 100% preenchida na cor vermelha.
6. **Given** um mês sem nenhuma movimentação, **When** o período for consultado, **Then** a coluna deve exibir altura nula/zerada sem desconfigurar o gráfico.

---

### User Story 5 - Responsividade e Adaptação para Telas Móveis (Priority: P1)

Como um usuário utilizando um dispositivo móvel (smartphone), quero que toda a tela se adapte para uma única coluna contínua organizada em 6 blocos/linhas, para que eu visualize todas as métricas e gráficos confortavelmente sem rolagem lateral ou quebra de componentes.

**Why this priority**: A conformidade com a Constituição do projeto exige que todos os componentes sejam 100% responsivos e funcionem em dispositivos móveis.

**Independent Test**: Pode ser testado redimensionando a janela para dimensões de celular (ou abrindo em dispositivo móvel) e confirmando que a tela é composta por uma única coluna sequencial com 6 blocos empilhados verticalmente.

**Acceptance Scenarios**:

1. **Given** a visualização em tela ampla (Desktop/PC), **When** a tela é exibida, **Then** a disposição deve conter 3 seções em linhas:
   - Seção 1: Card principal (header de ponta a ponta).
   - Seção 2: Gráfico de rosca e Gráfico de barra única de tipos lado a lado, com o filtro único de natureza integrado.
   - Seção 3: Linha do tempo e Gráfico de barras mensais lado a lado.
2. **Given** a visualização em tela móvel (Mobile/Smartphone), **When** a tela é exibida, **Then** o layout deve colapsar em uma coluna única com 6 linhas/blocos empilhados na ordem:
   - Linha 1: Card principal com resumo financeiro (entradas, saídas e saldo).
   - Linha 2: Filtro único de natureza (alternância entre despesas e entradas).
   - Linha 3: Gráfico de rosca das 5 categorias mais usadas.
   - Linha 4: Gráfico de barra única de tipos de movimentação (Pix, Dinheiro, Cartão).
   - Linha 5: Linha do tempo com as últimas 20 movimentações.
   - Linha 6: Gráfico de barras mensais verticais proporcionais (verde e vermelho).
3. **Given** qualquer resolução de tela (mobile, tablet ou desktop), **When** a página for navegada, **Then** nenhum elemento deve provocar barra de rolagem horizontal indesejada na tela.

---

### Edge Cases

- **Sem dados cadastrados**: Se o usuário for novo e não possuir nenhuma movimentação, todos os gráficos e cards devem exibir estados neutros e vazios explicativos (ex: "Nenhuma movimentação registrada no período") sem causar erros de cálculo, divisão por zero ou quebras visuais.
- **Categorias insuficientes**: Se houver menos de 5 categorias cadastradas na natureza filtrada (ex: apenas 2 categorias de receitas cadastradas), o gráfico de rosca deve renderizar apenas essas 2 categorias proporcionais sem falhar.
- **Tipos de movimentação zerados**: Se o usuário só realizou pagamentos via Pix (0% Cartão e 0% Dinheiro), a barra única deve exibir 100% para Pix e 0% nos demais, sem falhas de arredondamento.
- **Mês com apenas uma natureza de movimentação**: Caso um mês tenha apenas despesas (R$ 500) e zero receitas, a barra mensal deve ser 100% vermelha; caso tenha apenas receitas (R$ 1000) e zero despesas, 100% verde.
- **Divisão por zero em porcentagens mensais**: Em meses sem nenhuma transação, o montante é R$ 0,00, devendo a coluna permanecer na linha de base com 0% em ambos os segmentos.
- **Valores monetários discrepantes**: Tratamento de legendas e dicas flutuantes (tooltips) para exibição legível de valores de magnitude díspar (ex: R$ 0,50 versus R$ 1.000.000,00).

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE fornecer uma tela dedicada para visualização de relatórios, gráficos e detalhamento de movimentações financeiras, acessível pela navegação da aplicação.
- **FR-002**: O sistema DEVE exibir no topo da tela um card de cabeçalho ocupando toda a largura disponível (100% da largura útil), contendo o somatório geral acumulado de todas as entradas, o somatório geral de todas as saídas e o saldo final (Entradas - Saídas) considerando todo o histórico financeiro da conta do usuário.
- **FR-003**: O sistema DEVE formatar todos os valores monetários apresentados segundo o padrão brasileiro (Real - R$ e separadores decimais adequados).
- **FR-004**: O sistema DEVE fornecer uma seção intermediária contendo dois gráficos analíticos: um gráfico de rosca de categorias e um gráfico de barra única com a divisão por tipos de movimentação (Pix, Dinheiro e Cartão).
- **FR-005**: O sistema DEVE disponibilizar um controle de filtro único para a seção intermediária que permita ao usuário alternar a análise entre "Despesas" e "Entradas", aplicando a seleção simultaneamente ao gráfico de rosca e ao gráfico de barra única.
- **FR-006**: O gráfico de rosca DEVE calcular e exibir as 5 categorias com maior montante financeiro para a natureza selecionada no filtro único, apresentando seus respectivos valores e percentuais de participação.
- **FR-007**: O gráfico de tipos de movimentação DEVE ser composto por uma barra única horizontal ou vertical segmentada proporcionalmente entre Pix, Dinheiro e Cartão com base no total financeiro da natureza selecionada.
- **FR-008**: O sistema DEVE apresentar uma linha do tempo em formato de lista contendo as 20 movimentações mais recentemente cadastradas no sistema, ordenadas decrescentemente pela data e hora de inserção no banco de dados (`createdAt`).
- **FR-009**: Cada item da linha do tempo DEVE ser estritamente informativo (sem ação ao clicar) e exibir exclusivamente: Nome da movimentação, Tipo (Pix, Dinheiro ou Cartão) e Valor monetário.
- **FR-010**: O sistema DEVE exibir um gráfico de barras com colunas verticais demonstrando o montante total de movimentações por mês para a janela dos últimos 6 meses móveis (incluindo o mês atual).
- **FR-011**: Em cada mês do gráfico de barras, a coluna DEVE ser única e empilhada proporcionalmente, pintada com a cor verde para o percentual correspondente às entradas e a cor vermelha para o percentual correspondente às saídas sobre o total mensal.
- **FR-012**: Em telas de computadores (desktop), o layout DEVE ser organizado em 3 seções horizontais: (1) Card de resumo geral no topo, (2) Gráfico de rosca e Gráfico de barra única lado a lado, e (3) Linha do tempo e Gráfico de barras mensais verticais lado a lado.
- **FR-013**: Em dispositivos móveis (telas estreitas/celular), o layout DEVE se reorganizar automaticamente em uma única coluna vertical contendo 6 blocos sequenciais: (1) Card principal, (2) Filtro único, (3) Gráfico de rosca, (4) Gráfico de barra única de tipos, (5) Linha do tempo de movimentações, e (6) Gráfico de barras mensais.
- **FR-014**: O sistema DEVE exibir estados visuais vazios explicativos e amigáveis quando o usuário não possuir movimentações suficientes para gerar os gráficos ou resumos.
- **FR-015**: A interface DEVE fornecer dicas contextuais (tooltips) ou legendas informativas ao passar o cursor ou tocar nos elementos gráficos, detalhando os valores absolutos e percentuais.

---

### Key Entities *(include if feature involves data)*

- **ResumoFinanceiroGeral**: Representa os totais agregados de todas as movimentações do usuário (`totalEntradas`, `totalSaidas`, `saldo`).
- **DistribuicaoCategoria**: Representa a agregação de valores por categoria para o gráfico de rosca (`categoriaId`, `categoriaNome`, `montanteTotal`, `percentual`, `corRepresentativa`).
- **DistribuicaoTipoMovimentacao**: Representa a proporção financeira por método de transação (`tipo`: PIX, DINHEIRO ou CARTAO, `montanteTotal`, `percentual`).
- **MontanteMensalProporcional**: Representa a consolidação mensal com divisão percentual (`mesAno`, `totalEntradas`, `totalSaidas`, `montanteTotal`, `percentualEntradas`, `percentualSaidas`).
- **ItemLinhaDoTempo**: Representa os dados essenciais da movimentação para exibição rápida (`id`, `nome`, `tipo`, `valor`, `dataCriacao`).

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: O usuário visualiza o panorama consolidado (entradas, saídas e saldo) e todos os gráficos em menos de 2 segundos após acessar a tela.
- **SC-002**: A alternância do filtro único entre Despesas e Entradas atualiza simultaneamente o gráfico de rosca e a barra de tipos em menos de 300 milissegundos sem recarregar a página.
- **SC-003**: 100% das 20 últimas movimentações exibidas na linha do tempo contêm rigorosamente os 3 campos obrigatórios (nome, tipo e valor), sem truncamentos ou omissões indevidas.
- **SC-004**: O gráfico de barras mensais reflete com 100% de precisão matemática a soma e as porcentagens correspondentes a entradas (verde) e saídas (vermelho) de cada mês apresentado.
- **SC-005**: A interface alcança 100% de conformidade visual tanto em telas desktop (disposição em 3 seções horizontais) quanto em telas móveis (disposição linear em 6 blocos empilhados), sem apresentar barra de rolagem horizontal em nenhuma resolução comum (320px até 2560px).

---

## Assumptions

- **Padrão do Filtro Unificado**: Por padrão, ao entrar na tela pela primeira vez, o filtro único dos gráficos de rosca e tipos de movimentação iniciará selecionado em "Despesas", permitindo ao usuário alternar para "Entradas" com um único clique.
- **Critério das 5 Categorias Mais Usadas**: Considera-se o montante financeiro total acumulado de cada categoria para eleger o Top 5 no período, sendo esta a métrica mais relevante em planejamento financeiro.
- **Janela Temporal do Gráfico Mensal**: O gráfico de barras mensais verticais apresentará os últimos 6 meses móveis consolidados (incluindo o mês atual).
- **Ordenação da Linha do Tempo**: A linha do tempo exibirá as últimas 20 movimentações inseridas pelo usuário, utilizando como critério de ordenação a data/hora de criação do registro no banco (`createdAt` decrescente), sendo os itens estritamente informativos.
- **Abrangência do Resumo Geral**: O card principal consolidado no cabeçalho calcula o total de entradas, saídas e saldo considerando todo o histórico financeiro da conta do usuário (sem restrição de datas).
- **Autenticação e Escopo de Dados**: Todos os dados consolidados e movimentações exibidos pertencem estritamente ao usuário atualmente autenticado na sessão.
