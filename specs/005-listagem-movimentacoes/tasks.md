# Tasks: Listagem e Gestão de Movimentações

**Feature**: `005-listagem-movimentacoes`  
**Branch**: `005-listagem-movimentacoes`  
**Specification**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md) | **Data Model**: [data-model.md](./data-model.md) | **Contracts**: [contracts/api.md](./contracts/api.md)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Instalação da dependência obrigatória e inicialização de tipos, serviços HTTP e container de notificações.

- [X] T001 Instalar a dependência `react-toastify` no projeto frontend executando `npm install react-toastify` em `frontend/package.json`
- [X] T002 [P] Criar os tipos TypeScript compartilhados (`MovimentacaoComCategoria`, `FiltrosMovimentacoesDTO`, `AtualizarMovimentacaoDTO`, `MovimentacoesPaginadasResponse`) em `frontend/src/types/movimentacao.ts`
- [X] T003 [P] Criar o arquivo base de serviço HTTP de movimentações com cliente Axios em `frontend/src/services/movimentacao.service.ts`
- [X] T004 Configurar o container `ToastContainer` e importar os estilos `react-toastify/dist/ReactToastify.css` em `frontend/src/App.tsx`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Infraestrutura base de rotas e navegação que bloqueiam o desenvolvimento das User Stories.

**⚠️ CRITICAL**: Nenhuma User Story pode ser iniciada antes da conclusão desta fase.

- [X] T005 Atualizar a barra de navegação em `frontend/src/components/Navbar/index.tsx` e `styles.ts` adicionando o link de rota para a tela de movimentações (`/movimentacoes`), mantendo a navegação responsiva
- [X] T006 [P] Atualizar a infraestrutura de serviço em `backend/src/services/movimentacoes.service.ts` com tipagem para consultas com paginação e inclusão do modelo de Categoria (`include: { categoria: true }`)
- [X] T007 [P] Configurar os hooks e estrutura de rotas protegidas por JWT (`fastify.addHook('onRequest', jwtVerify)`) em `backend/src/api/routes/movimentacoes.routes.ts`
- [X] T008 Registrar a rota `/movimentacoes` no roteador em `frontend/src/App.tsx` e criar a casca inicial da página com Navbar integrada em `frontend/src/pages/Movimentacoes/index.tsx` e `frontend/src/pages/Movimentacoes/styles.ts`

**Checkpoint**: Infraestrutura pronta — desenvolvimento das User Stories pode prosseguir.

---

## Phase 3: User Story 1 - Acesso à Tela de Movimentações e Visualização Padrão (Priority: P1) 🎯 MVP

**Goal**: Permitir que o usuário autenticado acesse a tela `/movimentacoes` e veja suas transações financeiras carregadas em ordem decrescente de criação (`createdAt desc`), exibindo Nome, Valor, Natureza, Tipo e Categoria.

**Independent Test**: Acessar `/movimentacoes` com um usuário que possua movimentações cadastradas. As movimentações devem ser exibidas em modo Lista, ordenadas das mais recentes para as mais antigas, com os dados na ordem exata: Nome, Valor, Entrada/Despesa, Tipo (método) e Categoria. Caso não haja movimentações, deve exibir mensagem de estado vazio.

### Implementation for User Story 1

