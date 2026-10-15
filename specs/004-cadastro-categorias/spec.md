# Feature Specification: Cadastro de Categorias e Seleção em Movimentações

**Feature Branch**: `004-cadastro-categorias`

**Created**: 2026-10-15

**Status**: Draft (Updated)

**Input**: User description: "continue o fluxo da spec 003 adicionando a tela de cadastro de categorias. A tela precisa de uma rota nova e um formulário com o nome da categoria apenas. Quando o usuário preencher o input da categoria com o nome que ele deseja e apertar no botão de criar, ela deve ser inserida no banco. Depois que o usuário criar essa categoria e voltar na tela de criação de movimentações ele poderá ver a categoria que ele escolheu em um input do tipo select e escolhê-la para a movimentação que ele for criar. Toda categoria precisa estar ligada ao usuário que a criou através de uma FK (já existe no schema). Não pode ser criada uma categoria vazia. As categorias podem ser alteradas e excluídas. Na tela de criação de movimentações as categorias precisam ser listadas alfabeticamente. Na tela de criação de categorias também mostra todas as categorias criadas em forma de tabela. O usuário clica em uma linha da tabela e na própria linha aparece um input inline para editar o nome. Em cada linha da tabela há dois ícones: um de editar e outro de excluir."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Cadastro de Nova Categoria (Priority: P1)

Como um usuário autenticado, quero acessar uma tela dedicada para cadastrar novas categorias informando apenas o nome, para que eu possa organizar e classificar minhas movimentações financeiras de acordo com minhas necessidades.

**Why this priority**: É a funcionalidade central solicitada. Sem a capacidade de registrar categorias personalizadas, o usuário fica restrito ou impossibilitado de categorizar suas transações de forma precisa.

**Independent Test**: Pode ser testado acessando a rota da tela de cadastro de categorias, preenchendo o nome da categoria e clicando em criar. O sistema deve persistir a categoria no banco de dados vinculada ao usuário autenticado e exibir feedback de confirmação.

**Acceptance Scenarios**:

1. **Given** que o usuário está na tela de cadastro de categorias, **When** ele preenche o campo de nome com texto válido e clica em "Criar", **Then** a categoria é salva com sucesso associada ao seu usuário, o campo é limpo e uma mensagem de sucesso é apresentada.
2. **Given** que o usuário está no formulário de cadastro de categorias, **When** ele tenta submeter o formulário com o campo de nome vazio ou preenchido apenas com espaços em branco, **Then** o sistema deve bloquear o envio e exibir um aviso visual de validação informando que o nome é obrigatório.
3. **Given** que o usuário tenta criar uma categoria com o mesmo nome de uma já existente em sua conta, **When** ele submete o formulário, **Then** o sistema deve rejeitar a operação e informar que a categoria já existe, sem criar duplicatas.

---

### User Story 2 - Visualização de Categorias em Tabela (Priority: P1)

Como um usuário autenticado na tela de categorias, quero ver a lista de todas as minhas categorias cadastradas exibidas em uma tabela abaixo do formulário de criação, para ter uma visão clara e rápida de tudo que já foi criado.

**Why this priority**: A listagem é indissociável da gestão de categorias — sem ela o usuário não sabe o que foi criado, nem pode editar ou excluir entradas.

**Independent Test**: Pode ser testado cadastrando pelo menos duas categorias e verificando que elas aparecem na tabela na mesma tela, sem necessidade de navegar para outra página.

**Acceptance Scenarios**:

1. **Given** que o usuário possui categorias cadastradas, **When** ele acessa a tela de categorias, **Then** todas as suas categorias são exibidas em uma tabela ordenada.
2. **Given** que o usuário não possui nenhuma categoria cadastrada, **When** ele acessa a tela de categorias, **Then** a tabela exibe um estado vazio informativo (ex: "Nenhuma categoria cadastrada ainda").

---

### User Story 3 - Edição Inline de Categoria (Priority: P2)

Como um usuário autenticado, quero poder editar o nome de uma categoria diretamente na linha da tabela, para corrigir erros ou atualizar nomenclaturas sem precisar navegar para outra tela.

**Why this priority**: A experiência de edição inline é mais fluida e natural do que redirecionar para outra tela, reduzindo o atrito na gestão de categorias.

**Independent Test**: Pode ser testado clicando no ícone de editar (ou diretamente na linha) de uma categoria existente, alterando o nome no campo que aparece na própria linha e confirmando a operação.

**Acceptance Scenarios**:

