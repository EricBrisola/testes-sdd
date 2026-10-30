import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import type { CategoriaMetricaDTO } from '../../types/dashboard';
import { formatarMoeda } from '../../utils/formatters';
import {
  ChartCard,
  ChartTitle,
  ChartSubtitle,
  ChartWrapper,
  LegendList,
  LegendItem,
  ColorDot,
  EmptyStateWrapper,
  TooltipBox,
  TooltipTitle,
  TooltipValue
} from './styles';

const PALETTE = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

export interface CategoryDonutChartProps {
  categorias: CategoriaMetricaDTO[];
  tipoFiltro: 'SAIDA' | 'ENTRADA';
}

interface TooltipPayloadItem {
  name?: string;
  value?: number;
  payload?: CategoriaMetricaDTO;
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
          <TooltipTitle>{item.nome}</TooltipTitle>
          <TooltipValue>{formatarMoeda(item.valor)} ({item.percentual}%)</TooltipValue>
        </TooltipBox>
      );
    }
  }
  return null;
}

export default function CategoryDonutChart({ categorias, tipoFiltro }: CategoryDonutChartProps) {
  const tituloNatureza = tipoFiltro === 'SAIDA' ? 'Despesas' : 'Entradas';
  const hasData = categorias && categorias.length > 0 && categorias.some((c) => c.valor > 0);

  return (
    <ChartCard data-testid="category-donut-chart">
      <ChartTitle>Top 5 Categorias ({tituloNatureza})</ChartTitle>
      <ChartSubtitle>Distribuição das 5 categorias com maior volume financeiro</ChartSubtitle>

      {!hasData ? (
        <EmptyStateWrapper>
          Nenhuma movimentação de {tituloNatureza.toLowerCase()} registrada em categorias.
        </EmptyStateWrapper>
      ) : (
        <>
          <ChartWrapper>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categorias}
                  dataKey="valor"
                  nameKey="nome"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={3}
                  isAnimationActive={true}
                  animationBegin={0}
                  animationDuration={1500}
                  animationEasing="ease-out"
                >
                  {categorias.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PALETTE[index % PALETTE.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartWrapper>

          <LegendList>
            {categorias.map((cat, index) => (
              <LegendItem key={cat.id || index}>
                <ColorDot $color={PALETTE[index % PALETTE.length]} />
                <span>{cat.nome} ({cat.percentual}%)</span>
              </LegendItem>
            ))}
          </LegendList>
        </>
      )}
    </ChartCard>
  );
}
