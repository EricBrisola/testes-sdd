import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { TipoMovimentacao, MetodoPagamento } from '@prisma/client';
import {
  criarMovimentacao,
  CriarMovimentacaoDTO,
  listarMovimentacoes,
  atualizarMovimentacao,
  excluirMovimentacao,
  AtualizarMovimentacaoDTO,
  AppError
} from '../../services/movimentacoes.service';
import { obterDadosDashboard } from '../../services/dashboard.service';

interface ListarQuery {
  categorias?: string | string[];
  tipo?: TipoMovimentacao;
  metodoPagamento?: MetodoPagamento;
  dataInicial?: string;
  dataFinal?: string;
  page?: string;
  limit?: string;
}

interface IdParams {
  id: string;
}

export default async function movimentacoesRoutes(fastify: FastifyInstance) {
  // Protege todas as rotas de movimentações para exigirem token JWT
  fastify.addHook('onRequest', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch {
      return reply.status(401).send({ message: 'Não autorizado' });
    }
  });

  // POST /api/movimentacoes - Criar movimentação
  fastify.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const { nome, valor, data, tipo, metodoPagamento, categoriaId } = request.body as Omit<CriarMovimentacaoDTO, 'userId'>;
    const user = request.user as { id?: string; sub?: string } | undefined;
    const userId = user?.id || user?.sub;

    if (!userId) {
      return reply.status(401).send({ message: 'Não autorizado' });
    }

    if (!nome || valor === undefined || !data || !tipo || !metodoPagamento || !categoriaId) {
      return reply.status(400).send({ message: 'Todos os campos são obrigatórios' });
    }

    const numValor = Number(valor);
    if (isNaN(numValor) || numValor <= 0) {
      return reply.status(400).send({ message: 'O valor deve ser maior que zero' });
    }

    try {
      const movimentacao = await criarMovimentacao({
        nome,
        valor: numValor,
        data,
        tipo,
        metodoPagamento,
        categoriaId,
        userId
      });

      return reply.status(201).send(movimentacao);
    } catch (error) {
      if (error instanceof AppError) {
        return reply.status(error.statusCode).send({ message: error.message });
      }
      return reply.status(500).send({ message: 'Erro ao criar movimentação' });
    }
  });

  // GET /api/movimentacoes - Listar movimentações com filtros e paginação
  fastify.get('/', async (request: FastifyRequest<{ Querystring: ListarQuery }>, reply: FastifyReply) => {
    const user = request.user as { id?: string; sub?: string } | undefined;
    const userId = user?.id || user?.sub;

    if (!userId) {
      return reply.status(401).send({ message: 'Não autorizado' });
    }

    const {
      categorias,
      tipo,
      metodoPagamento,
      dataInicial,
      dataFinal,
      page,
      limit
    } = request.query;

    let categoriaIds: string[] | undefined;
    if (Array.isArray(categorias)) {
      categoriaIds = categorias;
    } else if (typeof categorias === 'string' && categorias.trim().length > 0) {
      categoriaIds = categorias.split(',').map((c) => c.trim()).filter(Boolean);
    }

    try {
      const resultado = await listarMovimentacoes({
        userId,
        categoriaIds,
        tipo,
        metodoPagamento,
        dataInicial,
        dataFinal,
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined
      });

      return reply.status(200).send(resultado);
    } catch (error) {
      if (error instanceof AppError) {
        return reply.status(error.statusCode).send({ message: error.message });
      }
      return reply.status(500).send({ message: 'Erro ao listar movimentações' });
    }
  });

  // GET /api/movimentacoes/dashboard - Obter dados consolidados para o dashboard
  fastify.get('/dashboard', async (request: FastifyRequest, reply: FastifyReply) => {
    const user = request.user as { id?: string; sub?: string } | undefined;
    const userId = user?.id || user?.sub;

    if (!userId) {
      return reply.status(401).send({ message: 'Não autorizado' });
    }

    try {
      const dadosDashboard = await obterDadosDashboard(userId);
      return reply.status(200).send(dadosDashboard);
    } catch {
      return reply.status(500).send({ message: 'Erro ao gerar dados do dashboard' });
    }
  });

  // PUT /api/movimentacoes/:id - Atualizar movimentação
  fastify.put('/:id', async (request: FastifyRequest<{ Params: IdParams; Body: AtualizarMovimentacaoDTO }>, reply: FastifyReply) => {
    const user = request.user as { id?: string; sub?: string } | undefined;
    const userId = user?.id || user?.sub;

    if (!userId) {
      return reply.status(401).send({ message: 'Não autorizado' });
    }

    const { id } = request.params;
    const body = request.body;

    try {
      const atualizada = await atualizarMovimentacao({
        id,
        userId,
        nome: body.nome,
        valor: body.valor !== undefined ? Number(body.valor) : undefined,
        data: body.data,
        tipo: body.tipo,
        metodoPagamento: body.metodoPagamento,
        categoriaId: body.categoriaId
      });

      return reply.status(200).send(atualizada);
    } catch (error) {
      if (error instanceof AppError) {
        return reply.status(error.statusCode).send({ message: error.message });
      }
      return reply.status(500).send({ message: 'Erro ao atualizar movimentação' });
    }
  });

  // DELETE /api/movimentacoes/:id - Excluir movimentação
  fastify.delete('/:id', async (request: FastifyRequest<{ Params: IdParams }>, reply: FastifyReply) => {
    const user = request.user as { id?: string; sub?: string } | undefined;
    const userId = user?.id || user?.sub;

    if (!userId) {
      return reply.status(401).send({ message: 'Não autorizado' });
    }

    const { id } = request.params;

    try {
      await excluirMovimentacao({ id, userId });
      return reply.status(204).send();
    } catch (error) {
      if (error instanceof AppError) {
        return reply.status(error.statusCode).send({ message: error.message });
      }
      return reply.status(500).send({ message: 'Erro ao excluir movimentação' });
    }
  });
}
