import {
  criarCategoria,
  listarCategorias,
  atualizarCategoria,
  excluirCategoria,
  garantirCategoriasPadrao,
  AppError,
  prisma
} from '../../src/services/categorias.service';

jest.mock('@prisma/client', () => {
  const mPrisma = {
    categoria: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      createMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    },
    $transaction: jest.fn((actions: any[]) => Promise.all(actions))
  };
  return {
    PrismaClient: jest.fn(() => mPrisma)
  };
});

describe('Categorias Service', () => {
  const userId = 'user-123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('garantirCategoriasPadrao', () => {
    it('deve criar categorias padrão quando o usuário não tiver nenhuma', async () => {
      (prisma.categoria.count as jest.Mock).mockResolvedValue(0);
      (prisma.categoria.createMany as jest.Mock).mockResolvedValue({ count: 3 });

      await garantirCategoriasPadrao(userId);

      expect(prisma.categoria.createMany).toHaveBeenCalledWith({
        data: expect.arrayContaining([
          { nome: 'Alimentação', userId },
          { nome: 'Geral', userId },
          { nome: 'Lazer', userId }
        ])
      });
    });

    it('não deve criar categorias se o usuário já tiver alguma cadastrada', async () => {
      (prisma.categoria.count as jest.Mock).mockResolvedValue(2);

      await garantirCategoriasPadrao(userId);

      expect(prisma.categoria.createMany).not.toHaveBeenCalled();
    });
  });

  describe('criarCategoria', () => {
    it('deve rejeitar categoria com nome vazio ou apenas espaços', async () => {
      await expect(criarCategoria({ nome: '   ', userId })).rejects.toThrow(
        new AppError('O nome da categoria é obrigatório e não pode ser vazio', 400)
      );
    });

    it('deve rejeitar categoria com nome duplicado para o mesmo usuário', async () => {
      (prisma.categoria.findFirst as jest.Mock).mockResolvedValue({
        id: 'cat-1',
        nome: 'Alimentação',
        userId
      });

      await expect(criarCategoria({ nome: 'alimentação', userId })).rejects.toThrow(
        new AppError('Já existe uma categoria cadastrada com este nome', 409)
      );
    });

    it('deve criar e retornar a nova categoria com nome normalizado (trimmed)', async () => {
      (prisma.categoria.findFirst as jest.Mock).mockResolvedValue(null);
      const fakeCreated = { id: 'cat-99', nome: 'Transporte', userId };
      (prisma.$transaction as jest.Mock).mockResolvedValue([fakeCreated]);

      const result = await criarCategoria({ nome: '  Transporte  ', userId });

      expect(result).toEqual(fakeCreated);
      expect(prisma.$transaction).toHaveBeenCalled();
    });
  });

  describe('listarCategorias', () => {
    it('deve retornar lista de categorias ordenadas alfabeticamente', async () => {
      (prisma.categoria.count as jest.Mock).mockResolvedValue(3);
      const fakeList = [
        { id: '1', nome: 'Alimentação', userId },
        { id: '2', nome: 'Geral', userId },
        { id: '3', nome: 'Lazer', userId }
      ];
      (prisma.categoria.findMany as jest.Mock).mockResolvedValue(fakeList);

      const result = await listarCategorias(userId);

      expect(result).toEqual(fakeList);
      expect(prisma.categoria.findMany).toHaveBeenCalledWith({
        where: { userId },
        orderBy: { nome: 'asc' }
      });
    });
  });

  describe('atualizarCategoria', () => {
    it('deve rejeitar atualização com nome vazio', async () => {
      await expect(
        atualizarCategoria({ id: 'cat-1', nome: '  ', userId })
      ).rejects.toThrow(new AppError('O nome da categoria é obrigatório e não pode ser vazio', 400));
    });

    it('deve retornar 404 se a categoria não pertencer ao usuário', async () => {
      (prisma.categoria.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(
        atualizarCategoria({ id: 'cat-inexistente', nome: 'Novo Nome', userId })
      ).rejects.toThrow(new AppError('Categoria não encontrada', 404));
    });

    it('deve retornar 409 se o novo nome colidir com outra categoria do usuário', async () => {
      (prisma.categoria.findFirst as jest.Mock)
        .mockResolvedValueOnce({ id: 'cat-1', nome: 'Antigo', userId }) // encontrada
        .mockResolvedValueOnce({ id: 'cat-2', nome: 'Novo Nome', userId }); // duplicada

      await expect(
        atualizarCategoria({ id: 'cat-1', nome: 'Novo Nome', userId })
      ).rejects.toThrow(new AppError('Já existe uma categoria cadastrada com este nome', 409));
    });

    it('deve atualizar com sucesso', async () => {
      (prisma.categoria.findFirst as jest.Mock)
        .mockResolvedValueOnce({ id: 'cat-1', nome: 'Antigo', userId })
        .mockResolvedValueOnce(null);

      const fakeUpdated = { id: 'cat-1', nome: 'Nome Atualizado', userId };
      (prisma.$transaction as jest.Mock).mockResolvedValue([fakeUpdated]);

      const result = await atualizarCategoria({ id: 'cat-1', nome: 'Nome Atualizado', userId });

      expect(result).toEqual(fakeUpdated);
    });
  });

  describe('excluirCategoria', () => {
    it('deve retornar 404 se a categoria não pertencer ao usuário', async () => {
      (prisma.categoria.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(excluirCategoria({ id: 'cat-999', userId })).rejects.toThrow(
        new AppError('Categoria não encontrada', 404)
      );
    });

    it('deve retornar 409 Conflict se houver movimentações vinculadas (P2003 Restrict)', async () => {
      (prisma.categoria.findFirst as jest.Mock).mockResolvedValue({ id: 'cat-1', userId });
      const p2003Error = new Error('Foreign key constraint failed');
      (p2003Error as any).code = 'P2003';
      (prisma.categoria.delete as jest.Mock).mockRejectedValue(p2003Error);

      await expect(excluirCategoria({ id: 'cat-1', userId })).rejects.toThrow(
        new AppError('Não é possível excluir esta categoria pois ela possui movimentações vinculadas', 409)
      );
    });

    it('deve excluir com sucesso quando não há dependências', async () => {
      (prisma.categoria.findFirst as jest.Mock).mockResolvedValue({ id: 'cat-1', userId });
      (prisma.categoria.delete as jest.Mock).mockResolvedValue({ id: 'cat-1' });

      await expect(excluirCategoria({ id: 'cat-1', userId })).resolves.toBeUndefined();
      expect(prisma.categoria.delete).toHaveBeenCalledWith({ where: { id: 'cat-1' } });
    });
  });
});
