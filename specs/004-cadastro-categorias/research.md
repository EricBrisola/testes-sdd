# Research: Cadastro de Categorias e Seleção em Movimentações

**Feature**: `004-cadastro-categorias`
**Date**: 2026-10-15
**Branch**: `004-cadastro-categorias`

---

## 1. Roteamento no Frontend (React Router DOM)

**Contexto**: A aplicação atualmente não possui sistema de roteamento. O `App.tsx` usa lógica condicional baseada em estado (`if (!user) return <Login />`) para alternar entre telas. A nova tela de categorias requer uma URL própria.

**Decision**: Adotar `react-router-dom` v7 para gerenciamento de rotas no frontend.

**Rationale**:
- `react-router-dom` é o padrão de mercado para SPAs React, amplamente mantido e documentado.
- Permite definir rotas declarativas (`/home`, `/categorias`) sem reescrever a lógica de autenticação existente.
- A proteção de rotas (PrivateRoute) mantém a verificação de autenticação já existente no `App.tsx`.
- Compatível com React 19 (versão 7 do react-router foi projetada para React 18+/19).
- Não viola a regra da Constituição de não adicionar dependências desnecessárias — o roteamento é uma necessidade real e fundamental para esta feature.

**Alternatives considered**:
- **Estado global / Context API para "troca de telas"**: Seria uma abordagem ad hoc sem URL, prejudicando UX (botão voltar do browser quebrado, sem deep link). Rejeitada.
- **Next.js (file-based routing)**: Exigiria migração do projeto inteiro. Fora de escopo e impacto desproporcional. Rejeitada.

---

## 2. Backend: Estrutura das Rotas de Categorias (CRUD)

**Contexto**: O backend usa Fastify com rotas RESTful. O modelo `Categoria` já existe no schema Prisma com campos `id`, `nome`, `userId`, `createdAt`, `updatedAt`. Existe um arquivo `categorias.routes.ts` e `categorias.service.ts` que foram criados anteriormente mas não estão registrados no `server.ts`.

**Decision**: Criar/completar um serviço completo de categorias com as operações: `listar`, `criar`, `atualizar` e `excluir`. Registrar a rota no `server.ts` com o prefixo `/api/categorias`. Toda rota protegida via JWT usando o mesmo padrão `addHook('onRequest', jwtVerify)` já usado em `movimentacoes.routes.ts`.

**Endpoints definidos**:
- `GET /api/categorias` — Lista todas as categorias do usuário autenticado, ordenadas por `nome ASC`
- `POST /api/categorias` — Cria uma nova categoria vinculada ao `userId` do JWT
- `PUT /api/categorias/:id` — Atualiza o nome de uma categoria (verifica ownership)
- `DELETE /api/categorias/:id` — Exclui uma categoria (verifica ownership e movimentações associadas)

**Rationale**:
- Seguir o padrão RESTful já estabelecido no projeto (`movimentacoes.routes.ts`).
- O `$transaction` do Prisma será utilizado nas operações de escrita, mantendo consistência com o padrão definido na spec 003.
- A verificação de `userId` em todas as operações de escrita/leitura garante isolamento de dados entre usuários.
- A ordenação `nome ASC` (ORDER BY) na query de listagem garante consistência alfabética sem depender do cliente.

**Alternatives considered**:
- **Ordenação no frontend**: Instável, depende do comportamento do cliente; rejeitada em favor de ordenação na query SQL.
- **PATCH em vez de PUT**: PATCH é semanticamente mais correto para atualizações parciais, mas dado que o único campo editável é `nome`, PUT simplificado é aceitável aqui.

---

## 3. Validação de Nome Duplicado

**Contexto**: O usuário não pode ter duas categorias com o mesmo nome. O schema Prisma atual não define `@@unique([nome, userId])`.

**Decision**: A validação de duplicidade será feita na camada de serviço (`categorias.service.ts`) via consulta `findFirst` antes de criar/atualizar. Não será adicionada constraint unique composta no banco de dados nesta feature para evitar migration adicional.

**Rationale**:
- A validação na camada de serviço é suficiente para o uso atual e evita uma nova migration `prisma db push`.
- A normalização do nome (trim) será aplicada antes da comparação para evitar duplicatas com espaços.
- A comparação de duplicidade será case-insensitive usando o operador `mode: 'insensitive'` do Prisma para maior robustez (ex: "alimentação" e "Alimentação" serão tratados como iguais).

**Alternatives considered**:
- **Constraint `@@unique` no Prisma**: Mais robusto a nível de banco, mas exige migration. Pode ser adicionado em uma feature futura de hardening. Adiado.

---

## 4. Frontend: Tabela de Categorias com Edição Inline

**Contexto**: A tela de categorias precisa exibir as categorias em formato de tabela com ícones de editar e excluir por linha. Ao clicar em editar, a linha entra em modo de edição inline.

**Decision**: Implementar o estado de edição inline com `useState` por linha identificado pelo `id` da categoria. O componente da tabela gerenciará um estado `editingId: string | null` — quando não `null`, a linha com aquele `id` renderiza um campo de texto em vez do nome. Dois ícones por linha (editar e excluir) usando SVGs inline ou biblioteca de ícones leve.

