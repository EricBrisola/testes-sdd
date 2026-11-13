# Technical Research & Architecture Decisions: Movimentações Parceladas

**Feature**: `007-parcelamento-movimentacoes`  
**Date**: 2026-11-12  
**Status**: Completed

---

## 1. Modelagem de Dados para Agrupamento de Parcelas

### Contexto
Cada compra ou receita parcelada gera entre 2 e 24 movimentações financeiras individuais no sistema (cada uma com sua respectiva data de vencimento e valor fracionado). As movimentações de uma mesma série precisam estar vinculadas entre si para permitir sincronização de dados e exclusão em lote, além de serem identificadas rapidamente pelo frontend e backend.

### Decisão
Adicionar campos específicos diretamente no modelo `Movimentacao` no Prisma schema:
- `isParcela: Boolean` (padrão `false`): indica se a movimentação é parte de um parcelamento.
- `parcelamentoId: String?` (UUID nullable): identificador único compartilhado por todas as parcelas de um mesmo grupo.
- `numeroParcela: Int?` (nullable): número ordinal da parcela atual (ex: 1, 2, ..., N).
- `totalParcelas: Int?` (nullable): quantidade total de parcelas da série (ex: 12).
- Índice de busca: `@@index([parcelamentoId])` e `@@index([userId, parcelamentoId])` para garantir performance O(1)/O(log N) em operações em cascata.

### Justificativa
- **Simplicidade e Performance**: Evita a sobrecarga de criar uma tabela adicional separada (`ParcelamentoGroup`) e realizar múltiplos `JOIN`s desnecessários nas telas de listagem e dashboard existentes (que já leem diretamente de `Movimentacao`).
- **Compatibilidade Retroativa**: Todas as movimentações já existentes no banco continuam válidas com `isParcela = false`, `parcelamentoId = null`, sem necessidade de scripts de migração complexos ou perda de dados.
- **Filtros e Consultas Rápidas**: Operações de busca, contagem e verificação rápida de vínculo podem ser feitas em uma única consulta direta por `parcelamentoId`.

### Alternativas Avaliadas
- *Criar tabela `Parcelamento` com relação 1:N com `Movimentacao`*: Descartada para este momento pois introduziria maior overhead de migração e queries mais pesadas para listar movimentações, sem ganho funcional significativo para os requisitos atuais.
- *Identificação apenas por sufixo de texto no nome `(1/N)`*: Rejeitada por fragilidade: se o usuário alterasse o nome, o vínculo seria corrompido, e consultas em lote seriam ineficientes (`LIKE '%(1/10)'`).

---

## 2. Transações Atômicas no Backend com Prisma (`prisma.$transaction`)

### Contexto
Conforme exigido pelo usuário e pelas boas práticas de integridade de dados financeiros, qualquer operação que envolva parcelas (criação em lote, edição sincronizada de grupo ou exclusão total) precisa garantir **atomicidade** (propriedade ACID): se uma parcela falhar, toda a operação deve ser desfeita, impedindo registros órfãos ou inconsistências de saldo.

### Decisão
Utilizar `prisma.$transaction` do Prisma Client em três fluxos principais:

1. **Criação de Parcelas**:
   - Criação de um UUID único para o `parcelamentoId`.
   - Montagem de um array com os N objetos de dados das parcelas.
   - Execução atômica via `prisma.movimentacao.createMany` ou array de `prisma.movimentacao.create` envelopados em `$transaction`.
2. **Exclusão de Parcelas**:
   - Verificação se a movimentação alvo tem `isParcela === true` e possui `parcelamentoId`.
   - Se for parcela única/não parcelada: exclusão pontual por `id`.
   - Se for parcela agrupada: `prisma.movimentacao.deleteMany({ where: { parcelamentoId: existing.parcelamentoId, userId } })` dentro de `$transaction`.
3. **Edição Sincronizada de Parcelas**:
   - Verificação do registro e busca de todas as parcelas do mesmo `parcelamentoId` ordenadas por `numeroParcela`.
   - Cálculo da diferença de dias caso a data da parcela editada tenha sido modificada (`deltaMs = novaData.getTime() - dataOriginal.getTime()`).
   - Se houver alteração de campos compartilhados (`nome`, `categoriaId`, `tipo`, `metodoPagamento`, `valor`):
     - Atualização de todas as parcelas irmãs com os novos valores compartilhados.
     - Preservação da formatação ordinal do nome `[NovoNomeBase] (X/N)`.
   - Se houver alteração de data:
     - A parcela editada assume a nova data informada.
     - As parcelas posteriores ($j > i$) têm suas datas acrescidas de `deltaMs` dias.
   - Todas as atualizações são executadas dentro de um único bloco `prisma.$transaction`.

