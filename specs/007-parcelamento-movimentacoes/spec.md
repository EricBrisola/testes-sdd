# Feature Specification: Cadastro e Gestão de Movimentações Parceladas

**Feature Branch**: `007-parcelamento-movimentacoes`

**Created**: 2026-11-12

**Status**: Draft

**Input**: User description: "quero criar uma funcionalidade de parcelamento, o usuario poderá cadastras entradas ou saidas que sejam parceladas, será necessario incluir um checkbox dizendo se é parcela ou nao, caso seja, um outro input do tipo select aparecerá com a quantidade de parcelas, sendo de 2 até 24, ai o calculo será o valor total que ele colocou no input de valor, dividido pela quantidade de parcelas, assim gerando as novas movimentações. O input select de parcelas deve aparecer entre o de valor e de data, sem compormeter a estrutura do formulario, portanto esses outros dois precisar diminuir de comprimento quando o select da parcela estiver presente. as parcelas precisam estar de alguma forma anexadas umas as outras, pois caso o usuario tente editar uma, todas precisam ser alteradas com as informações que ele alterou em uma delas, mesma coisa de exclusão, se excluir uma parcela,e xcluir todas."

## Clarifications

### Session 2026-11-12

- Q: Como o sistema deve tratar a alteração de data ao editar uma parcela específica de um parcelamento? (FR-013) → A: Deslocar as datas de todas as parcelas seguintes pelo mesmo intervalo de dias da alteração (mantendo o espaçamento relativo da série temporal).
- Q: A alteração da quantidade de parcelas de um grupo já cadastrado deve ser permitida no modal de edição? (FR-014) → A: Não permitir alterar a quantidade de parcelas na edição (a quantidade é imutável após a criação; caso precise alterar o número de parcelas, o usuário deve excluir o grupo e recadastrar).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Cadastro de Movimentação Parcelada no Formulário Principal (Priority: P1)

Como um usuário que organiza suas finanças, quero informar uma compra ou ganho parcelado em até 24 vezes no formulário principal, para que o sistema gere automaticamente todas as parcelas mensais calculadas a partir do valor total informado.

**Why this priority**: É a funcionalidade central do parcelamento (MVP). Sem a capacidade de registrar e calcular automaticamente as parcelas divididas no formulário, a funcionalidade de parcelamento não existe.

**Independent Test**: Pode ser testado preenchendo o formulário de nova movimentação, marcando a opção de parcelamento, selecionando um número de parcelas (ex: 3x para R$ 300,00) e salvando. O sistema deve gerar 3 movimentações de R$ 100,00, espaçadas mensalmente, com a indicação ordinal de cada parcela.

**Acceptance Scenarios**:

1. **Given** que o usuário está no formulário de Nova Movimentação, **When** ele marca o checkbox "Parcelar movimentação", **Then** o campo de seleção de parcelas deve se tornar visível entre os campos de Valor e Data, oferecendo opções de 2 até 24 parcelas.
2. **Given** que a opção de parcelamento está marcada e selecionada como "3x", com valor total de R$ 300,00 e data inicial 10/11/2026, **When** o usuário submete o formulário com dados válidos, **Then** o sistema deve criar 3 movimentações vinculadas: Parcela 1/3 (R$ 100,00 em 10/11/2026), Parcela 2/3 (R$ 100,00 em 10/12/2026) e Parcela 3/3 (R$ 100,00 em 10/01/2027).
3. **Given** que o usuário informou um valor não divisível de forma exata (ex: R$ 100,00 em 3 parcelas), **When** o formulário é submetido, **Then** as parcelas devem totalizar exatamente o valor original, alocando a fração residual de centavos na primeira parcela (ex: Parcela 1/3 de R$ 33,34, Parcela 2/3 de R$ 33,33 e Parcela 3/3 de R$ 33,33).
4. **Given** que o usuário preencheu campos e marcou a opção de parcelamento, **When** ele desmarca o checkbox de parcelamento antes de salvar, **Then** o seletor de parcelas deve ser ocultado, os campos de Valor e Data devem retornar à largura original e o salvamento registrará apenas uma movimentação única no valor integral.

