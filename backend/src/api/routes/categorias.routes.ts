import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { criarCategoria, listarCategorias, atualizarCategoria, excluirCategoria, AppError } from '../../services/categorias.service';

interface CriarCategoriaBody {
  nome: string;
}

interface AtualizarCategoriaParams {
  id: string;
}

interface AtualizarCategoriaBody {
  nome: string;
}

export default async function categoriasRoutes(fastify: FastifyInstance) {
  // Protege todas as rotas de categorias para exigirem autenticação JWT
  fastify.addHook('onRequest', async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch {
      return reply.status(401).send({ message: 'Não autorizado' });
    }
  });

  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const user = request.user as { id?: string; sub?: string } | undefined;
    const userId = user?.id || user?.sub;
    if (!userId) {
      return reply.status(401).send({ message: 'Não autorizado' });
    }

    try {
      const categorias = await listarCategorias(userId);
      return reply.status(200).send(categorias);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ message: 'Erro ao listar categorias' });
    }
  });

  fastify.post('/', async (request: FastifyRequest<{ Body: CriarCategoriaBody }>, reply: FastifyReply) => {
    const user = request.user as { id?: string; sub?: string } | undefined;
    const userId = user?.id || user?.sub;
    if (!userId) {
      return reply.status(401).send({ message: 'Não autorizado' });
    }

    const { nome } = request.body || {};

    try {
      const categoria = await criarCategoria({
        nome,
        userId
      });

      return reply.status(201).send(categoria);
    } catch (error) {
      if (error instanceof AppError) {
        return reply.status(error.statusCode).send({ message: error.message });
      }

      fastify.log.error(error);
      return reply.status(500).send({ message: 'Erro interno ao criar categoria' });
    }
  });

  fastify.put('/:id', async (
    request: FastifyRequest<{ Params: AtualizarCategoriaParams; Body: AtualizarCategoriaBody }>,
    reply: FastifyReply
  ) => {
    const user = request.user as { id?: string; sub?: string } | undefined;
    const userId = user?.id || user?.sub;
    if (!userId) {
      return reply.status(401).send({ message: 'Não autorizado' });
    }

    const { id } = request.params;
    const { nome } = request.body || {};

    try {
      const atualizada = await atualizarCategoria({
        id,
        nome,
        userId
      });

      return reply.status(200).send(atualizada);
    } catch (error) {
      if (error instanceof AppError) {
        return reply.status(error.statusCode).send({ message: error.message });
      }

      fastify.log.error(error);
      return reply.status(500).send({ message: 'Erro interno ao atualizar categoria' });
    }
  });

  fastify.delete('/:id', async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    const user = request.user as { id?: string; sub?: string } | undefined;
    const userId = user?.id || user?.sub;
    if (!userId) {
      return reply.status(401).send({ message: 'Não autorizado' });
    }

    const { id } = request.params;

    try {
      await excluirCategoria({
        id,
        userId
      });

      return reply.status(204).send();
    } catch (error) {
      if (error instanceof AppError) {
        return reply.status(error.statusCode).send({ message: error.message });
      }

      fastify.log.error(error);
      return reply.status(500).send({ message: 'Erro interno ao excluir categoria' });
    }
  });
}