- [X] T009 [US1] Implementar a função `listarMovimentacoes({ userId, page, limit })` no Prisma com filtro `where: { userId }`, ordenação `orderBy: { createdAt: 'desc' }` e inclusão do relacionamento `include: { categoria: { select: { id: true, nome: true } } }` em `backend/src/services/movimentacoes.service.ts`
- [X] T010 [US1] Implementar o endpoint `GET /api/movimentacoes` com extração do `userId` do token JWT autenticado, repasse de paginação e retorno com status `200 OK` em `backend/src/api/routes/movimentacoes.routes.ts`
- [X] T011 [P] [US1] Implementar a chamada HTTP `listarMovimentacoes(filtros: FiltrosMovimentacoesDTO)` retornando `Promise<MovimentacoesPaginadasResponse>` via `api.get('/api/movimentacoes', { params })` em `frontend/src/services/movimentacao.service.ts`
- [X] T012 [P] [US1] Criar os estilos da lista de movimentações (tabela/linhas responsivas, badges de natureza, estado vazio) sem CSS inline em `frontend/src/components/MovimentacaoList/styles.ts`
- [X] T013 [US1] Criar o componente funcional `MovimentacaoList` renderizando as movimentações estritamente na ordem: Nome, Valor, Entrada ou Despesa, Tipo de Movimentação e Categoria, com estado vazio amigável em `frontend/src/components/MovimentacaoList/index.tsx`
- [X] T014 [US1] Integrar o carregamento inicial da listagem com tratamento de loading e renderização de `MovimentacaoList` na página `frontend/src/pages/Movimentacoes/index.tsx`

**Checkpoint**: User Story 1 funcional e testável de forma isolada (MVP entregue).

---

## Phase 4: User Story 2 - Alternância entre Modos de Visualização: Cards e Lista (Priority: P1)

**Goal**: Permitir ao usuário alternar a exibição entre formato de Cards e formato de Lista, com cards exibindo exclusivamente Nome, Valor e Entrada/Despesa, e inicialização adaptativa por dispositivo.

**Independent Test**: Acionar o botão alternador entre Cards e Lista. No modo Cards, verificar que aparecem apenas Nome, Valor e Entrada/Despesa; no modo Lista, aparecem todos os 5 campos. Verificar que em desktop a tela abre inicialmente como Lista e em smartphone abre inicialmente como Cards.

### Implementation for User Story 2

- [X] T015 [P] [US2] Criar os estilos dos cards de movimentações (grid responsivo, tipografia e badges de fluxo) sem CSS inline em `frontend/src/components/MovimentacaoCards/styles.ts`
- [X] T016 [US2] Criar o componente funcional `MovimentacaoCards` renderizando em cada card exclusivamente Nome, Valor formatado e Entrada ou Despesa em `frontend/src/components/MovimentacaoCards/index.tsx`
- [X] T017 [US2] Adicionar o controle de alternância (toggle Lista/Cards) e lógica de inicialização adaptativa (`window.innerWidth >= 768 ? 'list' : 'cards'`) em `frontend/src/pages/Movimentacoes/index.tsx` e `frontend/src/pages/Movimentacoes/styles.ts`

**Checkpoint**: Modos Cards e Lista funcionais com troca instantânea e responsividade adaptativa.

---

## Phase 5: User Story 3 - Filtragem por Categoria com Checkboxes (Priority: P1)

**Goal**: Permitir a filtragem das movimentações por uma ou múltiplas categorias selecionadas através de checkboxes interativos.

**Independent Test**: Marcar uma categoria: apenas itens dela aparecem. Marcar uma segunda categoria: itens de ambas aparecem. Desmarcar todas: itens de todas as categorias voltam a ser exibidos.

### Implementation for User Story 3

- [X] T018 [US3] Atualizar a query Prisma de `listarMovimentacoes` para aplicar filtro por array de categorias `categoriaId: { in: categoriaIds }` quando `categoriaIds` for fornecido em `backend/src/services/movimentacoes.service.ts`
- [X] T019 [US3] Atualizar o endpoint `GET /api/movimentacoes` para extrair o parâmetro `categorias` da query string (suportando string separada por vírgula ou array) e repassar ao serviço em `backend/src/api/routes/movimentacoes.routes.ts`
- [X] T020 [P] [US3] Criar os estilos do painel de filtros e componentes de checkboxes em `frontend/src/components/MovimentacoesFilters/styles.ts`
- [X] T021 [US3] Criar o componente funcional `MovimentacoesFilters` carregando as categorias do usuário via `listarCategorias()` e renderizando checkboxes com seleção única ou múltipla em `frontend/src/components/MovimentacoesFilters/index.tsx`
- [X] T022 [US3] Conectar o estado de categorias selecionadas de `MovimentacoesFilters` à atualização da listagem na página `frontend/src/pages/Movimentacoes/index.tsx`

