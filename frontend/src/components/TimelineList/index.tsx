import type { UltimaMovimentacaoDTO } from '../../types/dashboard';
import { formatarMoeda } from '../../utils/formatters';
import {
  TimelineCard,
  TimelineHeader,
  TimelineTitle,
  TimelineSubtitle,
  ListContainer,
  TimelineItem,
  ItemLeftSection,
  NodeDot,
  ItemInfo,
  ItemName,
  ItemMethodBadge,
  ItemValue,
  EmptyState
} from './styles';

export interface TimelineListProps {
  movimentacoes: UltimaMovimentacaoDTO[];
}

export default function TimelineList({ movimentacoes }: TimelineListProps) {
  const hasData = movimentacoes && movimentacoes.length > 0;

  return (
    <TimelineCard data-testid="timeline-list">
      <TimelineHeader>
        <TimelineTitle>Últimas Movimentações</TimelineTitle>
        <TimelineSubtitle>Histórico das 20 transações mais recentes registradas</TimelineSubtitle>
      </TimelineHeader>

      {!hasData ? (
        <EmptyState>Nenhuma movimentação registrada recentemente.</EmptyState>
      ) : (
        <ListContainer>
          {movimentacoes.slice(0, 20).map((mov) => {
            const prefixo = mov.tipo === 'ENTRADA' ? '+ ' : '- ';
            return (
              <TimelineItem key={mov.id}>
                <ItemLeftSection>
                  <NodeDot $tipo={mov.tipo} />
                  <ItemInfo>
                    <ItemName title={mov.nome}>{mov.nome}</ItemName>
                    <ItemMethodBadge>{mov.metodoRotulo}</ItemMethodBadge>
                  </ItemInfo>
                </ItemLeftSection>

                <ItemValue $tipo={mov.tipo}>
                  {prefixo}{formatarMoeda(mov.valor)}
                </ItemValue>
              </TimelineItem>
            );
          })}
        </ListContainer>
      )}
    </TimelineCard>
  );
}

