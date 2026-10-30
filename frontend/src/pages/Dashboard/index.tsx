import { useState, useEffect } from 'react';
import type { User } from '../../types/user';
import type { DashboardDataDTO } from '../../types/dashboard';
import { obterDashboard } from '../../services/dashboard.service';
import Navbar from '../../components/Navbar';
import DashboardSkeleton from '../../components/DashboardSkeleton';
import DashboardSummaryCard from '../../components/DashboardSummaryCard';
import CategoryDonutChart from '../../components/CategoryDonutChart';
import PaymentMethodBarChart from '../../components/PaymentMethodBarChart';
import NaturezaToggleFilter from '../../components/NaturezaToggleFilter';
import TimelineList from '../../components/TimelineList';
import MonthlyAmountBarChart from '../../components/MonthlyAmountBarChart';
import {
  PageContainer,
  DashboardContent,
  SectionHeader,
  MiddleSectionWrapper,
  FilterBarWrapper,
  MiddleChartsRow,
  BottomChartsRow,
  ErrorCard
} from './styles';

export interface DashboardPageProps {
  user?: User | null;
  onLogout?: () => void;
}

export default function DashboardPage({ user, onLogout }: DashboardPageProps) {
  const [data, setData] = useState<DashboardDataDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroNatureza, setFiltroNatureza] = useState<'SAIDA' | 'ENTRADA'>('SAIDA');

  useEffect(() => {
    let isMounted = true;

    async function carregarDados() {
      try {
        setLoading(true);
        setError(null);
        const resultado = await obterDashboard();
        if (isMounted) {
          setData(resultado);
        }
      } catch {
        if (isMounted) {
          setError('Não foi possível carregar as informações do dashboard.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    carregarDados();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <PageContainer>
      <Navbar user={user} onLogout={onLogout} />
      {loading ? (
        <DashboardSkeleton />
      ) : error ? (
        <ErrorCard>{error}</ErrorCard>
      ) : (
        <DashboardContent>
          {data && (
            <>
              <SectionHeader>
                <DashboardSummaryCard resumo={data.resumoGeral} />
              </SectionHeader>

              <MiddleSectionWrapper>
                <FilterBarWrapper>
                  <NaturezaToggleFilter
                    natureza={filtroNatureza}
                    onChange={setFiltroNatureza}
                  />
                </FilterBarWrapper>

                <MiddleChartsRow>
                  <CategoryDonutChart
                    categorias={
                      filtroNatureza === 'SAIDA'
                        ? data.categorias.saidas
                        : data.categorias.entradas
                    }
                    tipoFiltro={filtroNatureza}
                  />
                  <PaymentMethodBarChart
                    metodos={
                      filtroNatureza === 'SAIDA'
                        ? data.metodosPagamento.saidas
                        : data.metodosPagamento.entradas
                    }
                    tipoFiltro={filtroNatureza}
                  />
                </MiddleChartsRow>
              </MiddleSectionWrapper>

              <BottomChartsRow>
                <TimelineList movimentacoes={data.ultimasMovimentacoes} />
                <MonthlyAmountBarChart dadosMensais={data.ultimos6Meses} />
              </BottomChartsRow>
            </>
          )}
        </DashboardContent>
      )}
    </PageContainer>
  );
}
