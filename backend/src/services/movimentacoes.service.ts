import { PrismaClient, TipoMovimentacao, MetodoPagamento, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export interface CriarMovimentacaoDTO {
  nome: string;
  valor: number;
  data: string | Date;
  tipo: TipoMovimentacao;
  metodoPagamento: MetodoPagamento;
  categoriaId: string;
  userId: string;
}

export interface ListarMovimentacoesParams {
  userId: string;
  categoriaIds?: string[];
  tipo?: TipoMovimentacao;
  metodoPagamento?: MetodoPagamento;
  dataInicial?: string | Date;
  dataFinal?: string | Date;
  page?: number;
  limit?: number;
}

export interface AtualizarMovimentacaoDTO {
  id: string;
  userId: string;
  nome?: string;
  valor?: number;
  data?: string | Date;
  tipo?: TipoMovimentacao;
  metodoPagamento?: MetodoPagamento;
  categoriaId?: string;
}

export interface ExcluirMovimentacaoDTO {
  id: string;
  userId: string;
}

export async function criarMovimentacao(data: CriarMovimentacaoDTO) {
  const [movimentacao] = await prisma.$transaction([
    prisma.movimentacao.create({
      data: {
        nome: data.nome,
        valor: data.valor,
        data: new Date(data.data),
        tipo: data.tipo,
        metodoPagamento: data.metodoPagamento,
        categoriaId: data.categoriaId,
        userId: data.userId
      },
      include: {
        categoria: {
          select: {
            id: true,
            nome: true
          }
        }
      }
    })
  ]);

  return movimentacao;
}

export async function listarMovimentacoes(params: ListarMovimentacoesParams) {
  const page = params.page && params.page > 0 ? Number(params.page) : 1;
  const limit = params.limit && params.limit > 0 ? Number(params.limit) : 15;
  const skip = (page - 1) * limit;

  const where: Prisma.MovimentacaoWhereInput = {
    userId: params.userId
  };

  if (params.categoriaIds && params.categoriaIds.length > 0) {
    where.categoriaId = { in: params.categoriaIds };
  }

  if (params.tipo) {
    where.tipo = params.tipo;
  }

  if (params.metodoPagamento) {
    where.metodoPagamento = params.metodoPagamento;
  }

  if (params.dataInicial || params.dataFinal) {
    const dataFilter: Prisma.DateTimeFilter = {};
    if (params.dataInicial) {
      const dInicio = new Date(params.dataInicial);
      dInicio.setUTCHours(0, 0, 0, 0);
      dataFilter.gte = dInicio;
    }
    if (params.dataFinal) {
      const dFim = new Date(params.dataFinal);
      dFim.setUTCHours(23, 59, 59, 999);
      dataFilter.lte = dFim;
    }
    where.data = dataFilter;
  }

  const [total, items] = await Promise.all([
    prisma.movimentacao.count({ where }),
    prisma.movimentacao.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        categoria: {
          select: {
            id: true,
            nome: true
          }
        }
      }
    })
  ]);

  const totalPages = Math.ceil(total / limit) || 1;
  const hasMore = page < totalPages;

  return {
    items,
    total,
    page,
    limit,
    totalPages,
    hasMore
  };
}

export async function atualizarMovimentacao(data: AtualizarMovimentacaoDTO) {
  const existing = await prisma.movimentacao.findFirst({
    where: { id: data.id, userId: data.userId }
  });

  if (!existing) {
    throw new AppError('Movimentação não encontrada', 404);
  }

  if (data.valor !== undefined && data.valor <= 0) {
    throw new AppError('O valor deve ser maior que zero', 400);
  }

  if (data.categoriaId) {
    const categoria = await prisma.categoria.findFirst({
      where: { id: data.categoriaId, userId: data.userId }
    });
    if (!categoria) {
      throw new AppError('Categoria não encontrada ou não pertence ao usuário', 400);
    }
  }

  const updated = await prisma.movimentacao.update({
    where: { id: data.id },
    data: {
      ...(data.nome ? { nome: data.nome } : {}),
      ...(data.valor !== undefined ? { valor: data.valor } : {}),
      ...(data.data ? { data: new Date(data.data) } : {}),
      ...(data.tipo ? { tipo: data.tipo } : {}),
      ...(data.metodoPagamento ? { metodoPagamento: data.metodoPagamento } : {}),
      ...(data.categoriaId ? { categoriaId: data.categoriaId } : {})
    },
    include: {
      categoria: {
        select: {
          id: true,
          nome: true
        }
      }
    }
  });

  return updated;
}

export async function excluirMovimentacao(data: ExcluirMovimentacaoDTO) {
  const existing = await prisma.movimentacao.findFirst({
    where: { id: data.id, userId: data.userId }
  });

  if (!existing) {
    throw new AppError('Movimentação não encontrada', 404);
  }

  await prisma.movimentacao.delete({
    where: { id: data.id }
  });

  return { success: true };
}