---

### User Story 2 - Exclusão Unificada de Movimentações Parceladas (Priority: P1)

Como um usuário que gerencia suas movimentações, quero que, ao excluir qualquer parcela de um parcelamento, todas as demais parcelas associadas sejam excluídas conjuntamente, para manter a integridade do meu histórico financeiro sem registros órfãos.

**Why this priority**: Evita inconsistência de dados onde parte de uma despesa ou receita parcelada continuaria existindo de forma incorreta e descontextualizada.

**Independent Test**: Pode ser testado localizando qualquer uma das parcelas de um grupo de parcelamento na listagem de movimentações e acionando a exclusão. Ao confirmar, todas as parcelas irmãs do mesmo parcelamento devem desaparecer da listagem e do banco de dados.

**Acceptance Scenarios**:

1. **Given** que o usuário possui uma movimentação parcelada em 5x cadastrada no sistema, **When** ele clica no botão de excluir em qualquer uma dessas 5 parcelas (seja a primeira, intermediária ou última), **Then** o modal de confirmação de exclusão deve informar expressamente que se trata de uma movimentação parcelada e que todas as 5 parcelas vinculadas serão excluídas.
2. **Given** o modal de confirmação de exclusão de movimentação parcelada aberto, **When** o usuário confirma a exclusão, **Then** todas as parcelas pertencentes àquele mesmo parcelamento devem ser removidas permanentemente em uma única operação.
3. **Given** o modal de confirmação de exclusão aberto, **When** o usuário clica em cancelar, **Then** nenhuma parcela deve ser excluída e o estado anterior é preservado.

---

### User Story 3 - Edição Sincronizada de Movimentações Parceladas (Priority: P2)

Como um usuário que precisa corrigir dados de uma compra ou receita parcelada, quero que ao editar os dados em uma das parcelas, as alterações sejam propagadas de forma sincronizada para todas as parcelas do mesmo grupo, para que eu não precise alterar manualmente cada uma das parcelas.

**Why this priority**: Garante consistência de dados e economia de tempo ao editar movimentações vinculadas que compartilham atributos fundamentais.

**Independent Test**: Pode ser testado abrindo o modal de edição de qualquer parcela de um grupo, alterando campos como Nome, Categoria, Método de Pagamento ou Valor da Parcela e salvando. Todas as outras parcelas do mesmo grupo devem refletir as alterações correspondentes.

**Acceptance Scenarios**:

1. **Given** um grupo de parcelas cadastradas, **When** o usuário edita a descrição base (nome) de uma das parcelas, **Then** todas as parcelas do grupo devem ter seus nomes atualizados, mantendo seus respectivos indicadores ordinais de parcela (ex: de "Notebook (1/10)" para "Macbook (1/10)").
2. **Given** um grupo de parcelas, **When** o usuário altera a categoria, tipo (entrada/saída) ou método de pagamento em uma parcela, **Then** todas as parcelas do mesmo parcelamento devem passar a refletir a nova categoria, tipo e método de pagamento.
3. **Given** um grupo de parcelas, **When** o usuário edita o valor de uma parcela individual no modal de edição, **Then** o novo valor de parcela é atualizado em todas as parcelas do mesmo parcelamento.
4. **Given** que o usuário altera a data de uma parcela específica no modal de edição, **When** o formulário é salvo com sucesso, **Then** a data daquela parcela é atualizada e as datas de todas as parcelas subsequentes da mesma série são deslocadas pelo mesmo intervalo de dias da alteração, preservando o espaçamento relativo da série temporal.
5. **Given** o modal de edição de uma movimentação pertencente a um parcelamento aberto, **When** o usuário visualiza as opções do modal, **Then** a quantidade de parcelas e a numeração ordinal são tratadas como fixas/informativas, impedindo a alteração do número total de parcelas do grupo.

---

### User Story 4 - Adaptação Fluida e Responsiva do Layout do Formulário (Priority: P2)

Como um usuário que acessa a aplicação tanto em computadores quanto em smartphones, quero que o seletor de parcelas se integre naturalmente à linha dos campos de Valor e Data sem quebrar o alinhamento visual, reduzindo suavemente a largura dos campos vizinhos no desktop e empilhando de forma agradável no mobile.

