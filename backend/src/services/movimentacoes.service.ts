import { PrismaClient, TipoMovimentacao, MetodoPagamento } from '@prisma/client';

const prisma = new PrismaClient();

export interface CriarMovimentacaoDTO {
  nome: string;
  valor: number;
  data: string | Date;
  tipo: TipoMovimentacao;
  metodoPagamento: MetodoPagamento;
  categoriaId: string;
  userId: string;
}

export async function criarMovimentacao(data: CriarMovimentacaoDTO) {
  // Utilizamos transação para garantir que no futuro operações conjuntas (ex: saldo) não falhem
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
      }
    })
  ]);

  return movimentacao;
}