**Rationale**:
- Abordagem simples, sem dependência de bibliotecas de tabela complexas como `react-table`.
- `useState` local no componente de tabela é suficiente — sem necessidade de estado global.
- A confirmação de edição via `Enter` e cancelamento via `Escape` são comportamentos padrão esperados pelo usuário.
- Para ícones, utilizar SVGs inline (sem biblioteca extra) ou `react-icons` (lib muito pequena e amplamente usada). Será avaliado na implementação para não adicionar dependência se SVG inline cobrir o caso.

**Alternatives considered**:
- **Modal de edição**: Exigiria abrir uma janela separada, quebrando o fluxo da tabela. Rejeitada — o usuário explicitamente pediu edição inline.
- **react-table / tanstack-table**: Overhead desnecessário para uma tabela simples. Rejeitada.

---

## 5. Proteção do Isolamento de Dados (Ownership Check)

**Contexto**: Os endpoints PUT e DELETE de categorias devem garantir que o usuário só possa modificar/excluir suas próprias categorias.

**Decision**: Em todas as operações de escrita e exclusão, o service verificará se a categoria com o `id` informado pertence ao `userId` extraído do JWT. Se não pertencer (ou não existir), retornará `404 Not Found` — evitando vazar a informação de que a categoria existe mas pertence a outro usuário.

**Rationale**:
- Retornar `404` em vez de `403` em casos de acesso a recursos de outros usuários é uma prática de segurança recomendada (não revela a existência do recurso).
- A verificação no service mantém a lógica de negócio centralizada, fora dos controllers de rota.

---

## 6. Tratamento da Exclusão com Categoria em Uso

**Contexto**: O schema Prisma define `onDelete: Restrict` na relação `Movimentacao → Categoria`. Isso significa que o banco de dados lançará um erro se tentar excluir uma categoria com movimentações.

**Decision**: O service de exclusão capturará o erro de constraint do Prisma (`P2003` — Foreign key constraint failed) e o converterá em uma resposta `409 Conflict` com mensagem amigável ao usuário.

**Rationale**:
- A constraint `Restrict` já existe no schema e não precisa ser alterada.
- Capturar o código de erro específico do Prisma (`PrismaClientKnownRequestError` com code `P2003`) permite distinguir esse caso de outros erros de banco.
- Resposta `409 Conflict` é semanticamente correta para "operação não pode ser completada por conflito de estado".

---

## 7. Frontend: Integração do Select de Categorias no MovimentacaoForm

**Contexto**: O `MovimentacaoForm` atualmente usa `MOCK_CATEGORIA_ID`. Precisa ser substituído por uma busca real no backend (`GET /api/categorias`) e um `<Select>` dinâmico.

**Decision**: O componente `MovimentacaoForm` fará um `useEffect` para buscar as categorias via `GET /api/categorias` ao montar. O estado `categorias` será tipado como `Categoria[]`. O select exibirá as categorias retornadas (já ordenadas pelo backend). Se o array vier vazio, exibirá uma mensagem e um link para a página de categorias.

**Rationale**:
- A busca no mount garante que as categorias estarão disponíveis ao renderizar o formulário.
- Não há necessidade de cache ou estado global (Zustand, Context) para esta feature — a chamada ao mount é suficiente e simples.
- A ordenação alfabética será garantida pelo backend (ORDER BY nome ASC), não pelo frontend.

---

## 8. Ausência de react-router-dom: Estratégia de Instalação

**Contexto**: O `frontend/package.json` não possui `react-router-dom`. A instalação exige que o container Docker esteja rodando ou que seja feita localmente.

**Decision**: O `tasks.md` incluirá uma tarefa explícita para instalar `react-router-dom` no frontend e atualizar o `App.tsx` para usar `<BrowserRouter>` e componentes de `PrivateRoute`. A instalação será feita via `npm install react-router-dom` no diretório `frontend/`.

**Rationale**:
- Dependência necessária e justificada pela necessidade de múltiplas rotas com URLs distintas.
- Alinhado com a regra da Constituição: a dependência é necessária, não supérflua.

---

## 9. Criação de Categorias Padrão no Primeiro Acesso / Registro (Onboarding)

**Contexto**: A criação de movimentações exige obrigatoriamente um `categoriaId`. Para evitar que novos usuários se deparem com um formulário travado ou vazio no primeiro login, o sistema deve fornecer opções prévias.

**Decision**: No momento em que um usuário faz o primeiro login via Google OAuth e é cadastrado no banco (`auth.service.ts`), o Prisma criará automaticamente três categorias padrão: `"Alimentação"`, `"Lazer"` e `"Geral"`, usando a criação aninhada do Prisma (`categorias: { create: [...] }`). Adicionalmente, caso um usuário já cadastrado antes desta feature acerte a rota de listagem e não tenha categorias, uma rotina de fallback garantirá a criação das categorias iniciais.

**Rationale**:
- Reduz atrito no onboarding: o usuário novo pode registrar sua primeira movimentação imediatamente.
- Garante integridade referencial: a obrigatoriedade da FK `categoriaId` nunca é violada.
- As categorias padrão são vinculadas normalmente ao `userId` do usuário, podendo ser renomeadas ou excluídas no futuro em `/categorias`.
