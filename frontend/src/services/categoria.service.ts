import { api } from './api';
import type { Categoria, CriarCategoriaPayload, AtualizarCategoriaPayload } from '../types/categoria';

export async function listarCategorias(): Promise<Categoria[]> {
  const response = await api.get<Categoria[]>('/api/categorias');
  return response.data;
}

export async function criarCategoria(payload: CriarCategoriaPayload): Promise<Categoria> {
  const response = await api.post<Categoria>('/api/categorias', payload);
  return response.data;
}

export async function atualizarCategoria(id: string, payload: AtualizarCategoriaPayload): Promise<Categoria> {
  const response = await api.put<Categoria>(`/api/categorias/${id}`, payload);
  return response.data;
}

export async function excluirCategoria(id: string): Promise<void> {
  await api.delete(`/api/categorias/${id}`);
}
