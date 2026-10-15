# Research & Decisions: Cadastro de Movimentações

## 1. Modelagem do Tipo de Movimentação (Entrada/Saída)
**Questão:** Qual a melhor abordagem para armazenar o tipo (entrada ou saída)? Criar duas colunas booleanas, usar um Enum, ou criar uma tabela extra com Chave Estrangeira?

**Decisão:** Utilizar um `Enum` nativo do PostgreSQL (ou String com validação caso o DB não suporte nativamente, mas via Prisma usaremos Enum).

**Justificativa:** 
- Criar duas colunas booleanas (`is_entrada`, `is_saida`) abre margem para inconsistência de dados (ex: ambos serem true simultaneamente).
- Criar uma tabela extra e usar Chave Estrangeira (FK) é um exagero (overengineering) para um dado que possui apenas 2 estados fixos que dificilmente mudarão no futuro. Isso causaria JOINs desnecessários no banco de dados e deixaria as consultas mais lentas.
- O Enum garante que a coluna só aceite 'ENTRADA' ou 'SAIDA', mantendo a integridade a nível de banco de dados e sendo extremamente leve na consulta.

## 2. Modelagem do Método de Pagamento (Pix, Dinheiro, Cartão)
**Questão:** Qual a melhor abordagem para o tipo de pagamento?

**Decisão:** Utilizar um `Enum` (ex: `PIX`, `DINHEIRO`, `CARTAO`).

**Justificativa:**
- Pelos mesmos motivos do Tipo de Movimentação. Os métodos de pagamento básicos de um MVP são estáticos. Caso no futuro o sistema cresça para suportar métodos dinâmicos ou de terceiros, pode-se migrar para uma tabela, mas no momento um Enum é a abordagem mais performática e menos complexa.

## 3. Integridade de Dados em Transações
**Decisão:** Utilizar o `$transaction` do Prisma ORM.

**Justificativa:** O Prisma ORM possui suporte nativo a transações sequenciais ou interativas. Todas as rotas que realizarem operações de escrita no banco envolvendo múltiplas tabelas (ex: criar Movimentação e atualizar saldo da Conta/Categoria simultaneamente) deverão usar `prisma.$transaction` para garantir o princípio ACID.

## 4. UI/UX do Frontend
**Decisão:** Interface Minimalista e Componentizada com `styled-components`.

**Justificativa:**
- Utilização de Cards minimalistas para exibição.
- Formulários limpos com validação visual instantânea (cores neutras, bordas suaves, tipografia legível).
- Divisão rigorosa conforme a Constituição: Estrutura em `index.tsx` e estilos isolados em `styles.ts`.
- Componentes reaproveitáveis: `<Input />`, `<Select />`, `<Button />`, isolando toda lógica de negócio fora dos componentes puramente de interface.
