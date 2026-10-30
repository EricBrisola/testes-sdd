import { render, screen } from '@testing-library/react';
import DashboardSummaryCard from '../../src/components/DashboardSummaryCard';
import type { ResumoFinanceiroGeralDTO } from '../../src/types/dashboard';

describe('DashboardSummaryCard Component', () => {
  it('renderiza os montantes de entradas, saídas e saldo positivo com badge de Superávit', () => {
    const resumo: ResumoFinanceiroGeralDTO = {
      totalEntradas: 12500.5,
      totalSaidas: 4320.0,
      saldo: 8180.5
    };

    render(<DashboardSummaryCard resumo={resumo} />);

    expect(screen.getByText('Total de Entradas')).toBeInTheDocument();
    expect(screen.getByText('Total de Saídas')).toBeInTheDocument();
    expect(screen.getByText('Saldo Acumulado')).toBeInTheDocument();

    expect(screen.getByText('Superávit')).toBeInTheDocument();
    expect(screen.getByText(/12\.500,50/)).toBeInTheDocument();
    expect(screen.getByText(/4\.320,00/)).toBeInTheDocument();
    expect(screen.getByText(/8\.180,50/)).toBeInTheDocument();
  });

  it('renderiza o saldo negativo com badge de Déficit', () => {
    const resumo: ResumoFinanceiroGeralDTO = {
      totalEntradas: 1000.0,
      totalSaidas: 2500.0,
      saldo: -1500.0
    };

    render(<DashboardSummaryCard resumo={resumo} />);

    expect(screen.getByText('Déficit')).toBeInTheDocument();
    expect(screen.getByText(/1\.500,00/)).toBeInTheDocument();
  });
});