**Checkpoint**: Filtragem por categorias com checkboxes funcionando de forma precisa.

---

## Phase 6: User Story 4 - Filtragem por Tipo de Movimentação e Natureza (Priority: P2)

**Goal**: Permitir ao usuário filtrar movimentações pelo método (Pix, Cartão, Dinheiro) e pelo fluxo (Entrada ou Despesa) via seletores de opção única (`<select>`).

**Independent Test**: Selecionar "Pix" no select de método -> apenas transações via Pix são exibidas. Selecionar "Despesa" no select de fluxo -> apenas despesas são exibidas. Selecionar "Todos" em ambos -> restrições removidas.

### Implementation for User Story 4

- [X] T023 [US4] Atualizar a função `listarMovimentacoes` no backend para aplicar filtros opcionais `tipo: TipoMovimentacao` e `metodoPagamento: MetodoPagamento` na cláusula `where` em `backend/src/services/movimentacoes.service.ts`
- [X] T024 [US4] Atualizar a validação e repasse de `tipo` e `metodoPagamento` na rota `GET /api/movimentacoes` em `backend/src/api/routes/movimentacoes.routes.ts`
- [X] T025 [US4] Adicionar campos de seleção `<select>` para Tipo de Movimentação (Pix, Cartão, Dinheiro) e Natureza (Entrada, Despesa) com opção padrão "Todos" em `frontend/src/components/MovimentacoesFilters/index.tsx`

**Checkpoint**: Filtros de método e natureza funcionais e combináveis com o filtro de categorias.

---

## Phase 7: User Story 5 - Filtragem por Período de Datas com Fallback e Toast (Priority: P2)

**Goal**: Permitir filtragem por período de datas (campo `data`), preenchendo automaticamente a data em branco com o dia atual caso apenas uma seja informada e disparando toast de alerta via `react-toastify` se a data final for no passado ou inconsistente.

**Independent Test**: Preencher apenas Data Inicial -> busca filtra de dataInicial até hoje. Preencher apenas Data Final no passado -> toast do `react-toastify` surge avisando sobre a data inválida e bloqueia a busca. Preencher Data Inicial maior que Data Final -> toast de alerta surge e bloqueia a busca.

### Implementation for User Story 5

- [X] T026 [US5] Atualizar `listarMovimentacoes` no backend para aplicar filtro temporal no campo `data` (`data: { gte: dataInicial, lte: dataFinal }`) considerando o início do dia para dataInicial (`00:00:00.000Z`) e fim do dia para dataFinal (`23:59:59.999Z`) em `backend/src/services/movimentacoes.service.ts`
- [X] T027 [US5] Adicionar inputs do tipo `date` para Data Inicial e Data Final no componente `frontend/src/components/MovimentacoesFilters/index.tsx`
- [X] T028 [US5] Implementar a lógica de validação temporal com fallback da data em branco para o dia atual e disparo de alertas visuais via `toast.error` do `react-toastify` para casos de intervalo invertido ou data final no passado em `frontend/src/components/MovimentacoesFilters/index.tsx`

**Checkpoint**: Filtro de datas com regras de fallback e alertas via `react-toastify` totalmente funcional.

---

## Phase 8: User Story 6 - Filtros Cumulativos, Paginação e Limpeza (Priority: P2)

**Goal**: Suportar aplicação combinada de todos os filtros (AND lógico), permitir redefinição completa dos filtros com um clique e oferecer carregamento incremental de registros sob demanda ("Carregar Mais").

**Independent Test**: Combinar Categoria + Tipo + Natureza + Datas e validar precisão dos resultados retornados. Clicar em "Limpar Filtros": todos os campos voltam ao estado neutro e a listagem completa é restaurada. Clicar em "Carregar Mais": próximo bloco de registros é anexado à lista/cards sem perder os itens anteriores.

