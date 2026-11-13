import { api } from './api';
import type {
  FiltrosMovimentacoesDTO,
  MovimentacaoComCategoria,
  MovimentacoesPaginadasResponse,
  AtualizarMovimentacaoDTO,
  CriarMovimentacaoInput
} from '../types/movimentacao';

export async function criarMovimentacao(
  payload: CriarMovimentacaoInput
): Promise<MovimentacaoComCategoria> {
  const response = await api.post<MovimentacaoComCategoria>('/api/movimentacoes', payload);
  return response.data;
}

export async function listarMovimentacoes(
  filtros: FiltrosMovimentacoesDTO = {}
): Promise<MovimentacoesPaginadasResponse> {
  const params: Record<string, string | number> = {};

  if (filtros.categorias && filtros.categorias.length > 0) {
    params.categorias = filtros.categorias.join(',');
  }
  if (filtros.tipo) {
    params.tipo = filtros.tipo;
  }
  if (filtros.metodoPagamento) {
    params.metodoPagamento = filtros.metodoPagamento;
  }
  if (filtros.dataInicial) {
    params.dataInicial = filtros.dataInicial;
  }
  if (filtros.dataFinal) {
    params.dataFinal = filtros.dataFinal;
  }
  if (filtros.page) {
    params.page = filtros.page;
  }
  if (filtros.limit) {
    params.limit = filtros.limit;
  }

  const response = await api.get<MovimentacoesPaginadasResponse>('/api/movimentacoes', {
    params
  });
  return response.data;
}

export async function atualizarMovimentacao(
  id: string,
  payload: AtualizarMovimentacaoDTO
): Promise<MovimentacaoComCategoria> {
  const response = await api.put<MovimentacaoComCategoria>(`/api/movimentacoes/${id}`, payload);
  return response.data;
}

export async function excluirMovimentacao(id: string): Promise<void> {
  await api.delete(`/api/movimentacoes/${id}`);
}
