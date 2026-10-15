# Tasks: Cadastro de Categorias e Seleção em Movimentações

**Feature**: `004-cadastro-categorias`
**Branch**: `004-cadastro-categorias`
**Specification**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md) | **Data Model**: [data-model.md](./data-model.md) | **Contracts**: [contracts/api.md](./contracts/api.md)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Instalação de dependências e inicialização dos tipos e serviços base compartilhados.

- [X] T001 Instalar a dependência `react-router-dom` no projeto frontend executando `npm install react-router-dom` em `frontend/package.json`
- [X] T002 [P] Criar os tipos TypeScript compartilhados (`Categoria`, `CriarCategoriaPayload`, `AtualizarCategoriaPayload`) em `frontend/src/types/categoria.ts`
- [X] T003 [P] Criar o arquivo base de serviço HTTP de categorias com cliente Axios em `frontend/src/services/categoria.service.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Estrutura base de rotas no backend, categorias padrão no onboarding e configuração de roteamento SPA no frontend que bloqueiam as User Stories.

**⚠️ CRITICAL**: Nenhuma User Story pode ser iniciada antes da conclusão desta fase.

- [X] T004 Criar o arquivo de serviço base com client Prisma em `backend/src/services/categorias.service.ts`
- [X] T005 [P] Criar o arquivo de rotas com hook de autenticação JWT `request.jwtVerify()` em `backend/src/api/routes/categorias.routes.ts`
- [X] T006 Registrar o plugin de rotas de categorias sob o prefixo `/api/categorias` em `backend/src/api/server.ts`
- [X] T007 Atualizar a criação de novos usuários em `backend/src/services/auth.service.ts` para cadastrar automaticamente as categorias padrão ('Alimentação', 'Lazer', 'Geral') via criação aninhada no Prisma
- [X] T008 Configurar a infraestrutura de roteamento com `BrowserRouter`, `Routes` e `Route` para as páginas da aplicação em `frontend/src/App.tsx`

**Checkpoint**: Infraestrutura pronta — desenvolvimento das User Stories pode prosseguir.

---

## Phase 3: User Story 1 - Cadastro de Nova Categoria (Priority: P1) 🎯 MVP

**Goal**: Permitir que um usuário autenticado cadastre uma nova categoria com validação de nome obrigatório não-vazio e bloqueio de nomes duplicados, persistindo vinculada ao `userId`.

**Independent Test**: Acessar a tela de categorias, preencher o formulário com `Transporte` e submeter. A categoria deve ser salva com sucesso no banco de dados vinculada ao usuário autenticado, o campo deve ser limpo e um feedback visual apresentado. Submissões vazias ou duplicadas devem ser bloqueadas com mensagens explicativas.

### Implementation for User Story 1

- [X] T009 [US1] Implementar a função `criarCategoria({ nome, userId }: CriarCategoriaDTO)` com normalização `.trim()`, validação de nome obrigatório "Não pode ser vazio ou apenas espaços" e verificação de duplicidade case-insensitive via `findFirst` (`mode: 'insensitive'`) persistindo vinculada a `userId: string` em `backend/src/services/categorias.service.ts`
- [X] T010 [US1] Implementar o endpoint `POST /api/categorias` com validação de payload, extração do `userId` a partir do JWT autenticado e retorno de status `201 Created`, `400 Bad Request` ou `409 Conflict` em `backend/src/api/routes/categorias.routes.ts`
- [X] T011 [P] [US1] Implementar a chamada HTTP `criarCategoria(payload: CriarCategoriaPayload)` via `api.post('/api/categorias', payload)` em `frontend/src/services/categoria.service.ts`
- [X] T012 [P] [US1] Criar os estilos do formulário de criação de categoria sem CSS inline em `frontend/src/components/CategoriaForm/styles.ts`
- [X] T013 [US1] Criar o componente funcional `CategoriaForm` com campo de texto para o nome, validação para impedir envio de texto vazio/espaços, botão "Criar", limpeza do input e feedback visual de sucesso/erro em `frontend/src/components/CategoriaForm/index.tsx`

**Checkpoint**: User Story 1 (Cadastro de Categoria) funcional e testável de forma isolada.

---

## Phase 4: User Story 2 - Visualização de Categorias em Tabela (Priority: P1)

**Goal**: Exibir todas as categorias do usuário autenticado em formato de tabela ordenada alfabeticamente abaixo do formulário de criação.

**Independent Test**: Acessar a rota de categorias com categorias existentes e verificar se são renderizadas em tabela ordenada alfabeticamente. Se não houver categorias, verificar exibição do estado vazio ("Nenhuma categoria cadastrada ainda").

### Implementation for User Story 2

- [X] T014 [US2] Implementar a função `listarCategorias(userId: string)` consultando o Prisma filtrado por `where: { userId }` e ordenado por `orderBy: { nome: 'asc' }` (com garantia de seed das categorias padrão se o usuário não possuir nenhuma) em `backend/src/services/categorias.service.ts`
- [X] T015 [US2] Implementar o endpoint `GET /api/categorias` extraindo `userId` do token JWT autenticado e retornando a lista com status `200 OK` em `backend/src/api/routes/categorias.routes.ts`
- [X] T016 [P] [US2] Implementar a função `listarCategorias()` via `api.get<Categoria[]>('/api/categorias')` em `frontend/src/services/categoria.service.ts`
- [X] T017 [P] [US2] Criar os estilos da tabela de categorias (cabeçalho, linhas responsivas, estado vazio) sem CSS inline em `frontend/src/components/CategoriaTable/styles.ts`
- [X] T018 [US2] Criar o componente funcional `CategoriaTable` renderizando a lista de categorias em tabela responsiva com colunas de Nome e Ações, além do estado vazio informativo em `frontend/src/components/CategoriaTable/index.tsx`
- [X] T019 [P] [US2] Criar os estilos da página de categorias em `frontend/src/pages/Categorias/styles.ts`
- [X] T020 [US2] Criar o componente funcional de página `Categorias` integrando `CategoriaForm` e `CategoriaTable`, mantendo sincronizado o estado da lista após novas criações em `frontend/src/pages/Categorias/index.tsx`

**Checkpoint**: User Stories 1 e 2 funcionais e integradas na tela de gerenciamento de categorias.

---

## Phase 5: User Story 3 - Edição Inline de Categoria (Priority: P2)

**Goal**: Permitir que o usuário edite o nome de uma categoria diretamente na linha da tabela através de um input inline, com salvamento e cancelamento intuitivos.

**Independent Test**: Na tabela de categorias, clicar no ícone de editar em uma linha: o nome vira um input preenchido. Digitar novo nome e pressionar Enter -> persiste alteração no banco e atualiza a linha. Pressionar Escape -> cancela e restaura o nome original.

### Implementation for User Story 3

- [X] T021 [US3] Implementar a função `atualizarCategoria({ id, nome, userId }: AtualizarCategoriaDTO)` verificando se a categoria pertence ao `userId` (retorna 404 se não pertencer), validando nome não-vazio e ausência de duplicidade (desconsiderando o próprio id) via `$transaction` em `backend/src/services/categorias.service.ts`
- [X] T022 [US3] Implementar o endpoint `PUT /api/categorias/:id` com validação de parâmetros de rota, extração de `userId` e retornos `200 OK`, `400 Bad Request`, `404 Not Found` ou `409 Conflict` em `backend/src/api/routes/categorias.routes.ts`
- [X] T023 [P] [US3] Implementar a função `atualizarCategoria(id: string, payload: AtualizarCategoriaPayload)` via `api.put<Categoria>('/api/categorias/' + id, payload)` em `frontend/src/services/categoria.service.ts`
- [X] T024 [US3] Atualizar `frontend/src/components/CategoriaTable/index.tsx` adicionando suporte a edição inline com estado `editingId`, `editingName`, confirmação via tecla Enter ou botão salvar, e cancelamento via tecla Escape ou botão cancelar
- [X] T025 [P] [US3] Atualizar os estilos dos campos de edição inline e ícones de ação de salvar/cancelar em `frontend/src/components/CategoriaTable/styles.ts`

**Checkpoint**: Edição inline de categorias funcional e persistindo alterações com integridade.

---

## Phase 6: User Story 4 - Exclusão de Categoria (Priority: P2)

**Goal**: Permitir que o usuário exclua categorias diretamente pela tabela, garantindo que categorias com movimentações vinculadas não sejam removidas (retornando `409 Conflict`).

**Independent Test**: Clicar no ícone de excluir em uma categoria sem movimentações -> categoria excluída do banco e removida da tabela. Tentar excluir categoria vinculada a movimentações existentes -> sistema exibe mensagem amigável de bloqueio e mantém a categoria.

### Implementation for User Story 4

- [X] T026 [US4] Implementar a função `excluirCategoria({ id, userId }: ExcluirCategoriaDTO)` verificando ownership por `userId` e capturando o erro `P2003` do Prisma (Foreign key constraint failed da relação `Restrict` com `Movimentacao`), mapeando-o para erro de conflito em `backend/src/services/categorias.service.ts`
- [X] T027 [US4] Implementar o endpoint `DELETE /api/categorias/:id` retornando `204 No Content`, `404 Not Found` ou `409 Conflict` ("Não é possível excluir esta categoria pois ela possui movimentações vinculadas") em `backend/src/api/routes/categorias.routes.ts`
- [X] T028 [P] [US4] Implementar a função `excluirCategoria(id: string)` via `api.delete('/api/categorias/' + id)` em `frontend/src/services/categoria.service.ts`
- [X] T029 [US4] Atualizar `frontend/src/components/CategoriaTable/index.tsx` adicionando botão de exclusão por linha com confirmação, remoção imediata da linha após exclusão bem-sucedida e feedback visual amigável quando receber status 409
- [X] T030 [P] [US4] Atualizar estilos dos botões de ação e alertas visuais de conflito de exclusão em `frontend/src/components/CategoriaTable/styles.ts`

**Checkpoint**: Ciclo CRUD de categorias completo no backend e frontend.

---

## Phase 7: User Story 5 - Seleção de Categoria na Tela de Movimentações (Priority: P1)

**Goal**: Preencher dinamicamente o campo `<Select>` de categorias no formulário de criação de movimentações com as categorias do usuário em ordem alfabética (incluindo as categorias padrão criadas no onboarding), substituindo o mock anterior.

**Independent Test**: Acessar com um novo usuário autenticado: o select já deve exibir as categorias padrão ('Alimentação', 'Geral', 'Lazer') ordenadas alfabeticamente. Ao selecionar uma e preencher a movimentação, os dados devem ser salvos vinculados a essa categoria.

### Implementation for User Story 5

- [X] T031 [US5] Atualizar o componente funcional `MovimentacaoForm` em `frontend/src/components/MovimentacaoForm/index.tsx` para buscar categorias reais via `listarCategorias()` no carregamento (`useEffect`), removendo o `MOCK_CATEGORIA_ID`
- [X] T032 [US5] Conectar as opções do `<Select>` com a lista dinâmica de categorias ordenadas alfabeticamente e tratar o estado vazio (caso todas tenham sido excluídas) exibindo um atalho/link para a tela `/categorias` em `frontend/src/components/MovimentacaoForm/index.tsx`
- [X] T033 [P] [US5] Atualizar os estilos do `<Select>` e do link de atalho para categorias sem CSS inline em `frontend/src/components/MovimentacaoForm/styles.ts`

**Checkpoint**: Formulário de movimentações conectado dinamicamente com as categorias reais do usuário.

---

## Phase 8: User Story 6 - Navegação entre Telas (Priority: P2)

**Goal**: Disponibilizar barra de navegação responsiva para permitir alternância fluida entre a tela principal de Movimentações e a tela de Categorias.

**Independent Test**: Clicar no link "Categorias" no cabeçalho -> direciona para `/categorias`. Clicar no link "Movimentações" (ou início) -> retorna para a tela principal `/`.

### Implementation for User Story 6

- [X] T034 [P] [US6] Criar os estilos da barra de navegação com layout responsivo mobile-first sem CSS inline em `frontend/src/components/Navbar/styles.ts`
- [X] T035 [US6] Criar o componente funcional `Navbar` com links declarativos do `react-router-dom` para `/` (Movimentações) e `/categorias` (Categorias) e botão de Logout em `frontend/src/components/Navbar/index.tsx`
- [X] T036 [US6] Integrar o componente `Navbar` na página principal em `frontend/src/pages/Home.tsx` e na página de categorias em `frontend/src/pages/Categorias/index.tsx`

**Checkpoint**: Navegação completa entre todas as rotas autenticadas da aplicação.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Testes unitários automatizados, validação ponta a ponta e auditoria de conformidade com a Constituição.

- [X] T037 [P] Criar testes unitários para as operações do serviço de categorias (`criar`, `listar`, `atualizar`, `excluir`, bloqueio de duplicidade, criação de categorias padrão e erro Restrict) em `backend/tests/unit/categorias.service.test.ts`
- [X] T038 [P] Criar testes unitários para renderização e validações dos componentes `CategoriaForm` e `CategoriaTable` em `frontend/tests/unit/CategoriaComponents.test.tsx`
- [X] T039 Executar suíte de testes com `npm test` no backend e frontend para validar que não há regressões nem falhas
- [X] T040 Validar todos os 8 cenários de teste manuais e comandos cURL descritos em `specs/004-cadastro-categorias/quickstart.md`
- [X] T041 Realizar auditoria de conformidade com a Constituição garantindo ausência de `any`, ausência de `React.FC`, presença de arquivos `styles.ts` isolados e ausência de código depreciado

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sem dependências — pode iniciar imediatamente.
- **Foundational (Phase 2)**: Depende da conclusão do Setup — **BLOQUEIA** todas as User Stories.
- **User Stories (Phases 3 a 8)**:
  - **US1 (P1 - Cadastro)**: Depende da Phase 2. Pode ser entregue como MVP inicial.
  - **US2 (P1 - Listagem em Tabela)**: Depende da Phase 2 e integra com US1 na página `Categorias`.
  - **US3 (P2 - Edição Inline)**: Depende de US2 (Tabela de Categorias onde o input inline é renderizado).
  - **US4 (P2 - Exclusão)**: Depende de US2 (Tabela de Categorias onde o botão de exclusão é renderizado).
  - **US5 (P1 - Seleção em Movimentações)**: Depende de US2 (endpoint `GET /api/categorias` funcional) e da criação de categorias padrão no onboarding.
  - **US6 (P2 - Navegação)**: Depende de US1 e US5 para alternância de telas.
- **Polish (Phase 9)**: Depende de todas as User Stories estarem implementadas.

### Parallel Opportunities

- **Phase 1**: `T002` e `T003` podem ser executados em paralelo.
- **Phase 2**: `T005` pode ser executado em paralelo com `T004`.
- **Phase 3 (US1)**: `T011` e `T012` podem ser executados em paralelo após `T010`.
- **Phase 4 (US2)**: `T016`, `T017` e `T019` podem ser executados em paralelo após `T015`.
- **Phase 5 (US3)**: `T023` e `T025` podem ser desenvolvidos em paralelo após `T022`.
- **Phase 6 (US4)**: `T028` e `T030` podem ser desenvolvidos em paralelo após `T027`.
- **Phase 9**: `T037` e `T038` podem ser executados em paralelo.
