# Feature Specification: Listagem e Visualização de Movimentações

**Feature Branch**: `005-listagem-movimentacoes`

**Created**: 2026-10-22

**Status**: Draft

**Input**: User description: "tela com todas movimentações: as movimentações que foram criadas no form principal precisam ser vistas em uma tela nova, ela precisa movimentações, essa tela terá filtros para ver as movimentações pelo tipo(pix, cartao etc), data, se é despesa ou entrada e pela categoria. Todos filtros precisam poder ser acionados tanto separadamente quanto em conjunto, por exemplo, escolher apenas uma categoria, ou uma categoria, uma data, tipo, movimentação de despesa etc. A data pode ser dado data inicial e data final ou apenas uma das duas, caso de apenas uma das duas, a outra que ficou em branco sempre será o dia atual, portanto, se foi fornecido apenas uma data inicial, pense que a data final é o dia atual. As categorias podem ser escolhidas de forma única ou múltipla, para elas será usado checkboxes. O tipo da movimentação será um select, logo apenas uma opção por vez, se é despesa ou entrada também, apenas uma opção. As movimentações poderão ser exibidas tanto em formato de cards quanto de lista, na lista a ordem das informações será a seguinte: Nome, valor, entrada ou despesa, tipo, categoria. Nos cards só aparecerá o nome, valor e entrada ou despesa. A ordenação padrão das movimentações na tela será descrescente pela data de criação, ou seja, as mais recentes primeiro. A tela precisa ser responsivel, o estilo dos cards e da lista, deixo por sua conta por enquanto (cores, fontes etc), mas foque em ser minimalista e moderno, essa tela também será um caminho na navbar."

## Clarifications

### Session 2026-10-22

- Q: Ao aplicar o filtro de datas (data inicial e final), qual campo de data das movimentações deve ser considerado? → A: Filtrar pela data da transação (data em que a movimentação ocorreu no formulário).
- Q: As movimentações exibidas (em cards ou lista) devem permitir ações de exclusão ou edição, ou o escopo desta tela é estritamente de consulta/visualização? → A: Permitir tanto exclusão quanto edição de movimentações.
- Q: Qual deve ser o modo de exibição padrão ativo quando o usuário acessar a tela pela primeira vez? → A: Formato Lista como padrão no Desktop e Cards no Mobile (adaptativo).
- Q: Como a listagem deve gerenciar o volume e a paginação das movimentações exibidas? → A: Carregamento sob demanda através de botão 'Carregar Mais' / scroll infinito.
- Q: Se o usuário preencher apenas a data final com uma data no passado (tornando o dia atual posterior à data final), como o sistema deve tratar o intervalo? → A: Exibir um alerta amigável nos campos de data informando que a data final não pode ser anterior à data inicial (dia atual).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Acesso à Tela de Movimentações e Visualização Padrão (Priority: P1)

Como um usuário autenticado, quero acessar uma tela dedicada através de um link na barra de navegação (navbar) e visualizar todas as minhas movimentações financeiras previamente cadastradas, ordenadas das mais recentes para as mais antigas, para que eu tenha visibilidade imediata do meu histórico recente.

**Why this priority**: É a funcionalidade central e porta de entrada da feature. Sem a exibição básica das movimentações com navegação acessível, nenhuma filtragem ou visualização adicional agrega valor.

**Independent Test**: Pode ser testado clicando no item correspondente na navbar, verificando a navegação para a nova rota e confirmando que as movimentações registradas pelo usuário são carregadas em ordem decrescente pela data de criação.

**Acceptance Scenarios**:

1. **Given** que o usuário está autenticado e navega pelo sistema, **When** ele clica no link de movimentações na navbar, **Then** o sistema deve renderizar a tela de listagem de movimentações.
2. **Given** que o usuário possui movimentações cadastradas, **When** a tela é carregada inicialmente sem filtros ativos, **Then** todas as movimentações pertencentes a ele devem ser exibidas em ordem decrescente pela data de criação (mais recentes no topo).
3. **Given** que o usuário não possui nenhuma movimentação cadastrada, **When** ele acessa a tela, **Then** uma mensagem informativa de estado vazio deve ser exibida convidando-o a cadastrar sua primeira movimentação.

---

### User Story 2 - Alternância entre Modos de Visualização: Cards e Lista (Priority: P1)

Como um usuário autenticado, quero alternar entre a exibição em formato de cards e formato de lista, escolhendo a forma de visualização que melhor atende à minha necessidade no momento.