**Why this priority**: Atende à diretriz de design responsivo da Constituição do projeto, mantendo uma experiência visual agradável e usável em qualquer dispositivo.

**Independent Test**: Pode ser testado redimensionando o navegador entre resoluções desktop (>768px) e resoluções mobile (<480px), ativando e desativando o checkbox de parcelamento e observando a estabilidade do layout e proporção dos inputs.

**Acceptance Scenarios**:

1. **Given** visualização em tela desktop com o formulário em largura total, **When** o checkbox de parcelamento é marcado, **Then** os campos de Valor e Data reduzem proporcionalmente suas larguras e o select de parcelas se posiciona entre eles na mesma linha horizontal.
2. **Given** visualização em tela de smartphone (largura inferior a 480px), **When** o checkbox de parcelamento é marcado, **Then** os campos se ajustam ordenadamente em layout vertical sem estouro de largura ou rolagem horizontal indesejada.
3. **Given** o select de parcelas visível, **When** o usuário desmarca o checkbox, **Then** os campos de Valor e Data expandem de volta suavemente para ocupar a largura total disponível da linha.

---

### Edge Cases

- **Divisão com dízima e resíduo de centavos**: Quando o valor total informado dividido pela quantidade de parcelas resultar em dízima periódica (ex: R$ 50,00 em 3x = R$ 16,666...), o sistema deve calcular as parcelas com 2 casas decimais e alocar a diferença de centavos (R$ 0,02) na primeira parcela (1ª parcela: R$ 16,68; 2ª e 3ª parcelas: R$ 16,66), garantindo que a soma exata das parcelas seja idêntica ao valor digitado.
- **Transição de meses com quantidade de dias distinta**: Se uma movimentação parcelada for cadastrada no dia 31 de janeiro, as parcelas seguintes devem cair no último dia útil/válido dos meses subsequentes que possuem menos dias (ex: 28 ou 29 de fevereiro, 30 de abril), evitando erros de estouro de calendário.
- **Valor mínimo e limites de parcelas**: O valor total informado deve ser suficiente para que cada parcela tenha valor maior que zero (mínimo de R$ 0,01 por parcela). A quantidade de parcelas é restrita rigorosamente entre 2 e 24.
- **Desmarcação do checkbox durante preenchimento**: Se o usuário marcar o checkbox, selecionar 12x e depois desmarcar o checkbox antes de submeter, o formulário deve salvar apenas 1 movimentação única com o valor total digitado, descartando a seleção de parcelamento.
- **Exclusão concorrente ou falha de rede**: Caso ocorra instabilidade de rede durante a exclusão em lote de parcelas vinculadas, a operação deve ser atômica (tudo ou nada), impedindo que o sistema fique com parcelas parcialmente deletadas.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O formulário de cadastro de movimentações DEVE incluir um controle de alternância (checkbox) identificado como "Parcelar movimentação" (ou equivalente claro).
- **FR-002**: O sistema DEVE exibir o seletor (select) de quantidade de parcelas exclusivamente quando o checkbox de parcelamento estiver marcado.
- **FR-003**: O seletor de parcelas DEVE conter opções inteiras fixas variando de 2 até 24 parcelas (ex: "2x", "3x", ..., "24x"), com valor padrão sugerido (ex: 2x).
- **FR-004**: No layout do formulário em telas amplas (desktop), o seletor de parcelas DEVE se posicionar horizontalmente entre o campo de Valor e o campo de Data, reduzindo proporcionalmente o comprimento dos campos vizinhos sem distorcer o alinhamento do formulário.
- **FR-005**: O formulário DEVE manter total responsividade, adaptando os campos de Valor, Parcelas e Data para empilhamento vertical limpo em telas móveis (mobile).
- **FR-006**: O sistema DEVE calcular o valor de cada parcela dividindo o valor total digitado no campo de valor pela quantidade de parcelas selecionada.
- **FR-007**: O sistema DEVE garantir que a soma das parcelas geradas seja exatamente igual ao valor total digitado, distribuindo eventuais sobras de centavos na primeira parcela.
- **FR-008**: O sistema DEVE gerar movimentações sequenciais com periodicidade mensal (intervalo de 1 mês entre parcelas consecutivas), iniciando na data informada no campo de data para a 1ª parcela.
- **FR-009**: O sistema DEVE adicionar uma identificação ordinal ao nome de cada parcela gerada no formato `[Nome] (X/N)` (ex: "Celular (1/10)", "Celular (2/10)"), facilitando a identificação pelo usuário.
- **FR-010**: O sistema DEVE permitir parcelamento tanto para movimentações do tipo Entrada (receita) quanto do tipo Saída (despesa).
- **FR-011**: O sistema DEVE associar internamente todas as parcelas geradas a um mesmo identificador de agrupamento de parcelamento.
- **FR-012**: O sistema DEVE propagar a exclusão de qualquer parcela para todas as demais parcelas pertencentes ao mesmo grupo de parcelamento, mediante confirmação explícita do usuário em modal.
- **FR-013**: O sistema DEVE propagar alterações em campos compartilhados (como nome base, categoria, tipo e método de pagamento) realizadas em qualquer parcela para todas as demais parcelas do mesmo grupo de parcelamento.
- **FR-014**: O sistema DEVE atualizar o valor de todas as parcelas vinculadas caso o usuário edite o valor de parcela no formulário de edição de uma movimentação pertencente a um parcelamento.
- **FR-015**: Ao alterar a data de uma parcela específica em uma edição, o sistema DEVE atualizar a data da parcela editada e deslocar as datas de todas as parcelas subsequentes do mesmo parcelamento pelo mesmo intervalo de dias da modificação, mantendo o espaçamento relativo da série.
- **FR-016**: A quantidade de parcelas de um parcelamento DEVE ser imutável após a criação inicial. O formulário de edição NÃO DEVE permitir alterar a quantidade de parcelas (para alterar a quantidade de parcelas, o usuário deve excluir o grupo e efetuar um novo cadastro).

