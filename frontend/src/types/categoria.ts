export interface Categoria {
  id: string;
  nome: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CriarCategoriaPayload {
  nome: string;
}

export interface AtualizarCategoriaPayload {
  nome: string;
}
