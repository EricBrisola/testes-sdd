import {
  criarMovimentacao,
  atualizarMovimentacao,
  excluirMovimentacao,
  AppError,
  prisma
} from '../../src/services/movimentacoes.service';

jest.mock('@prisma/client', () => {
  const mPrisma = {
    categoria: {
      findFirst: jest.fn()
    },
    movimentacao: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn()
    },
    $transaction: jest.fn((actions: unknown[]) => Promise.all(actions))
  };
  return {
    PrismaClient: jest.fn(() => mPrisma),
    TipoMovimentacao: { ENTRADA: 'ENTRADA', SAIDA: 'SAIDA' },
    MetodoPagamento: { PIX: 'PIX', DINHEIRO: 'DINHEIRO', CARTAO: 'CARTAO' }
  };
});

describe('Movimentações Parceladas Service', () => {
  const userId = 'user-123';
  const categoriaId = 'cat-123';

  beforeEach(() => {
    jest.clearAllMocks();
    (prisma.categoria.findFirst as jest.Mock).mockResolvedValue({
      id: categoriaId,
      nome: 'Geral',
      userId
    });
  });

  describe('criarMovimentacao (Parcelamento)', () => {
    it('deve rejeitar quantidade de parcelas menor que 2 ou maior que 24', async () => {
      await expect(
        criarMovimentacao({
          nome: 'Curso',
          valor: 100,
          data: '2026-11-12',
          tipo: 'SAIDA',
          metodoPagamento: 'CARTAO',
          categoriaId,
          userId,
          isParcela: true,
          totalParcelas: 1
        })
      ).rejects.toThrow(new AppError('A quantidade de parcelas deve ser entre 2 e 24', 400));

      await expect(
        criarMovimentacao({
          nome: 'Curso',
          valor: 100,
          data: '2026-11-12',
          tipo: 'SAIDA',
          metodoPagamento: 'CARTAO',
          categoriaId,
          userId,
          isParcela: true,
          totalParcelas: 25
        })
      ).rejects.toThrow(new AppError('A quantidade de parcelas deve ser entre 2 e 24', 400));
    });

    it('deve criar 3 parcelas com rateio de centavos na 1ª parcela (R$ 100 em 3x)', async () => {
      (prisma.movimentacao.create as jest.Mock).mockImplementation(({ data }) => Promise.resolve(data));

      const result = await criarMovimentacao({
        nome: 'Notebook',
        valor: 100,
        data: '2026-11-12T00:00:00.000Z',
        tipo: 'SAIDA',
        metodoPagamento: 'CARTAO',
        categoriaId,
        userId,
        isParcela: true,
        totalParcelas: 3
      });

      expect(prisma.$transaction).toHaveBeenCalled();
      const transactionCalls = (prisma.movimentacao.create as jest.Mock).mock.calls;
      expect(transactionCalls).toHaveLength(3);

      // Parcela 1: 33.34 (centavo residual)
      expect(transactionCalls[0][0].data.valor).toBe(33.34);
      expect(transactionCalls[0][0].data.nome).toBe('Notebook (1/3)');
      expect(transactionCalls[0][0].data.numeroParcela).toBe(1);
      expect(transactionCalls[0][0].data.isParcela).toBe(true);

      // Parcela 2: 33.33
      expect(transactionCalls[1][0].data.valor).toBe(33.33);
      expect(transactionCalls[1][0].data.nome).toBe('Notebook (2/3)');
      expect(transactionCalls[1][0].data.numeroParcela).toBe(2);

      // Parcela 3: 33.33
      expect(transactionCalls[2][0].data.valor).toBe(33.33);
      expect(transactionCalls[2][0].data.nome).toBe('Notebook (3/3)');
      expect(transactionCalls[2][0].data.numeroParcela).toBe(3);

      // Todas compartilham o mesmo parcelamentoId
      const parcelamentoId = transactionCalls[0][0].data.parcelamentoId;
      expect(parcelamentoId).toBeDefined();
      expect(transactionCalls[1][0].data.parcelamentoId).toBe(parcelamentoId);
      expect(transactionCalls[2][0].data.parcelamentoId).toBe(parcelamentoId);

      expect(result).toBeDefined();
    });
  });

  describe('excluirMovimentacao (Parcelamento)', () => {
    it('deve excluir todas as parcelas do mesmo parcelamentoId em transação atômica', async () => {
      (prisma.movimentacao.findFirst as jest.Mock).mockResolvedValue({
        id: 'mov-1',
        userId,
        isParcela: true,
        parcelamentoId: 'parc-group-1',
        totalParcelas: 3
      });

      (prisma.movimentacao.deleteMany as jest.Mock).mockResolvedValue({ count: 3 });

      const res = await excluirMovimentacao({ id: 'mov-1', userId });

      expect(prisma.$transaction).toHaveBeenCalled();
      expect(prisma.movimentacao.deleteMany).toHaveBeenCalledWith({
        where: {
          parcelamentoId: 'parc-group-1',
          userId
        }
      });
      expect(res.success).toBe(true);
    });
  });

  describe('atualizarMovimentacao (Parcelamento)', () => {
    it('deve sincronizar campos compartilhados e deslocar datas de parcelas subsequentes', async () => {
      const parcelamentoId = 'parc-group-1';
      const existing = {
        id: 'mov-2',
        nome: 'Celular (2/3)',
        valor: 100,
        data: new Date('2026-12-10T00:00:00.000Z'),
        tipo: 'SAIDA',
        metodoPagamento: 'CARTAO',
        categoriaId,
        userId,
        isParcela: true,
        parcelamentoId,
        numeroParcela: 2,
        totalParcelas: 3
      };

      (prisma.movimentacao.findFirst as jest.Mock).mockResolvedValue(existing);

      const grupo = [
        {
          id: 'mov-1',
          nome: 'Celular (1/3)',
          valor: 100,
          data: new Date('2026-11-10T00:00:00.000Z'),
          numeroParcela: 1,
          totalParcelas: 3
        },
        existing,
        {
          id: 'mov-3',
          nome: 'Celular (3/3)',
          valor: 100,
          data: new Date('2027-01-10T00:00:00.000Z'),
          numeroParcela: 3,
          totalParcelas: 3
        }
      ];

      (prisma.movimentacao.findMany as jest.Mock).mockResolvedValue(grupo);
      (prisma.movimentacao.update as jest.Mock).mockImplementation(({ where, data }) =>
        Promise.resolve({ id: where.id, ...data })
      );

      // Adiantar data em 5 dias: de 2026-12-10 para 2026-12-15
      const novaData = '2026-12-15T00:00:00.000Z';
      await atualizarMovimentacao({
        id: 'mov-2',
        userId,
        nome: 'Smartphone',
        valor: 150,
        data: novaData
      });

      expect(prisma.$transaction).toHaveBeenCalled();
      const updateCalls = (prisma.movimentacao.update as jest.Mock).mock.calls;
      expect(updateCalls).toHaveLength(3);

      // Parcela 1: data permanece inalterada
      expect(updateCalls[0][0].data.nome).toBe('Smartphone (1/3)');
      expect(updateCalls[0][0].data.valor).toBe(150);
      expect(new Date(updateCalls[0][0].data.data).toISOString()).toBe(new Date('2026-11-10T00:00:00.000Z').toISOString());

      // Parcela 2: nova data
      expect(updateCalls[1][0].data.nome).toBe('Smartphone (2/3)');
      expect(new Date(updateCalls[1][0].data.data).toISOString()).toBe(new Date(novaData).toISOString());

      // Parcela 3: data deslocada em +5 dias (2027-01-15)
      expect(updateCalls[2][0].data.nome).toBe('Smartphone (3/3)');
      expect(new Date(updateCalls[2][0].data.data).toISOString()).toBe(new Date('2027-01-15T00:00:00.000Z').toISOString());
    });
  });
});

