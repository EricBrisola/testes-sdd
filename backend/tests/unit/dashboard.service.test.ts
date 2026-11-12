import {
  obterDadosDashboard,
  prisma
} from '../../src/services/dashboard.service';

jest.mock('@prisma/client', () => {
  const mPrisma = {
    movimentacao: {
      aggregate: jest.fn(),
      groupBy: jest.fn(),
      findMany: jest.fn()
    },
    categoria: {
      findMany: jest.fn()
    }
  };
  return {
    PrismaClient: jest.fn(() => mPrisma),
    TipoMovimentacao: {
      ENTRADA: 'ENTRADA',
      SAIDA: 'SAIDA'
    },
    MetodoPagamento: {
      PIX: 'PIX',
      DINHEIRO: 'DINHEIRO',
      CARTAO: 'CARTAO'
    }
  };
});

describe('Dashboard Service', () => {
  const userId = 'user-dashboard-123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar dados consolidados do dashboard corretamente', async () => {
    // 1. Resumo Geral
    (prisma.movimentacao.aggregate as jest.Mock)
      .mockResolvedValueOnce({ _sum: { valor: 5000 } }) // ENTRADA
      .mockResolvedValueOnce({ _sum: { valor: 2000 } }); // SAIDA

    // 2. Categorias (groupBy saidas, groupBy entradas)
    (prisma.movimentacao.groupBy as jest.Mock)
      .mockResolvedValueOnce([
        { categoriaId: 'cat-1', _sum: { valor: 1500 } }
      ])
      .mockResolvedValueOnce([
        { categoriaId: 'cat-2', _sum: { valor: 4000 } }
      ])
      // 3. Métodos (groupBy saidas, groupBy entradas)
      .mockResolvedValueOnce([
        { metodoPagamento: 'PIX', _sum: { valor: 1000 } },
        { metodoPagamento: 'CARTAO', _sum: { valor: 1000 } }
      ])
      .mockResolvedValueOnce([
        { metodoPagamento: 'PIX', _sum: { valor: 4000 } }
      ]);

    // Categorias names
    (prisma.categoria.findMany as jest.Mock).mockResolvedValueOnce([
      { id: 'cat-1', nome: 'Alimentação' },
      { id: 'cat-2', nome: 'Salário' }
    ]);

    // 4. Últimos 6 meses movimentações
    (prisma.movimentacao.findMany as jest.Mock)
      .mockResolvedValueOnce([
        { valor: 500, tipo: 'ENTRADA', data: new Date().toISOString() },
        { valor: 200, tipo: 'SAIDA', data: new Date().toISOString() }
      ])
      // 5. Últimas 20 movimentações
      .mockResolvedValueOnce([
        {
          id: 'mov-1',
          nome: 'Supermercado',
          tipo: 'SAIDA',
          metodoPagamento: 'CARTAO',
          valor: 150,
          createdAt: new Date()
        }
      ]);

    const resultado = await obterDadosDashboard(userId);

    // Verificações
    expect(resultado.resumoGeral.totalEntradas).toBe(5000);
    expect(resultado.resumoGeral.totalSaidas).toBe(2000);
    expect(resultado.resumoGeral.saldo).toBe(3000);

    expect(resultado.categorias.saidas).toHaveLength(1);
    expect(resultado.categorias.saidas[0].nome).toBe('Alimentação');
    expect(resultado.categorias.saidas[0].percentual).toBe(75);

    expect(resultado.categorias.entradas).toHaveLength(1);
    expect(resultado.categorias.entradas[0].nome).toBe('Salário');
    expect(resultado.categorias.entradas[0].percentual).toBe(80);

    expect(resultado.metodosPagamento.saidas).toHaveLength(3);
    expect(resultado.metodosPagamento.entradas).toHaveLength(3);

    expect(resultado.ultimos6Meses).toHaveLength(6);
    expect(resultado.ultimasMovimentacoes).toHaveLength(1);
    expect(resultado.ultimasMovimentacoes[0].nome).toBe('Supermercado');
  });

  it('deve lidar com valores zerados sem divisão por zero', async () => {
    (prisma.movimentacao.aggregate as jest.Mock)
      .mockResolvedValueOnce({ _sum: { valor: null } })
      .mockResolvedValueOnce({ _sum: { valor: null } });

    (prisma.movimentacao.groupBy as jest.Mock)
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([]);

    (prisma.categoria.findMany as jest.Mock).mockResolvedValueOnce([]);
    (prisma.movimentacao.findMany as jest.Mock)
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([]);

    const resultado = await obterDadosDashboard(userId);

    expect(resultado.resumoGeral.totalEntradas).toBe(0);
    expect(resultado.resumoGeral.totalSaidas).toBe(0);
    expect(resultado.resumoGeral.saldo).toBe(0);
    expect(resultado.categorias.saidas).toEqual([]);
    expect(resultado.categorias.entradas).toEqual([]);
    expect(resultado.ultimos6Meses).toHaveLength(6);
    expect(resultado.ultimasMovimentacoes).toEqual([]);
  });
});