**Why this priority**: É um requisito visual e funcional essencial para a usabilidade e flexibilidade de apresentação dos dados.

**Independent Test**: Pode ser testado acionando os controles de troca de visualização e verificando se os elementos e as informações exibidas se reestruturam imediatamente entre cards e lista.

**Acceptance Scenarios**:

1. **Given** que o usuário está no modo de visualização em Lista, **When** as movimentações são apresentadas, **Then** cada item deve exibir obrigatoriamente os dados na seguinte ordem: Nome, Valor, Entrada ou Despesa, Tipo de Movimentação (método) e Categoria.
2. **Given** que o usuário está no modo de visualização em Cards, **When** as movimentações são apresentadas, **Then** cada card deve exibir exclusivamente as seguintes informações: Nome, Valor e Entrada ou Despesa.
3. **Given** que o usuário alterna entre o formato de Cards e o formato de Lista, **When** ele aciona o controle de alternância, **Then** a mudança de layout ocorre de forma imediata mantendo as mesmas movimentações e filtros aplicados.
4. **Given** o carregamento inicial da tela, **When** o usuário acessa a página pela primeira vez, **Then** o formato Lista deve ser o padrão ativo em ambientes desktop/telas amplas, enquanto o formato Cards deve ser o padrão em telas móveis (smartphones), mantendo o controle de troca sempre acessível.

---

### User Story 3 - Filtragem por Categoria com Checkboxes (Priority: P1)

Como um usuário autenticado, quero filtrar minhas movimentações selecionando uma ou mais categorias através de checkboxes, para analisar despesas e receitas de áreas específicas.

**Why this priority**: A categorização é fundamental na gestão financeira para acompanhar gastos em áreas como Alimentação, Moradia ou Lazer.

**Independent Test**: Pode ser testado marcando uma categoria específica (ex: "Alimentação") e observando que somente registros dessa categoria permanecem na tela; em seguida marcando uma segunda categoria (ex: "Transporte") e observando que movimentações de ambas as categorias são exibidas.

**Acceptance Scenarios**:

1. **Given** que a tela exibe uma lista de checkboxes com as categorias cadastradas do usuário, **When** o usuário marca apenas uma categoria, **Then** a listagem deve exibir somente as movimentações pertencentes àquela categoria selecionada.
2. **Given** que uma categoria já está marcada, **When** o usuário marca checkboxes adicionais, **Then** a listagem deve exibir movimentações que pertençam a qualquer uma das categorias marcadas (união das categorias escolhidas).
3. **Given** que uma ou mais categorias estão selecionadas, **When** o usuário desmarca todas as categorias, **Then** o filtro de categoria deixa de ser restritivo e movimentações de todas as categorias voltam a ser consideradas.

---

### User Story 4 - Filtragem por Tipo de Movimentação e por Natureza (Entrada/Despesa) (Priority: P2)

Como um usuário autenticado, quero filtrar as movimentações pelo tipo/método (pix, cartão, dinheiro) e pela natureza (se é entrada ou despesa) através de seletores de opção única (select), para refinar minha análise de fluxo de caixa.

**Why this priority**: Permite detalhar rapidamente pagamentos com métodos específicos ou focar apenas em despesas/entradas.

**Independent Test**: Pode ser testado selecionando "Pix" no select de tipo de movimentação e verificando que apenas movimentações via Pix aparecem; ou selecionando "Despesa" no select de fluxo e verificando apenas despesas.

**Acceptance Scenarios**:

1. **Given** o campo de seleção de tipo de movimentação (método), **When** o usuário seleciona uma opção (ex: "Pix" ou "Cartão"), **Then** apenas movimentações daquele método selecionado devem ser exibidas.
2. **Given** o campo de seleção de fluxo financeiro, **When** o usuário seleciona "Entrada" ou "Despesa", **Then** apenas registros com a respectiva natureza devem ser exibidos.
3. **Given** que um select de tipo ou natureza possui uma opção selecionada, **When** o usuário seleciona a opção neutra ("Todos"), **Then** aquele critério deixa de restringir os resultados.

---

### User Story 5 - Filtragem por Período de Datas com Fallback Automático (Priority: P2)

Como um usuário autenticado, quero filtrar movimentações por intervalo de datas fornecendo data inicial e/ou data final, com o sistema aplicando automaticamente a data atual caso apenas uma das pontas do intervalo seja informada.

