export interface ResumoFinanceiroGeralDTO {
  totalEntradas: number;
  totalSaidas: number;
  saldo: number;
}

export interface CategoriaMetricaDTO {
  id: string;
  nome: string;
  valor: number;
  percentual: number;
}

export interface CategoriasDashboardDTO {
  saidas: CategoriaMetricaDTO[];
  entradas: CategoriaMetricaDTO[];
}

export interface MetodoPagamentoMetricaDTO {
  metodo: 'PIX' | 'DINHEIRO' | 'CARTAO';
  rotulo: string;
  valor: number;
  percentual: number;
}

export interface MetodosPagamentoDashboardDTO {
  saidas: MetodoPagamentoMetricaDTO[];
  entradas: MetodoPagamentoMetricaDTO[];
}

export interface MesMetricaDTO {
  ano: number;
  mes: number;
  mesNome: string;
  rotulo: string;
  totalEntradas: number;
  totalSaidas: number;
  montanteTotal: number;
  percentualEntradas: number;
  percentualSaidas: number;
}

export interface UltimaMovimentacaoDTO {
  id: string;
  nome: string;
  tipo: 'ENTRADA' | 'SAIDA';
  metodoPagamento: 'PIX' | 'DINHEIRO' | 'CARTAO';
  metodoRotulo: string;
  valor: number;
  createdAt: string;
}

export interface DashboardDataDTO {
  resumoGeral: ResumoFinanceiroGeralDTO;
  categorias: CategoriasDashboardDTO;
  metodosPagamento: MetodosPagamentoDashboardDTO;
  ultimos6Meses: MesMetricaDTO[];
  ultimasMovimentacoes: UltimaMovimentacaoDTO[];
}