### Implementation for User Story 6

- [X] T029 [US6] Implementar no backend suporte a paginação sob demanda em `listarMovimentacoes` retornando `{ items, total, page, limit, totalPages, hasMore }` com cálculo de `skip: (page - 1) * limit` e `take: limit` em `backend/src/services/movimentacoes.service.ts`
- [X] T030 [US6] Adicionar o botão "Limpar Filtros" no componente `frontend/src/components/MovimentacoesFilters/index.tsx` resetando checkboxes de categoria, selects e inputs de data
- [X] T031 [US6] Implementar botão "Carregar Mais" com indicador de carregamento e paginação incremental na página `frontend/src/pages/Movimentacoes/index.tsx`
- [X] T032 [US6] Implementar o estado vazio específico para filtros sem resultado ("Nenhuma movimentação encontrada para os filtros aplicados") com botão para limpar filtros na página `frontend/src/pages/Movimentacoes/index.tsx`

**Checkpoint**: Filtros cumulativos, botão de limpeza e paginação sob demanda funcionando de ponta a ponta.

---

## Phase 9: User Story 7 - Exclusão de Movimentação (Priority: P2)

**Goal**: Permitir ao usuário excluir qualquer uma de suas movimentações a partir de um botão/ícone no card ou na linha da lista, mediante diálogo de confirmação seguro.

**Independent Test**: Clicar no botão de excluir de uma movimentação -> modal de confirmação é exibido. Clicar em Cancelar -> nada é excluído. Clicar em Confirmar -> movimentação é removida do banco, desaparece da tela imediatamente e um toast de sucesso é emitido.

### Implementation for User Story 7

- [X] T033 [US7] Implementar a função `excluirMovimentacao({ id, userId }: { id: string; userId: string })` verificando propriedade no Prisma (`where: { id, userId }`) e retornando a movimentação excluída ou erro se não encontrada em `backend/src/services/movimentacoes.service.ts`
- [X] T034 [US7] Implementar o endpoint `DELETE /api/movimentacoes/:id` com retorno `204 No Content` ou `404 Not Found` em `backend/src/api/routes/movimentacoes.routes.ts`
- [X] T035 [P] [US7] Implementar a chamada HTTP `excluirMovimentacao(id: string)` via `api.delete('/api/movimentacoes/' + id)` em `frontend/src/services/movimentacao.service.ts`
- [X] T036 [P] [US7] Criar o componente modal de confirmação `ConfirmDeleteModal` com mensagem explicativa e botões de confirmação/cancelamento em `frontend/src/components/ConfirmDeleteModal/index.tsx` e `styles.ts`
- [X] T037 [US7] Integrar o fluxo de exclusão em `MovimentacaoList` e `MovimentacaoCards`, disparando o `ConfirmDeleteModal`, atualizando a lista em memória após sucesso e emitindo notificação via `toast.success`

**Checkpoint**: Exclusão de movimentações segura, com confirmação e feedback visual em tempo real.

---

## Phase 10: User Story 8 - Edição de Movimentação via Modal (Priority: P2)

**Goal**: Permitir que o usuário edite todos os campos de uma movimentação existente através de um modal com formulário pré-preenchido, persistindo as alterações somente após confirmação explícita.

**Independent Test**: Clicar no botão de editar de uma movimentação -> modal abre com os dados pré-preenchidos (Nome, Valor, Data, Tipo, Método e Categoria). Modificar dados e clicar em Cancelar -> nenhuma alteração é salva. Modificar dados e clicar em Salvar -> alterações persistidas no backend via `PUT`, modal fecha, listagem/card reflete os novos dados e `toast.success` é exibido.

### Implementation for User Story 8