**Why this priority**: Garante flexibilidade temporal na consulta do histórico financeiro, facilitando análises de períodos específicos com preenchimento inteligente de lacunas.

**Independent Test**: Pode ser testado preenchendo apenas a data inicial e verificando que os registros mostrados estão compreendidos entre a data inicial informada e a data de hoje; e preenchendo apenas a data final, verificando que os registros mostrados estão entre hoje e a data final.

**Acceptance Scenarios**:

1. **Given** que o usuário informa a Data Inicial e a Data Final válidas, **When** o filtro é aplicado, **Then** o sistema exibe apenas movimentações cuja data esteja dentro do intervalo delimitado (inclusivo).
2. **Given** que o usuário preenche apenas a Data Inicial e deixa a Data Final em branco, **When** o filtro é aplicado, **Then** o sistema assume automaticamente a data do dia atual como Data Final e exibe movimentações compreendidas entre a Data Inicial e hoje.
3. **Given** que o usuário preenche apenas a Data Final e deixa a Data Inicial em branco, **When** o filtro é aplicado, **Then** o sistema assume automaticamente a data do dia atual como Data Inicial e exibe movimentações compreendidas entre hoje e a Data Final.
4. **Given** que ambos os campos de data estão em branco, **When** a listagem é exibida, **Then** nenhum limite temporal é imposto pelo filtro de datas.

---

### User Story 6 - Filtros Cumulativos e Limpeza de Filtros (Priority: P2)

Como um usuário autenticado, quero combinar múltiplos filtros simultaneamente (ex: Categoria + Data + Tipo + Entrada/Despesa) ou limpar todos os filtros aplicados com facilidade, para encontrar transações específicas ou restabelecer a visão geral rapidamente.

**Why this priority**: A análise combinada é essencial para relatórios detalhados (ex: despesas de alimentação pagas no cartão este mês).

**Independent Test**: Pode ser testado selecionando conjuntamente uma categoria, uma data inicial, tipo "Cartão" e fluxo "Despesa", validando que apenas transações que atendem cumulativamente a todos os critérios aparecem; em seguida acionando a ação de limpar filtros e verificando o retorno da listagem completa.

**Acceptance Scenarios**:

1. **Given** múltiplos filtros acionados simultaneamente (categoria, método, natureza e datas), **When** a lista é renderizada, **Then** apenas as movimentações que atendem simultaneamente a todos os critérios ativos devem ser apresentadas (operação lógica E/AND entre filtros).
2. **Given** que filtros ativos estão aplicados e resultam em nenhuma movimentação encontrada, **When** a tela renderiza, **Then** deve ser exibida uma mensagem de "Nenhuma movimentação encontrada para os filtros aplicados", com um atalho ou botão para limpar os filtros.
3. **Given** que existem filtros configurados, **When** o usuário aciona a opção "Limpar Filtros", **Then** todos os campos de filtros (checkboxes, selects e datas) devem ser restaurados para seus estados padrão neutros e a lista completa volta a ser exibida.

---

### User Story 7 - Exclusão de Movimentação (Priority: P2)

Como um usuário autenticado, quero poder excluir uma movimentação financeira registrada a partir da tela de listagem (tanto no modo lista quanto no modo cards), para manter meu histórico atualizado caso tenha feito um registro indevido.

**Why this priority**: Complementa o ciclo de vida da transação com controle total do usuário sobre seus registros.

**Independent Test**: Pode ser testado acionando a ação de exclusão em uma movimentação existente, confirmando a exclusão e verificando que a movimentação é removida da listagem e do banco de dados imediatamente.

**Acceptance Scenarios**:

1. **Given** que o usuário está visualizando suas movimentações (em cards ou em lista), **When** ele clica no botão/ícone de exclusão de uma movimentação, **Then** o sistema deve solicitar uma confirmação antes de efetivar a remoção.
2. **Given** que o diálogo de confirmação de exclusão está aberto, **When** o usuário confirma a ação, **Then** o sistema remove o registro no banco de dados, atualiza a tela sem recarregar a página e exibe mensagem de sucesso.
3. **Given** que o diálogo de confirmação de exclusão está aberto, **When** o usuário cancela a ação, **Then** o registro é preservado sem alterações.

---

### User Story 8 - Edição de Movimentação (Priority: P2)

