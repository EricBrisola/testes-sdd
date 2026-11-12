import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
import type { MetodoPagamentoMetricaDTO } from '../../types/dashboard';
import { formatarMoeda } from '../../utils/formatters';
import {
  ChartCard,
  ChartTitle,
  ChartSubtitle,
  ChartWrapper,
  MethodsDetailList,
  MethodDetailItem,
  MethodName,
  MethodValue,
  MethodPercent,
  EmptyStateWrapper,
  TooltipBox,
  TooltipTitle,
  TooltipValue,
  TooltipItemWrapper
} from './styles';

export interface PaymentMethodBarChartProps {
  metodos: MetodoPagamentoMetricaDTO[];
  tipoFiltro: 'SAIDA' | 'ENTRADA';
}

const METHOD_COLORS = {
  PIX: '#06b6d4',
  CARTAO: '#3b82f6',
  DINHEIRO: '#10b981'
};

interface TooltipPayloadItem {
  name?: string;
  value?: number;
  color?: string;
  payload?: Record<string, number | string>;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (active && payload && payload.length > 0) {
    return (
      <TooltipBox>
        {payload.map((item, idx) => (
          <TooltipItemWrapper key={idx} $hasMarginBottom={idx < payload.length - 1}>
            <TooltipTitle>{item.name}</TooltipTitle>
            <TooltipValue>{formatarMoeda(Number(item.value || 0))}</TooltipValue>
          </TooltipItemWrapper>
        ))}
      </TooltipBox>
    );
  }
  return null;
}

export default function PaymentMethodBarChart({ metodos, tipoFiltro }: PaymentMethodBarChartProps) {
  const tituloNatureza = tipoFiltro === 'SAIDA' ? 'Despesas' : 'Receitas';
  const hasData = metodos && metodos.length > 0 && metodos.some((m) => m.valor > 0);

  const pixItem = metodos.find((m) => m.metodo === 'PIX');
  const cartaoItem = metodos.find((m) => m.metodo === 'CARTAO');
  const dinheiroItem = metodos.find((m) => m.metodo === 'DINHEIRO');

  const chartData = [
    {
      name: 'Métodos',
      Pix: pixItem?.valor || 0,
      Cartão: cartaoItem?.valor || 0,
      Dinheiro: dinheiroItem?.valor || 0
    }
  ];

  return (
    <ChartCard data-testid="payment-method-bar-chart">
      <ChartTitle>Formas de Pagamento ({tituloNatureza})</ChartTitle>
      <ChartSubtitle>Divisão proporcional por Pix, Dinheiro e Cartão</ChartSubtitle>

      {!hasData ? (
        <EmptyStateWrapper>
          Nenhuma movimentação de {tituloNatureza.toLowerCase()} registrada com métodos de pagamento.
        </EmptyStateWrapper>
      ) : (
        <>
          <ChartWrapper>
            <ResponsiveContainer width="100%" height={80}>
              <BarChart
                layout="vertical"
                data={chartData}
                margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
              >
                <XAxis type="number" hide domain={[0, 'dataMax']} />
                <YAxis type="category" dataKey="name" hide />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="Pix"
                  stackId="metodos"
                  fill={METHOD_COLORS.PIX}
                  isAnimationActive={true}
                  animationDuration={1200}
                  animationEasing="ease-out"
                />
                <Bar
                  dataKey="Cartão"
                  stackId="metodos"
                  fill={METHOD_COLORS.CARTAO}
                  isAnimationActive={true}
                  animationDuration={1200}
                  animationEasing="ease-out"
                />
                <Bar
                  dataKey="Dinheiro"
                  stackId="metodos"
                  fill={METHOD_COLORS.DINHEIRO}
                  isAnimationActive={true}
                  animationDuration={1200}
                  animationEasing="ease-out"
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartWrapper>

          <MethodsDetailList>
            <MethodDetailItem $color={METHOD_COLORS.PIX}>
              <MethodName>Pix</MethodName>
              <MethodValue>{formatarMoeda(pixItem?.valor || 0)}</MethodValue>
              <MethodPercent>{pixItem?.percentual || 0}% do total</MethodPercent>
            </MethodDetailItem>

            <MethodDetailItem $color={METHOD_COLORS.CARTAO}>
              <MethodName>Cartão</MethodName>
              <MethodValue>{formatarMoeda(cartaoItem?.valor || 0)}</MethodValue>
              <MethodPercent>{cartaoItem?.percentual || 0}% do total</MethodPercent>
            </MethodDetailItem>

            <MethodDetailItem $color={METHOD_COLORS.DINHEIRO}>
              <MethodName>Dinheiro</MethodName>
              <MethodValue>{formatarMoeda(dinheiroItem?.valor || 0)}</MethodValue>
              <MethodPercent>{dinheiroItem?.percentual || 0}% do total</MethodPercent>
            </MethodDetailItem>
          </MethodsDetailList>
        </>
      )}
    </ChartCard>
  );
}