### Justificativa
Garante 100% de consistência sem possibilidade de estados intermediários incorretos, atendendo explicitamente ao requisito do usuário: *"caso tenha uma exclusao ou alteração de dado da parcela, precisa estar envolvido em transaction"*.

---

## 3. Algoritmo de Cálculo de Parcelas e Resíduo de Centavos

### Contexto
A divisão de valores monetários pode resultar em dízimas ou centavos fracionários (ex: R$ 100,00 ÷ 3 = R$ 33,333333...).

### Decisão
1. Valor base da parcela:
   $$\text{valorParcela} = \lfloor \frac{\text{valorTotal}}{N} \times 100 \rfloor \div 100$$
2. Soma acumulada base:
   $$\text{somaBase} = \text{valorParcela} \times N$$
3. Resíduo de centavos:
   $$\text{residuo} = \text{round}(\text{valorTotal} - \text{somaBase}, 2)$$
4. A primeira parcela ($i = 1$) recebe $\text{valorParcela} + \text{residuo}$, e todas as demais ($i > 1$) recebem $\text{valorParcela}$.
5. Dessa forma, $\sum_{i=1}^N \text{parcela}_i \equiv \text{valorTotal}$ com exatidão matemática absoluta.

---

## 4. Algoritmo de Deslocamento Temporal (Datas das Parcelas)

### Criação Inicial
- Parcela 1 ($i = 1$): data base informada no formulário.
- Parcela $i$ ($i > 1$): 1 mês civil após a parcela anterior.
- Tratamento de fim de mês: se a data inicial for dia 31 e o mês seguinte tiver 28/30 dias, a data é fixada no último dia do mês correspondente, evitando saltos indesejados.

### Edição com Deslocamento de Dias
- Se a parcela de ordem $k$ tiver sua data alterada de $D_{antiga}$ para $D_{nova}$, a diferença em milissegundos é:
  $$\Delta = D_{nova}.getTime() - D_{antiga}.getTime()$$
- Para toda parcela $j$ pertencente ao mesmo `parcelamentoId`:
  - Se $j < k$: a data permanece inalterada (vencimentos passados já consolidados não sofrem impacto retroativo).
  - Se $j = k$: a data torna-se $D_{nova}$.
  - Se $j > k$: a nova data torna-se $\text{novaData}_j = \text{dataOriginal}_j + \Delta$.

---

## 5. Arquitetura da Interface e Layout Flexível sem Quebra

### Contexto
O usuário instruiu: *"onde o input da parcela vai aparecer, os outros dois inputs não podem quebrar"*.

### Diagnóstico do Formulário Atual
Atualmente, os inputs de Valor e Data compartilham um container `<Row>` em `frontend/src/components/MovimentacaoForm/styles.ts`:
```tsx
export const Row = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;
```
Dentro de `Row`, cada `<Input>` possui um container estilizado próprio com `width: 100%`. Se um terceiro campo `<Select>` for adicionado diretamente sem dimensionamento flexível explícito, os inputs poderiam sofrer quebras de linha ou cortes de rótulo.

### Decisão de Design e Layout
1. **Container Especializado**:
   Criar um componente estilizado específico para a linha de valores e vencimento (ex: `InstallmentRow` ou aprimorar `Row`) com:
   ```ts
   export const DynamicFieldsRow = styled.div`
     display: flex;
     gap: 0.75rem;
     width: 100%;
     align-items: flex-start;

     & > div {
       flex: 1 1 0;
       min-width: 0; // Previne overflow e quebra de layout de flexbox
     }

     @media (max-width: 580px) {
       flex-direction: column;
       gap: 1rem;

       & > div {
         width: 100%;
       }
     }
   `;
   ```
2. **Checkbox de Controle**:
   - Inserir um checkbox customizado e acessível `"Parcelar movimentação"` com label estilizado em arquivo `styles.ts` separado.
   - Posicionado antes da linha de valores ou diretamente integrado de forma limpa.
3. **Comportamento Transicional**:
   - Quando o checkbox estiver **desmarcado**: os 2 inputs (Valor e Data) dividem a largura total em 50% cada (`flex: 1 1 0`).
   - Quando o checkbox estiver **marcado**: o Select de Parcelas (2x a 24x) surge no meio, e os 3 campos (Valor, Parcelas, Data) dividem proporcionalmente a linha em ~33% cada (`flex: 1 1 0`), mantendo harmonia estética, espaçamento equilibrado de `0.75rem` e zero overflow.
   - Em telas pequenas (< 580px): todos os campos transicionam para empilhamento vertical limpo de largura total (100%), respeitando o princípio de responsividade da Constituição.

