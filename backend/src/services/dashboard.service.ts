import { PrismaClient, TipoMovimentacao, MetodoPagamento } from '@prisma/client';

export const prisma = new PrismaClient();

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

const MESES_NOMES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
const METODOS_ROTULOS: Record<MetodoPagamento, string> = {
  PIX: 'Pix',
  DINHEIRO: 'Dinheiro',
  CARTAO: 'Cartão'
};

export async function obterDadosDashboard(userId: string): Promise<DashboardDataDTO> {
  // 1. Resumo Geral (Todo o histórico do usuário)
  const entradasAgg = await prisma.movimentacao.aggregate({
    where: { userId, tipo: TipoMovimentacao.ENTRADA },
    _sum: { valor: true }
  });
  const saidasAgg = await prisma.movimentacao.aggregate({
    where: { userId, tipo: TipoMovimentacao.SAIDA },
    _sum: { valor: true }
  });

  const totalEntradas = Number(entradasAgg._sum.valor || 0);
  const totalSaidas = Number(saidasAgg._sum.valor || 0);
  const saldo = Number((totalEntradas - totalSaidas).toFixed(2));

  // 2. Top 5 Categorias (por maior valor somado em R$)
  const topSaidasCat = await prisma.movimentacao.groupBy({
    by: ['categoriaId'],
    where: { userId, tipo: TipoMovimentacao.SAIDA },
    _sum: { valor: true },
    orderBy: { _sum: { valor: 'desc' } },
    take: 5
  });

  const topEntradasCat = await prisma.movimentacao.groupBy({
    by: ['categoriaId'],
    where: { userId, tipo: TipoMovimentacao.ENTRADA },
    _sum: { valor: true },
    orderBy: { _sum: { valor: 'desc' } },
    take: 5
  });

  const todasCatIds = [
    ...topSaidasCat.map((c) => c.categoriaId),
    ...topEntradasCat.map((c) => c.categoriaId)
  ];

  const categoriasDb = await prisma.categoria.findMany({
    where: { id: { in: todasCatIds } },
    select: { id: true, nome: true }
  });

  const catMap = new Map(categoriasDb.map((c) => [c.id, c.nome]));

  const formatCategorias = (
    items: typeof topSaidasCat,
    totalBase: number
  ): CategoriaMetricaDTO[] => {
    return items.map((item) => {
      const valor = Number(item._sum.valor || 0);
      const percentual = totalBase > 0 ? Number(((valor / totalBase) * 100).toFixed(2)) : 0;
      return {
        id: item.categoriaId,
        nome: catMap.get(item.categoriaId) || 'Sem categoria',
        valor: Number(valor.toFixed(2)),
        percentual
      };
    });
  };

  const categorias: CategoriasDashboardDTO = {
    saidas: formatCategorias(topSaidasCat, totalSaidas),
    entradas: formatCategorias(topEntradasCat, totalEntradas)
  };

  // 3. Métodos de Pagamento (Pix, Dinheiro, Cartão)
  const metodosSaidasDb = await prisma.movimentacao.groupBy({
    by: ['metodoPagamento'],
    where: { userId, tipo: TipoMovimentacao.SAIDA },
    _sum: { valor: true }
  });

  const metodosEntradasDb = await prisma.movimentacao.groupBy({
    by: ['metodoPagamento'],
    where: { userId, tipo: TipoMovimentacao.ENTRADA },
    _sum: { valor: true }
  });

  const formatMetodos = (
    items: typeof metodosSaidasDb,
    totalBase: number
  ): MetodoPagamentoMetricaDTO[] => {
    const todosMetodos: MetodoPagamento[] = [
      MetodoPagamento.PIX,
      MetodoPagamento.DINHEIRO,
      MetodoPagamento.CARTAO
    ];

    const mapValores = new Map(
      items.map((i) => [i.metodoPagamento, Number(i._sum.valor || 0)])
    );

    return todosMetodos.map((metodo) => {
      const valor = mapValores.get(metodo) || 0;
      const percentual = totalBase > 0 ? Number(((valor / totalBase) * 100).toFixed(2)) : 0;
      return {
        metodo: metodo as 'PIX' | 'DINHEIRO' | 'CARTAO',
        rotulo: METODOS_ROTULOS[metodo],
        valor: Number(valor.toFixed(2)),
        percentual
      };
    });
  };

  const metodosPagamento: MetodosPagamentoDashboardDTO = {
    saidas: formatMetodos(metodosSaidasDb, totalSaidas),
    entradas: formatMetodos(metodosEntradasDb, totalEntradas)
  };

  // 4. Últimos 6 meses móveis
  const agora = new Date();
  const mesesSlots: { ano: number; mes: number; inicio: Date; fim: Date }[] = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(agora.getFullYear(), agora.getMonth() - i, 1);
    const ano = d.getFullYear();
    const mes = d.getMonth() + 1; // 1 a 12
    const inicio = new Date(ano, mes - 1, 1, 0, 0, 0, 0);
    const fim = new Date(ano, mes, 0, 23, 59, 59, 999);
    mesesSlots.push({ ano, mes, inicio, fim });
  }

  const dataInicio6Meses = mesesSlots[0].inicio;
  const dataFim6Meses = mesesSlots[mesesSlots.length - 1].fim;

  const movimentacoes6Meses = await prisma.movimentacao.findMany({
    where: {
      userId,
      data: {
        gte: dataInicio6Meses,
        lte: dataFim6Meses
      }
    },
    select: {
      valor: true,
      tipo: true,
      data: true
    }
  });

  const ultimos6Meses: MesMetricaDTO[] = mesesSlots.map((slot) => {
    let entradasMes = 0;
    let saidasMes = 0;

    for (const mov of movimentacoes6Meses) {
      const d = new Date(mov.data);
      if (d.getFullYear() === slot.ano && d.getMonth() + 1 === slot.mes) {
        const val = Number(mov.valor);
        if (mov.tipo === TipoMovimentacao.ENTRADA) {
          entradasMes += val;
        } else {
          saidasMes += val;
        }
      }
    }

    const montanteTotal = Number((entradasMes + saidasMes).toFixed(2));
    const percentualEntradas =
      montanteTotal > 0 ? Number(((entradasMes / montanteTotal) * 100).toFixed(2)) : 0;
    const percentualSaidas =
      montanteTotal > 0 ? Number(((saidasMes / montanteTotal) * 100).toFixed(2)) : 0;

    const mesIndex = slot.mes - 1;
    const mesNome = MESES_NOMES[mesIndex];
    const anoAbrev = String(slot.ano).slice(-2);

    return {
      ano: slot.ano,
      mes: slot.mes,
      mesNome,
      rotulo: `${mesNome}/${anoAbrev}`,
      totalEntradas: Number(entradasMes.toFixed(2)),
      totalSaidas: Number(saidasMes.toFixed(2)),
      montanteTotal,
      percentualEntradas,
      percentualSaidas
    };
  });

  // 5. Últimas 20 movimentações inseridas no banco
  const ultimasDb = await prisma.movimentacao.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 20,
    select: {
      id: true,
      nome: true,
      tipo: true,
      metodoPagamento: true,
      valor: true,
      createdAt: true
    }
  });

  const ultimasMovimentacoes: UltimaMovimentacaoDTO[] = ultimasDb.map((mov) => ({
    id: mov.id,
    nome: mov.nome,
    tipo: mov.tipo as 'ENTRADA' | 'SAIDA',
    metodoPagamento: mov.metodoPagamento as 'PIX' | 'DINHEIRO' | 'CARTAO',
    metodoRotulo: METODOS_ROTULOS[mov.metodoPagamento] || mov.metodoPagamento,
    valor: Number(mov.valor),
    createdAt: mov.createdAt.toISOString()
  }));

  return {
    resumoGeral: {
      totalEntradas: Number(totalEntradas.toFixed(2)),
      totalSaidas: Number(totalSaidas.toFixed(2)),
      saldo
    },
    categorias,
    metodosPagamento,
    ultimos6Meses,
    ultimasMovimentacoes
  };
}
