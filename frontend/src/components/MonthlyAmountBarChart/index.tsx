import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import type { MesMetricaDTO } from '../../types/dashboard';
import { formatarMoeda } from '../../utils/formatters';
import {
  ChartCard,
  ChartHeader,
  TitleContainer,
  ChartTitle,
  ChartSubtitle,
  LegendContainer,
  LegendBadge,
  LegendDot,
  ChartArea,
  EmptyState,
  TooltipBox,
  TooltipTitle,
  TooltipTotal,
  TooltipRow
} from './styles';

export interface MonthlyAmountBarChartProps {
  dadosMensais: MesMetricaDTO[];
}

interface TooltipPayloadItem {
  payload?: MesMetricaDTO;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (active && payload && payload.length > 0) {
    const item = payload[0].payload;
    if (item) {
      return (
        <TooltipBox>
          <TooltipTitle>{item.rotulo} - Detalhe Mensal</TooltipTitle>
          <TooltipTotal>
            Montante Total: {formatarMoeda(item.montanteTotal)}
          </TooltipTotal>
          <TooltipRow $color="#4ade80">
            <span>Receitas ({item.percentualEntradas}%):</span>
            <span>{formatarMoeda(item.totalEntradas)}</span>
          </TooltipRow>
          <TooltipRow $color="#f87171">
            <span>Despesas ({item.percentualSaidas}%):</span>
            <span>{formatarMoeda(item.totalSaidas)}</span>
          </TooltipRow>
        </TooltipBox>
      );
    }
  }
  return null;
}

function formatarMoedaEixo(valor: number): string {
  if (valor >= 1000) {
    return `R$ ${(valor / 1000).toFixed(0)}k`;
  }
  return `R$ ${valor}`;
}

export default function MonthlyAmountBarChart({ dadosMensais }: MonthlyAmountBarChartProps) {
  const hasData = dadosMensais && dadosMensais.length > 0 && dadosMensais.some((m) => m.montanteTotal > 0);

  return (
    <ChartCard data-testid="monthly-amount-bar-chart">
      <ChartHeader>
        <TitleContainer>
          <ChartTitle>Montante dos Últimos 6 Meses</ChartTitle>
          <ChartSubtitle>Volume financeiro mensal proporcional</ChartSubtitle>
        </TitleContainer>

        <LegendContainer>
          <LegendBadge $color="#16a34a">
            <LegendDot $color="#16a34a" />
            Receitas
          </LegendBadge>
          <LegendBadge $color="#dc2626">
            <LegendDot $color="#dc2626" />
            Despesas
          </LegendBadge>
        </LegendContainer>
      </ChartHeader>

      {!hasData ? (
        <EmptyState>Nenhuma movimentação registrada nos últimos 6 meses.</EmptyState>
      ) : (
        <ChartArea>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dadosMensais}
              margin={{ top: 20, right: 15, left: -5, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis
                dataKey="rotulo"
                tick={{ fill: '#64748b', fontSize: 12 }}
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={false}
              />
              <YAxis
                tickFormatter={formatarMoedaEixo}
                tick={{ fill: '#64748b', fontSize: 12 }}
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="totalEntradas"
                name="Receitas"
                stackId="montante"
                fill="#16a34a"
                isAnimationActive={true}
                animationDuration={1200}
                animationEasing="ease-out"
              />
              <Bar
                dataKey="totalSaidas"
                name="Despesas"
                stackId="montante"
                fill="#dc2626"
                isAnimationActive={true}
                animationDuration={1200}
                animationEasing="ease-out"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartArea>
      )}
    </ChartCard>
  );
}

