import { api } from './api';
import type { DashboardDataDTO } from '../types/dashboard';

export async function obterDashboard(): Promise<DashboardDataDTO> {
  const response = await api.get<DashboardDataDTO>('/api/movimentacoes/dashboard');
  return response.data;
}

