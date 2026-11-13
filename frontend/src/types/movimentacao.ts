import type { Categoria } from './categoria';

export type TipoMovimentacao = 'ENTRADA' | 'SAIDA';
export type MetodoPagamento = 'PIX' | 'DINHEIRO' | 'CARTAO';

export interface Movimentacao {
  id: string;
  nome: string;
  valor: number;
  data: string;
  tipo: TipoMovimentacao;
  metodoPagamento: MetodoPagamento;
  userId: string;
  categoriaId: string;
  isParcela: boolean;
  parcelamentoId?: string | null;
  numeroParcela?: number | null;
  totalParcelas?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface CriarMovimentacaoInput {
  nome: string;
  valor: number;
  data: string;
  tipo: TipoMovimentacao;
  metodoPagamento: MetodoPagamento;
  categoriaId: string;
  isParcela?: boolean;
  totalParcelas?: number;
}

export interface MovimentacaoComCategoria extends Movimentacao {
  categoria: Pick<Categoria, 'id' | 'nome'>;
}

export interface FiltrosMovimentacoesDTO {
  categorias?: string[];
  tipo?: TipoMovimentacao;
  metodoPagamento?: MetodoPagamento;
  dataInicial?: string;
  dataFinal?: string;
  page?: number;
  limit?: number;
}

export interface AtualizarMovimentacaoDTO {
  nome?: string;
  valor?: number;
  data?: string;
  tipo?: TipoMovimentacao;
  metodoPagamento?: MetodoPagamento;
  categoriaId?: string;
}

export interface MovimentacoesPaginadasResponse {
  items: MovimentacaoComCategoria[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}