1. **Given** que o usuário está na tabela de categorias, **When** ele clica no ícone de editar em uma linha, **Then** o nome da categoria naquela linha é substituído por um campo de texto editável pré-preenchido com o nome atual.
2. **Given** que o campo de edição inline está ativo, **When** o usuário altera o texto e confirma (ex: pressiona Enter ou clica em salvar), **Then** o nome é atualizado no banco de dados e a tabela exibe o novo nome.
3. **Given** que o campo de edição inline está ativo, **When** o usuário cancela a edição (ex: pressiona Escape), **Then** o campo volta ao modo de visualização com o nome original, sem nenhuma alteração persistida.

---

### User Story 4 - Exclusão de Categoria (Priority: P2)

Como um usuário autenticado, quero poder excluir uma categoria da tabela clicando no ícone de exclusão correspondente à sua linha, para remover classificações que não são mais relevantes.

**Why this priority**: Completando o ciclo CRUD, a exclusão permite que o usuário mantenha sua lista de categorias limpa e organizada.

**Independent Test**: Pode ser testado clicando no ícone de excluir de uma categoria e verificando que ela desaparece da tabela e não está mais disponível na tela de movimentações.

**Acceptance Scenarios**:

1. **Given** que o usuário está na tabela de categorias, **When** ele clica no ícone de excluir de uma linha, **Then** a categoria é removida do banco de dados e desaparece da tabela imediatamente.
2. **Given** que uma categoria está vinculada a movimentações existentes, **When** o usuário tenta excluí-la, **Then** o sistema deve impedir a exclusão e informar ao usuário que a categoria possui movimentações associadas.

---

### User Story 5 - Seleção de Categoria na Tela de Movimentações (Priority: P1)

Como um usuário autenticado, ao criar uma movimentação, quero selecionar uma das minhas categorias existentes em um campo de seleção (select) listado em ordem alfabética, para categorizar corretamente cada transação.

**Why this priority**: Conecta diretamente o cadastro de categorias com o fluxo principal de registro financeiro (spec 003), tornando as categorias criadas imediatamente úteis.

**Independent Test**: Pode ser testado cadastrando previamente categorias com nomes como "Transporte", "Alimentação" e "Moradia", e verificando que aparecem no select na ordem: Alimentação, Moradia, Transporte.

**Acceptance Scenarios**:

1. **Given** que o usuário possui categorias cadastradas, **When** ele acessa a tela de cadastro de movimentações, **Then** o campo de seleção de categorias lista todas as suas categorias em ordem alfabética crescente.
2. **Given** que o usuário seleciona uma categoria e preenche os demais campos da movimentação, **When** ele clica em salvar, **Then** a transação é registrada vinculada à categoria escolhida.
3. **Given** que o usuário ainda não criou nenhuma categoria manualmente (ou excluiu todas), **When** ele acessa a tela de movimentações, **Then** o campo select exibe um estado vazio informativo com um atalho para a tela de cadastro de categorias.
4. **Given** que um novo usuário acabou de se cadastrar na aplicação, **When** ele acessa a tela de movimentações pela primeira vez, **Then** as categorias padrão criadas automaticamente (Alimentação, Geral, Lazer) já aparecem ordenadas alfabeticamente no select para seleção imediata.

---

### User Story 6 - Navegação entre Telas (Priority: P2)

Como um usuário autenticado, quero navegar facilmente entre a tela de movimentações e a tela de categorias através de controles de navegação claros.

**Why this priority**: Garante uma experiência de usuário fluida, sem fricção na alternância entre as duas telas da aplicação.

**Acceptance Scenarios**:

1. **Given** que o usuário está na tela de movimentações, **When** ele aciona a navegação para categorias, **Then** o sistema o direciona para a rota de categorias.
2. **Given** que o usuário está na tela de categorias, **When** ele aciona a navegação de retorno, **Then** ele é redirecionado para a tela de movimentações.

---

### Edge Cases