Como um usuário autenticado, quero editar os dados de uma movimentação existente (nome, valor, data, tipo, método e categoria) a partir da tela de listagem, para corrigir eventuais dados preenchidos incorretamente.

**Why this priority**: Evita a necessidade de deletar e recriar transações em caso de pequenas correções de valor, data ou categoria.

**Independent Test**: Pode ser testado clicando na ação de editar de uma movimentação, alterando um de seus campos (ex: valor ou categoria) e confirmando a alteração, conferindo a atualização imediata no card ou linha da lista.

**Acceptance Scenarios**:

1. **Given** uma movimentação na listagem, **When** o usuário clica no botão/ícone de edição, **Then** o sistema deve abrir um formulário/modal de edição preenchido com os dados atuais da movimentação.
2. **Given** o formulário de edição aberto, **When** o usuário modifica os campos com dados válidos e clica em salvar, **Then** as alterações são persistidas no banco de dados e a listagem reflete os novos dados imediatamente.
3. **Given** o formulário de edição aberto, **When** o usuário cancela a edição, **Then** o formulário é fechado e os dados originais são mantidos intactos.

---

### Edge Cases

- **Nenhuma movimentação cadastrada no sistema**: A tela exibe um componente de boas-vindas/estado vazio instrutivo com link ou orientação para criar a primeira movimentação na tela principal.
- **Filtros combinados sem nenhum resultado correspondente**: Exibe feedback visual limpo informando que nenhum registro atende aos critérios, acompanhado de botão de ação para limpar os filtros.
- **Data Inicial posterior à Data Final (incluindo regra de data única)**: Caso o usuário informe uma Data Inicial maior que a Data Final, ou preencha apenas a Data Final com uma data anterior ao dia atual (fazendo com que a data inicial automática [hoje] supere a data final), o sistema DEVE exibir um alerta amigável nos campos de data orientando a correção do período e bloquear a busca com intervalo inconsistente.
- **Usuário sem categorias cadastradas**: Se o usuário não possuir categorias cadastradas, o painel de filtros deve omitir a seção de categorias ou apresentar um aviso amigável sem quebrar o layout.
- **Telas móveis com telas menores (smartphones)**: Os controles de filtros, o alternador de visualização e os cards/tabela de lista devem se reorganizar verticalmente de forma fluida, sem estouro horizontal ou sobreposição de texto.
- **Falha de comunicação ou perda de conexão**: Caso a busca das movimentações falhe, a tela deve exibir uma mensagem de erro compreensível com opção de tentar novamente.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE adicionar um item de navegação na barra de navegação (navbar) que permita ao usuário acessar diretamente a tela de listagem de movimentações.
- **FR-002**: A tela de movimentações DEVE exibir por padrão todas as movimentações do usuário autenticado ordenadas de forma decrescente pela data de criação (`createdAt` desc).
- **FR-003**: O sistema DEVE disponibilizar um controle interativo para alternar o modo de exibição entre "Cards" e "Lista", iniciando por padrão no formato Lista para dispositivos desktop e no formato Cards para telas móveis (smartphones).
- **FR-004**: No modo de visualização em Lista, o sistema DEVE exibir as informações de cada movimentação obrigatoriamente na seguinte sequência: Nome, Valor, Natureza (Entrada ou Despesa), Tipo de Movimentação (Pix, Cartão, Dinheiro, etc.) e Categoria.
- **FR-005**: No modo de visualização em Cards, o sistema DEVE exibir em cada card exclusivamente as seguintes informações: Nome, Valor e Natureza (Entrada ou Despesa).
- **FR-006**: O sistema DEVE disponibilizar um filtro de categorias utilizando checkboxes, permitindo seleção única, múltipla ou nenhuma (todas).
- **FR-007**: O sistema DEVE disponibilizar um filtro de tipo de movimentação (método de pagamento: pix, cartão, dinheiro, etc.) através de um campo select, aceitando apenas uma opção por vez além da opção neutra ("Todos").
- **FR-008**: O sistema DEVE disponibilizar um filtro de fluxo/natureza (Entrada ou Despesa) através de um campo select, aceitando apenas uma opção por vez além da opção neutra ("Todos").
- **FR-009**: O sistema DEVE disponibilizar filtros por período de data com campos para Data Inicial e Data Final, considerando para a filtragem a data em que a movimentação ocorreu (campo `data`).
- **FR-010**: Se apenas a Data Inicial for informada, o sistema DEVE assumir a data atual como Data Final.
- **FR-011**: Se apenas a Data Final for informada, o sistema DEVE assumir a data atual como Data Inicial; caso a Data Final informada seja anterior à data atual, o sistema DEVE alertar visualmente o usuário sobre o período inválido.
- **FR-012**: Se ambas as datas ficarem em branco, o sistema NÃO DEVE aplicar restrição de período.
- **FR-013**: Todos os filtros (categoria, tipo, natureza e datas) DEVEM ser capazes de operar de forma independente ou combinada cumulativamente (conjunção lógica E/AND).
- **FR-014**: O sistema DEVE disponibilizar um controle para limpar/redefinir todos os filtros com um único clique.
- **FR-015**: A tela DEVE apresentar design minimalista, moderno e totalmente responsivo para dispositivos móveis, tablets e desktops.
- **FR-016**: As movimentações exibidas DEVEM pertencer estritamente ao usuário autenticado atual, com validação de sessão e proteção de rota.
- **FR-017**: O sistema DEVE permitir a exclusão de qualquer movimentação do usuário autenticado mediante diálogo de confirmação, removendo-a do banco de dados e da visualização em tempo real.
- **FR-018**: O sistema DEVE permitir a edição dos dados de uma movimentação (nome, valor, data, tipo/natureza, método de pagamento e categoria), validando os dados antes de persistir no banco de dados e atualizando a interface imediatamente.
- **FR-019**: Os modos de exibição em Lista e em Cards DEVEM disponibilizar ações claras e acessíveis para disparar a edição e a exclusão de cada movimentação individual.
- **FR-020**: O sistema DEVE realizar o carregamento de movimentações de forma incremental/sob demanda (através de botão 'Carregar Mais' ou rolagem contínua), otimizando a performance e permitindo visualização fluida de grandes históricos.