### Key Entities

- **Movimentacao**: Registro financeiro individual do usuário (valor, data, tipo, método de pagamento, categoria, usuário).
- **Agrupamento de Parcelamento (ParcelamentoGroup)**: Vínculo que conecta as movimentações de uma mesma série parcelada. Define o identificador único do parcelamento, a quantidade total de parcelas (ex: 12), o número sequencial da parcela (ex: 1, 2, ..., 12) e o valor total original do parcelamento.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: O usuário consegue configurar e salvar um parcelamento completo em 10 segundos ou menos no formulário de cadastro.
- **SC-002**: 100% das transações parceladas geradas têm a soma exata de suas parcelas idêntica ao valor total informado no formulário (zero desvio de centavos).
- **SC-003**: 100% das operações de exclusão de uma parcela removem com sucesso todas as parcelas vinculadas do mesmo grupo em uma única transação atômica.
- **SC-004**: O formulário com o seletor de parcelas ativo se adapta sem overflow horizontal ou quebra visual em telas de resolução a partir de 320px de largura.
- **SC-005**: Ao editar os dados de uma parcela, as parcelas irmãs refletem as atualizações imediatamente na listagem sem necessidade de recarregar a página manualmente.

## Assumptions

- O intervalo inicial padrão entre parcelas consecutivas é de 1 mês civil a partir da data de vencimento informada para a primeira parcela.
- Caso o dia do vencimento não exista no mês subsequente (ex: dia 31 em meses de 30 dias ou fevereiro), o sistema atribuirá o último dia disponível daquele mês.
- A distribuição de resíduos de arredondamento de centavos ocorrerá sempre na primeira parcela.
- Na listagem de movimentações e nos cards, cada parcela aparece como um registro financeiro independente com data e valor próprios, contendo o sufixo ordinal em seu nome (ex: "Compra TV (1/10)").
- As regras de validação já existentes (nome não vazio, categoria obrigatória, valor maior que zero) continuam sendo aplicadas individualmente e no total do parcelamento.
- O número de parcelas é definido exclusivamente no momento do cadastro inicial e não pode ser alterado via modal de edição.