- [X] T038 [US8] Implementar a função `atualizarMovimentacao({ id, userId, ...dados }: AtualizarMovimentacaoDTO)` com verificação de ownership e validação de `valor > 0` e campos obrigatórios em `backend/src/services/movimentacoes.service.ts`
- [X] T039 [US8] Implementar o endpoint `PUT /api/movimentacoes/:id` com validação de payload, retorno `200 OK`, `400 Bad Request` ou `404 Not Found` em `backend/src/api/routes/movimentacoes.routes.ts`
- [X] T040 [P] [US8] Implementar a chamada HTTP `atualizarMovimentacao(id: string, payload: AtualizarMovimentacaoDTO)` via `api.put('/api/movimentacoes/' + id, payload)` em `frontend/src/services/movimentacao.service.ts`
- [X] T041 [P] [US8] Criar os estilos do modal de edição (backdrop, formulário responsivo, botões de ação) sem CSS inline em `frontend/src/components/MovimentacaoEditModal/styles.ts`
- [X] T042 [US8] Criar o componente funcional `MovimentacaoEditModal` contendo os 6 campos editáveis pré-preenchidos, validação de campos antes do envio, botão "Salvar Alterações" e botão "Cancelar" em `frontend/src/components/MovimentacaoEditModal/index.tsx`
- [X] T043 [US8] Integrar `MovimentacaoEditModal` na página `frontend/src/pages/Movimentacoes/index.tsx`, acionado por botões de edição em `MovimentacaoList` e `MovimentacaoCards`, sincronizando o estado da listagem após salvar com sucesso

**Checkpoint**: Edição de movimentações via modal interativo totalmente concluída.

---

## Phase 11: Polish & Cross-Cutting Concerns

**Purpose**: Refinamentos estéticos, formatação de moeda/datas e validação global de qualidade.

- [X] T044 [P] Criar utilitários de formatação de moeda brasileira (`Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`) e formatação de datas em `frontend/src/utils/formatters.ts`
- [X] T045 Executar o roteiro de validação ponta a ponta dos 6 cenários documentados em `specs/005-listagem-movimentacoes/quickstart.md`
- [X] T046 Realizar verificação de aderência à Constituição do projeto: ausência de tipos `any`, ausência de `React.FC`, separação estrita de estilos em `styles.ts` e responsividade completa em larguras móveis (320px+)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sem dependências — execução imediata.
- **Foundational (Phase 2)**: Depende do Setup — **BLOQUEIA** todas as User Stories.
- **User Story 1 (Phase 3)**: Depende da Fase Foundational — entrega o **MVP**.
- **User Story 2 a 8 (Phases 4 a 10)**: Dependem da Fase Foundational e integram-se incrementalmente sobre a página de movimentações.
- **Polish (Phase 11)**: Depende da conclusão das User Stories.

### Parallel Opportunities

- Todas as tarefas marcadas com `[P]` operam em arquivos diferentes e podem ser desenvolvidas em paralelo (ex: criação de estilos `styles.ts`, tipos TypeScript e clientes de serviço).
- Tarefas de frontend e backend dentro de cada User Story que envolvam arquivos distintos podem prosseguir paralelamente após o alinhamento dos contratos da API.

---

## Implementation Strategy (MVP & Incremental Delivery)

1. **MVP (Fases 1, 2 e 3)**:
   - Instalação e rotas base.
   - Listagem básica das movimentações em formato Lista com ordenação decrescente por data de criação (`createdAt desc`).
   - Validação imediata: usuário loga e visualiza seu histórico na nova rota.
2. **Incremento de Apresentação (Fase 4)**:
   - Adiciona formato de Cards e alternador adaptativo por viewport.
3. **Incrementos de Filtros (Fases 5 a 8)**:
   - Checkboxes de categorias, selects de método/natureza, inputs de data com fallback automático, alertas `react-toastify` e botão "Carregar Mais".
4. **Incremento de Ações CRUD (Fases 9 e 10)**:
   - Exclusão com confirmação modal e edição completa via modal.
5. **Polimento Final (Fase 11)**:
   - Formatação consistente e auditoria da Constituição.