### Key Entities

- **Movimentação**: Registro financeiro do usuário contendo nome (descrição), valor (quantia monetária), data da movimentação, tipo de fluxo (Entrada ou Despesa), tipo de movimentação/método (Pix, Cartão, Dinheiro), identificador do usuário proprietário e associação à Categoria.
- **Categoria**: Classificação atribuída à movimentação (ex: Alimentação, Transporte, Lazer), pertencente ao usuário.
- **Filtro de Movimentações**: Objeto agregador de estado dos critérios de busca contendo: lista de categorias selecionadas (array de IDs/nomes), tipo de método selecionado (string opcional), natureza selecionada (Entrada/Despesa opcional), data inicial (data opcional) e data final (data opcional).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: O usuário consegue visualizar suas movimentações e alternar entre visualização em Cards e Lista com resposta visual imediata (< 200ms).
- **SC-002**: A aplicação e filtragem combinada de critérios (categoria, tipo, fluxo e período) reflete 100% de precisão nos resultados retornados.
- **SC-003**: 100% dos cenários de data única preenchem a data em branco com a data do dia atual conforme regra estipulada.
- **SC-004**: A tela e seus controles mantêm usabilidade completa em telas com largura a partir de 320px sem quebras de layout ou sobreposições.
- **SC-005**: Usuários conseguem identificar claramente a natureza de cada movimentação (entrada vs despesa) de relance através de diferenciação visual limpa e minimalista.
- **SC-006**: O carregamento inicial e as buscas por demanda de novos blocos de movimentações ocorrem com resposta perceptível inferior a 500ms.

## Assumptions

- O usuário já possui autenticação válida para acessar a nova rota da tela de movimentações.
- As movimentações cadastradas na tela principal de formulário (spec 003) alimentam a mesma base de dados consumida por esta tela de listagem.
- Os tipos de movimentação (métodos) disponíveis no select correspondem às opções aceitas pelo sistema (ex: Pix, Cartão, Dinheiro).
- A natureza aceita os valores Entrada e Despesa (Saída).
- A ordenação padrão decrescente utiliza o campo `createdAt` (data de registro da transação no sistema) ou a data da movimentação em caso de paridade.
- A visualização inicial padrão ao abrir a tela pode ser Cards ou Lista, com preferência por Cards ou Lista de acordo com as boas práticas minimalistas modernas, mantendo o controle de troca sempre visível.
- A biblioteca de ícones e estilização seguirá os padrões arquiteturais existentes no projeto (TypeScript estrito, componentes funcionais sem `React.FC`, arquivos de estilo CSS dedicados e separados sem CSS inline, em conformidade com a Constituição do projeto).