- **Texto com espaços excedentes**: Se o nome da categoria tiver espaços antes/depois (ex: `"  Alimentação  "`), o sistema deve normalizar removendo os espaços antes de salvar.
- **Categoria com nome duplicado**: Tentativas de criar uma categoria com nome já existente para o mesmo usuário devem ser rejeitadas com mensagem informativa.
- **Exclusão de categoria em uso**: Categorias vinculadas a movimentações existentes não podem ser excluídas. O sistema deve informar o motivo da recusa.
- **Edição com campo vazio**: Se o usuário apagar todo o conteúdo do campo de edição inline e tentar confirmar, o sistema deve bloquear e exibir aviso de campo obrigatório.
- **Falha de rede**: Em caso de falha de comunicação ao criar, editar ou excluir, o sistema deve apresentar uma mensagem amigável sem perder os dados inseridos pelo usuário.
- **Nenhuma categoria no select de movimentações**: Se o usuário não tiver categorias cadastradas, o campo select exibe estado vazio com atalho de navegação para criar categorias.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE disponibilizar uma nova rota de interface, acessível exclusivamente a usuários autenticados, dedicada ao gerenciamento de categorias.
- **FR-002**: A tela de categorias DEVE exibir um formulário com um único campo de texto (nome) e um botão "Criar" para cadastro de novas categorias.
- **FR-003**: O sistema DEVE rejeitar a criação de categorias com nome vazio ou composto apenas de espaços em branco, exibindo mensagem de validação.
- **FR-004**: O sistema DEVE rejeitar a criação de categorias com nome duplicado para o mesmo usuário autenticado.
- **FR-005**: O sistema DEVE persistir a nova categoria no banco de dados vinculando-a obrigatoriamente ao `userId` do usuário autenticado via chave estrangeira (FK existente no schema).
- **FR-006**: O sistema DEVE limpar o campo de texto e exibir feedback visual de sucesso após a criação bem-sucedida de uma categoria.
- **FR-007**: A tela de categorias DEVE exibir todas as categorias do usuário em formato de tabela abaixo do formulário de criação.
- **FR-008**: Cada linha da tabela de categorias DEVE conter o nome da categoria e dois ícones de ação: um para edição e outro para exclusão.
- **FR-009**: Ao clicar no ícone de edição de uma linha, o nome da categoria naquela linha DEVE ser substituído por um campo de texto inline editável, pré-preenchido com o nome atual.
- **FR-010**: O sistema DEVE persistir a alteração do nome da categoria ao confirmar a edição inline, atualizando o registro no banco de dados.
- **FR-011**: O sistema DEVE cancelar a edição inline sem persistir alterações quando o usuário pressionar Escape ou clicar em cancelar.
- **FR-012**: Ao clicar no ícone de exclusão, o sistema DEVE remover a categoria do banco de dados e da tabela, desde que ela não possua movimentações associadas.
- **FR-013**: O sistema DEVE impedir a exclusão de categorias vinculadas a movimentações e exibir mensagem explicativa ao usuário.
- **FR-014**: A tela de cadastro de movimentações DEVE carregar dinamicamente as categorias do usuário autenticado e exibi-las em ordem alfabética crescente no campo `<select>`.
- **FR-015**: O sistema DEVE associar a movimentação à categoria selecionada ao submeter o formulário de cadastro de movimentação.
- **FR-016**: Quando o usuário não possuir categorias cadastradas, o campo select na tela de movimentações DEVE exibir estado vazio com um atalho para a tela de criação de categorias.
- **FR-017**: Todas as rotas de backend relacionadas a categorias (listar, criar, editar, excluir) DEVEM exigir autenticação via JWT.
- **FR-018**: No momento em que um novo usuário for registrado no sistema (primeiro login via Google SSO), o sistema DEVE criar automaticamente um conjunto de categorias padrão vinculadas ao seu `userId` (ex: "Alimentação", "Lazer", "Geral"), garantindo que o usuário recém-criado já possua opções no select de movimentações desde o primeiro acesso.

### Key Entities

- **Categoria**: Classificação financeira personalizada do usuário. Possui nome (texto obrigatório), data de criação e vinculação obrigatória ao Usuário proprietário via FK `userId`. O modelo já existe no schema do banco de dados.
- **Movimentação**: Transação financeira registrada pelo usuário. Possui associação obrigatória a uma Categoria via FK `categoriaId`. O modelo já existe no schema do banco de dados.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: O usuário consegue criar uma nova categoria em menos de 10 segundos a partir da abertura da tela de categorias.
- **SC-002**: 100% das categorias recém-criadas ou editadas aparecem corretamente na tabela e no select de movimentações sem necessidade de recarregar a página.
- **SC-003**: O sistema bloqueia 100% das tentativas de criação de categorias com nome vazio ou duplicado antes de qualquer chamada ao banco de dados.
- **SC-004**: As categorias são exibidas em ordem alfabética no campo select da tela de movimentações em 100% das consultas.
- **SC-005**: Todas as telas, tabelas e fluxos de navegação são totalmente responsivos e funcionais em dispositivos móveis e desktops.

## Assumptions

- O usuário já está devidamente autenticado para acessar a rota de categorias e ter seus registros vinculados à sua identidade.
- A relação Categoria → Usuário via FK (`userId`) já está modelada e migrada no banco de dados (confirmado no schema Prisma atual).
- As categorias são de uso exclusivamente pessoal: cada usuário visualiza e gerencia apenas as suas próprias categorias.
- A ordenação alfabética das categorias no select de movimentações será tratada na consulta ao banco de dados para garantir consistência.
- O frontend utilizará `react-router-dom` para gerenciamento de rotas, uma vez que a aplicação atualmente não possui roteamento e esta feature requer uma nova rota.
- A edição inline não cria uma tela separada — ela ocorre diretamente na linha da tabela existente.
