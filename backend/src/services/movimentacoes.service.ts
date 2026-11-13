import { PrismaClient, TipoMovimentacao, MetodoPagamento, Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';

export const prisma = new PrismaClient();

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
  isParcela?: boolean;
  totalParcelas?: number;
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

function calcularDataParcela(dataInicial: string | Date, offsetMeses: number): Date {
  const d = new Date(dataInicial);
  const diaOriginal = d.getUTCDate();
  
  d.setUTCMonth(d.getUTCMonth() + offsetMeses);
  
  // Se o mês seguinte tem menos dias (ex: 31 de jan para fev)
  if (d.getUTCDate() !== diaOriginal) {
    d.setUTCDate(0);
  }
  
  return d;
}

export async function criarMovimentacao(data: CriarMovimentacaoDTO) {
  if (data.valor <= 0) {
    throw new AppError('O valor deve ser maior que zero', 400);
  }

  // Verifica existência da categoria
  const categoria = await prisma.categoria.findFirst({
    where: { id: data.categoriaId, userId: data.userId }
  });
  if (!categoria) {
    throw new AppError('Categoria não encontrada ou não pertence ao usuário', 400);
  }

  // Fluxo de Movimentação Parcelada
  if (data.isParcela) {
    const totalParcelas = Number(data.totalParcelas);
    if (isNaN(totalParcelas) || totalParcelas < 2 || totalParcelas > 24) {
      throw new AppError('A quantidade de parcelas deve ser entre 2 e 24', 400);
    }

    const valorTotal = data.valor;
    const valorBase = Math.floor((valorTotal / totalParcelas) * 100) / 100;
    const somaBase = Math.round(valorBase * totalParcelas * 100) / 100;
    const residuo = Math.round((valorTotal - somaBase) * 100) / 100;

    const parcelamentoId = randomUUID();
    const nomeBase = data.nome.trim();

    const criacoes = [];
    for (let i = 1; i <= totalParcelas; i++) {
      const valorParcela = i === 1 ? Math.round((valorBase + residuo) * 100) / 100 : valorBase;
      const dataParcela = calcularDataParcela(data.data, i - 1);

      criacoes.push(
        prisma.movimentacao.create({
          data: {
            nome: `${nomeBase} (${i}/${totalParcelas})`,
            valor: valorParcela,
            data: dataParcela,
            tipo: data.tipo,
            metodoPagamento: data.metodoPagamento,
            categoriaId: data.categoriaId,
            userId: data.userId,
            isParcela: true,
            parcelamentoId,
            numeroParcela: i,
            totalParcelas
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
      );
    }

    const movimentacoesCriadas = await prisma.$transaction(criacoes);
    return movimentacoesCriadas[0];
  }

  // Fluxo de Movimentação Única (Não parcelada)
  const [movimentacao] = await prisma.$transaction([
    prisma.movimentacao.create({
      data: {
        nome: data.nome,
        valor: data.valor,
        data: new Date(data.data),
        tipo: data.tipo,
        metodoPagamento: data.metodoPagamento,
        categoriaId: data.categoriaId,
        userId: data.userId,
        isParcela: false
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
      dataFilter.gte = new Date(params.dataInicial);
    }
    if (params.dataFinal) {
      dataFilter.lte = new Date(params.dataFinal);
    }
    where.data = dataFilter;
  }

  const [total, items] = await prisma.$transaction([
    prisma.movimentacao.count({ where }),
    prisma.movimentacao.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        data: 'desc'
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

  // Se a movimentação for parte de um parcelamento, atualiza todo o grupo em transação
  if (existing.isParcela && existing.parcelamentoId) {
    const grupo = await prisma.movimentacao.findMany({
      where: {
        parcelamentoId: existing.parcelamentoId,
        userId: data.userId
      },
      orderBy: { numeroParcela: 'asc' }
    });

    let novoNomeBase = data.nome ? data.nome.trim() : undefined;
    if (novoNomeBase) {
      novoNomeBase = novoNomeBase.replace(/\s*\(\d+\/\d+\)$/, '').trim();
    }

    let deltaMs: number | undefined;
    const targetIndex = existing.numeroParcela || 1;
    if (data.data) {
      const novaData = new Date(data.data);
      const dataAntiga = new Date(existing.data);
      deltaMs = novaData.getTime() - dataAntiga.getTime();
    }

    const updates = grupo.map((item) => {
      const itemIndex = item.numeroParcela || 1;
      const total = item.totalParcelas || grupo.length;

      let itemData = item.data;
      if (deltaMs !== undefined) {
        if (itemIndex === targetIndex) {
          itemData = new Date(data.data!);
        } else if (itemIndex > targetIndex) {
          itemData = new Date(new Date(item.data).getTime() + deltaMs);
        }
      }

      const updateData: Prisma.MovimentacaoUpdateInput = {
        ...(novoNomeBase ? { nome: `${novoNomeBase} (${itemIndex}/${total})` } : {}),
        ...(data.valor !== undefined ? { valor: data.valor } : {}),
        ...(data.tipo ? { tipo: data.tipo } : {}),
        ...(data.metodoPagamento ? { metodoPagamento: data.metodoPagamento } : {}),
        ...(data.categoriaId ? { categoria: { connect: { id: data.categoriaId } } } : {}),
        ...(deltaMs !== undefined ? { data: itemData } : {})
      };

      return prisma.movimentacao.update({
        where: { id: item.id },
        data: updateData,
        include: {
          categoria: {
            select: { id: true, nome: true }
          }
        }
      });
    });

    const updatedGrupo = await prisma.$transaction(updates);
    const updatedTarget = updatedGrupo.find((p) => p.id === data.id) || updatedGrupo[0];
    return updatedTarget;
  }

  // Atualização de movimentação avulsa
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

  if (existing.isParcela && existing.parcelamentoId) {
    await prisma.$transaction([
      prisma.movimentacao.deleteMany({
        where: {
          parcelamentoId: existing.parcelamentoId,
          userId: data.userId
        }
      })
    ]);
    return { success: true, countDeleted: existing.totalParcelas || 1 };
  }

  await prisma.movimentacao.delete({
    where: { id: data.id }
  });

  return { success: true };
}
