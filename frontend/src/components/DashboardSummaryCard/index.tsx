import type { ResumoFinanceiroGeralDTO } from '../../types/dashboard';
import { formatarMoeda } from '../../utils/formatters';
import {
  SummaryCardContainer,
  SummaryItem,
  SummaryLabel,
  SummaryValue,
  StatusPill
} from './styles';

export interface DashboardSummaryCardProps {
  resumo: ResumoFinanceiroGeralDTO;
}

export default function DashboardSummaryCard({ resumo }: DashboardSummaryCardProps) {
  const isSaldoPositivo = resumo.saldo >= 0;

  return (
    <SummaryCardContainer data-testid="dashboard-summary-card">
      <SummaryItem>
        <SummaryLabel>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            <polyline points="17 6 23 6 23 12" />
          </svg>
          Total de Receitas
        </SummaryLabel>
        <SummaryValue $variant="entrada">
          {formatarMoeda(resumo.totalEntradas)}
        </SummaryValue>
      </SummaryItem>

      <SummaryItem>
        <SummaryLabel>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
            <polyline points="17 18 23 18 23 12" />
          </svg>
          Total de Despesas
        </SummaryLabel>
        <SummaryValue $variant="saida">
          {formatarMoeda(resumo.totalSaidas)}
        </SummaryValue>
      </SummaryItem>

      <SummaryItem>
        <SummaryLabel>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={isSaldoPositivo ? '#2563eb' : '#dc2626'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          Saldo Acumulado
          <StatusPill $isPositive={isSaldoPositivo}>
            {isSaldoPositivo ? 'Superávit' : 'Déficit'}
          </StatusPill>
        </SummaryLabel>
        <SummaryValue $variant={isSaldoPositivo ? 'saldoPositivo' : 'saldoNegativo'}>
          {formatarMoeda(resumo.saldo)}
        </SummaryValue>
      </SummaryItem>
    </SummaryCardContainer>
  );
}

