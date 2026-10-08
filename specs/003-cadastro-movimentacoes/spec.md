# Feature Specification: Cadastro de Movimentações

**Feature Branch**: `003-cadastro-movimentacoes`

**Created**: 2026-10-08

**Status**: Draft

**Input**: User description: "tela de cadastro de movimentações, será a tela principal da aplicação que abrirá quando o usuário estiver logado ou logo após ele logar, nela serão inseridos as movimentações que o usuario quer cadastrar, ele irá preencher os dados necessários no formulário e salvar a movimentação. O formulário precisa comportar os seguintes campos: nome da movimentação, valor, data, tipo (entrada ou saída),  tipo da movimentação (pix, dinheiro ou cartão) e categoria (o usuário poderá cadastrar categorias em outra tela mais p frente)"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Acesso à Tela Principal (Priority: P1)

Como um usuário logado, quero ser direcionado automaticamente para a tela de Cadastro de Movimentações para que eu possa registrar rapidamente minhas finanças.

**Why this priority**: É o ponto de entrada principal do usuário e pré-requisito para o cadastro de transações.

**Independent Test**: Pode ser testado fazendo login e verificando o redirecionamento ou acessando a rota principal autenticada.

**Acceptance Scenarios**:

1. **Given** que o usuário acaba de realizar login, **When** o processo de autenticação finaliza com sucesso, **Then** o sistema deve redirecioná-lo para a tela principal de Cadastro de Movimentações.
2. **Given** que o usuário já está logado, **When** ele abre o aplicativo ou recarrega a página principal, **Then** a tela de Cadastro de Movimentações deve ser exibida.

---

### User Story 2 - Cadastro de Nova Movimentação (Priority: P1)

Como um usuário, quero preencher um formulário com os detalhes da minha movimentação (nome, valor, data, entrada/saída, método e categoria) e salvá-la no meu histórico financeiro.

**Why this priority**: É a funcionalidade core (MVP) para o registro financeiro da aplicação.

**Independent Test**: Pode ser testado preenchendo o formulário com dados válidos e confirmando se a movimentação é persistida via requisição e o formulário é limpo.

**Acceptance Scenarios**:

1. **Given** que o usuário está na tela principal, **When** ele preenche todos os campos obrigatórios e clica em "Salvar", **Then** a movimentação deve ser persistida para a sua conta e uma mensagem de sucesso deve ser exibida.
2. **Given** o formulário de cadastro, **When** o usuário tenta salvar sem preencher campos obrigatórios (ex: valor ou nome), **Then** o sistema deve exibir alertas visuais de validação e não deve prosseguir com o salvamento.

---

### Edge Cases

- O que acontece se o usuário informar um valor negativo para uma entrada ou saída? (Assumimos que o formulário converterá automaticamente para o valor absoluto).
- Como o sistema se comporta caso a conexão de rede caia no momento em que ele clica em Salvar? (Deve exibir mensagem de erro amigável).
- O que acontece se não houver nenhuma categoria cadastrada para ele escolher? (Assumimos que o campo aceitará uma categoria padrão ou exigirá o cadastro prévio na API).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE redirecionar o usuário para esta tela automaticamente após login bem-sucedido.
- **FR-002**: O sistema DEVE prover um formulário contendo: Nome (texto), Valor (numérico/moeda), Data (seletor de data), Tipo (seleção: Entrada ou Saída), Método de Movimentação (seleção: Pix, Dinheiro ou Cartão) e Categoria (seleção).
- **FR-003**: O sistema DEVE validar os dados do formulário antes do envio, garantindo que nenhum campo obrigatório esteja vazio e que o valor seja maior que zero.
- **FR-004**: O sistema DEVE persistir a movimentação vinculando-a exclusivamente ao usuário autenticado atual.
- **FR-005**: O sistema DEVE limpar os dados do formulário após um salvamento bem-sucedido, para facilitar cadastros sequenciais.

### Key Entities

- **Movimentacao (Transaction)**: Representa o registro financeiro inserido pelo usuário. Possui atributos essenciais como nome, valor, data, tipo (Entrada/Saída) e forma_pagamento, e se relaciona com o Usuário dono do registro e uma Categoria.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Usuários conseguem preencher e salvar uma nova movimentação sem fricção em menos de 30 segundos.
- **SC-002**: O formulário impede 100% das submissões inválidas (dados em branco ou valores negativos) no lado do cliente.
- **SC-003**: A tela de cadastro é totalmente responsiva e usável sem falhas de layout em dispositivos móveis.

## Assumptions

- Assumimos que o endpoint do backend retornará mensagens de erro tratáveis (ex: 400 Bad Request, 500 Internal Error) que poderão ser capturadas e exibidas na UI.
- Assumimos que o usuário possui categorias pré-cadastradas no banco de dados ou o sistema fornecerá categorias padrão, uma vez que a tela de gerenciamento de categorias será feita no futuro.
- Assumimos que a interface será desenvolvida com foco total na responsividade (Mobile-First), conforme as diretrizes de Design da Constituição.
