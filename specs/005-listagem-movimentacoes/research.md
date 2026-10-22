# Research & Technical Decisions: Listagem e Gestão de Movimentações

**Feature**: `005-listagem-movimentacoes`  
**Date**: 2026-10-22  
**Status**: Completed  

---

## 1. Notificações e Validação de Intervalo de Datas

- **Decision**: Utilizar a biblioteca `react-toastify` para emissão de notificações visuais, com foco especial no tratamento e alerta de inconsistências nos filtros de período de datas.
- **Rationale**: Requisito mandatório do usuário. A biblioteca `react-toastify` é o padrão da indústria no ecossistema React para feedback não bloqueante, acessível e personalizável, fornecendo suporte a temas claro/escuro e micro-animações coerentes com a estética moderna e minimalista do projeto.
- **Alternatives Considered**:
  - `alert()` nativo do browser: Rejeitado por ser bloqueante e visualmente antiquado.
  - Mensagens de erro em texto inline estático: Rejeitado porque a validação de regras temporais em filtros se beneficia de notificações flutuantes (toasts) que chamam a atenção imediata do usuário sem quebrar o alinhamento da grade de filtros.

---

## 2. Estratégia de Paginação e Filtragem de Dados

- **Decision**: Implementar a filtragem cumulativa e a paginação sob demanda no backend Fastify via Prisma ORM (`GET /api/movimentacoes`), combinando com paginação progressiva no frontend (botão "Carregar Mais" e rolagem fluida).
- **Rationale**:
  - Permite processar grandes históricos de transações no PostgreSQL sem sobrecarregar a memória do cliente ou transferir payloads excessivos pela rede.
  - O endpoint suportará os seguintes parâmetros de query:
    - `categoriaIds`: Array ou lista separada por vírgula de IDs de categorias selecionadas.
    - `tipo`: Valor único enum (`ENTRADA` ou `SAIDA`).
    - `metodoPagamento`: Valor único enum (`PIX`, `DINHEIRO` ou `CARTAO`).
    - `dataInicial`: Data no formato `YYYY-MM-DD` (início do dia: `00:00:00.000Z`).
    - `dataFinal`: Data no formato `YYYY-MM-DD` (fim do dia: `23:59:59.999Z`).
    - `page` (default 1) e `limit` (default 15 itens por página).
  - A ordenação padrão na query Prisma será `createdAt: 'desc'`.
- **Alternatives Considered**:
  - Filtragem 100% no cliente (carregar todo o banco de uma vez): Rejeitado porque à medida que o usuário cadastra centenas de movimentações, o tempo de carregamento inicial degrada e quebra a meta de resposta inferior a 500ms.
  - Paginação tradicional numerada (páginas 1, 2, 3...): Rejeitado em favor do "Carregar Mais" escolhido na clarificação interativa, que oferece uma experiência contínua e moderna (estilo extrato bancário).

---

## 3. Modal de Edição de Movimentação

- **Decision**: Criar um componente modal dedicado (`MovimentacaoEditModal`) controlado por estado, contendo os campos de edição pré-preenchidos (`nome`, `valor`, `data`, `tipo`, `metodoPagamento`, `categoriaId`), botão "Salvar Alterações" (disparando `PUT /api/movimentacoes/:id`) e botão "Cancelar".
- **Rationale**: Instrução direta do usuário ("um modal precisa ser aberto com os campos para serem editados e só será salvo a alteração caso o usuário confirme"). Um modal foca a atenção do usuário no preenchimento de todos os 6 atributos da movimentação, sem desconfigurar as linhas da lista ou os cards na tela principal.
- **Alternatives Considered**:
  - Edição inline diretamente na linha/card: Rejeitada porque uma movimentação possui múltiplos campos obrigatórios e seletores, o que tornaria a linha excessivamente densa e inacessível em telas móveis.
  - Redirecionar para uma página `/movimentacoes/:id/editar`: Rejeitado por gerar navegação desnecessária e perda de contexto dos filtros previamente aplicados.

---

## 4. Confirmação de Exclusão de Movimentação

- **Decision**: Implementar diálogo de confirmação amigável (`ConfirmModal` ou alerta contextual estilizado) antes de executar a exclusão via `DELETE /api/movimentacoes/:id`.
- **Rationale**: Atende à User Story 7 e a FR-017, prevenindo a perda acidental de registros financeiros. A exclusão remove a movimentação imediatamente da tela sem necessidade de recarregar a página inteira.
- **Alternatives Considered**:
  - Exclusão imediata com opção "Desfazer" temporária: Rejeitado por exigir maior complexidade de armazenamento temporário e reversão transacional no backend.

---

## 5. Alternância Adaptativa entre Cards e Lista

- **Decision**: Criar componentes de apresentação específicos `MovimentacaoCardList` e `MovimentacaoTableList`, orquestrados pelo estado `viewMode: 'cards' | 'list'`.
  - Padrão desktop (largura ≥ 768px): modo **Lista**.
  - Padrão mobile (largura < 768px): modo **Cards**.
  - No modo Lista, a ordem das informações segue rigorosamente: **Nome**, **Valor**, **Entrada ou Despesa**, **Tipo (Método)** e **Categoria**, finalizando com ações de editar e excluir.
  - No modo Cards, as informações visíveis são exclusivamente: **Nome**, **Valor**, **Entrada ou Despesa**, acompanhadas dos botões de ação (editar e excluir).
- **Rationale**: Atende rigorosamente a FR-003, FR-004, FR-005 e às decisões de clarificação.

---

## 6. Lógica de Fallback de Datas nos Filtros

- **Decision**: A lógica de preenchimento automático das datas faltantes será executada no momento do disparo do filtro:
  1. Se `dataInicial` e `dataFinal` informadas:
     - Se `dataInicial > dataFinal`: dispara `toast.error("A data inicial não pode ser maior que a data final.")` e aborta a busca.
  2. Se apenas `dataInicial` informada:
     - `dataFinal` assume automaticamente a data atual (`new Date().toISOString().split('T')[0]`).
  3. Se apenas `dataFinal` informada:
     - Se `dataFinal < hoje`: dispara `toast.error("A data final não pode ser anterior à data de hoje quando a data inicial não for informada.")` e aborta a busca.
     - Se `dataFinal >= hoje`: `dataInicial` assume automaticamente a data atual.
  4. Se ambas vazias: nenhum filtro temporal é aplicado.
- **Rationale**: Garante 100% de conformidade com as regras de negócio e com a Clarificação 5.
