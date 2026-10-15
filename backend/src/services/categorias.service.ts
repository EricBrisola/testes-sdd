import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export const DEFAULT_CATEGORIAS = ['Alimentação', 'Geral', 'Lazer'];

export interface CriarCategoriaDTO {
  nome: string;
  userId: string;
}

export interface AtualizarCategoriaDTO {
  id: string;
  nome: string;
  userId: string;
}

export interface ExcluirCategoriaDTO {
  id: string;
  userId: string;
}

export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Garante que o usuário possua ao menos as categorias padrão cadastradas
 */
export async function garantirCategoriasPadrao(userId: string): Promise<void> {
  const count = await prisma.categoria.count({
    where: { userId }
  });

  if (count === 0) {
    await prisma.categoria.createMany({
      data: DEFAULT_CATEGORIAS.map((nome) => ({
        nome,
        userId
      }))
    });
  }
}

/**
 * Cria uma nova categoria para o usuário autenticado
 */
export async function criarCategoria({ nome, userId }: CriarCategoriaDTO) {
  const nomeLimpo = nome ? nome.trim() : '';

  if (!nomeLimpo) {
    throw new AppError('O nome da categoria é obrigatório e não pode ser vazio', 400);
  }

  const categoriaExistente = await prisma.categoria.findFirst({
    where: {
      userId,
      nome: {
        equals: nomeLimpo,
        mode: 'insensitive'
      }
    }
  });

  if (categoriaExistente) {
    throw new AppError('Já existe uma categoria cadastrada com este nome', 409);
  }

  const [categoria] = await prisma.$transaction([
    prisma.categoria.create({
      data: {
        nome: nomeLimpo,
        userId
      }
    })
  ]);

  return categoria;
}

/**
 * Lista todas as categorias do usuário ordenadas por nome ASC.
 * Garante que usuários sem nenhuma categoria recebam as categorias padrão.
 */
export async function listarCategorias(userId: string) {
  await garantirCategoriasPadrao(userId);

  return prisma.categoria.findMany({
    where: { userId },
    orderBy: {
      nome: 'asc'
    }
  });
}

/**
 * Atualiza o nome de uma categoria do usuário autenticado
 */
export async function atualizarCategoria({ id, nome, userId }: AtualizarCategoriaDTO) {
  const nomeLimpo = nome ? nome.trim() : '';

  if (!nomeLimpo) {
    throw new AppError('O nome da categoria é obrigatório e não pode ser vazio', 400);
  }

  const categoriaAtual = await prisma.categoria.findFirst({
    where: { id, userId }
  });

  if (!categoriaAtual) {
    throw new AppError('Categoria não encontrada', 404);
  }

  const duplicada = await prisma.categoria.findFirst({
    where: {
      userId,
      id: { not: id },
      nome: {
        equals: nomeLimpo,
        mode: 'insensitive'
      }
    }
  });

  if (duplicada) {
    throw new AppError('Já existe uma categoria cadastrada com este nome', 409);
  }

  const [atualizada] = await prisma.$transaction([
    prisma.categoria.update({
      where: { id },
      data: { nome: nomeLimpo }
    })
  ]);

  return atualizada;
}

/**
 * Exclui uma categoria do usuário autenticado.
 * Bloqueia e mapeia erro Restrict (P2003) para AppError 409 Conflict.
 */
export async function excluirCategoria({ id, userId }: ExcluirCategoriaDTO): Promise<void> {
  const categoria = await prisma.categoria.findFirst({
    where: { id, userId }
  });

  if (!categoria) {
    throw new AppError('Categoria não encontrada', 404);
  }

  try {
    await prisma.categoria.delete({
      where: { id }
    });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && (error as { code: string }).code === 'P2003') {
      throw new AppError('Não é possível excluir esta categoria pois ela possui movimentações vinculadas', 409);
    }
    throw error;
  }
}
