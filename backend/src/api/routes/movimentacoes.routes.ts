import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { criarMovimentacao, CriarMovimentacaoDTO } from '../../services/movimentacoes.service';

export default async function movimentacoesRoutes(fastify: FastifyInstance) {
  // Protege todas as rotas de movimentações para exigirem token
  fastify.addHook('onRequest', async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.status(401).send({ message: 'Não autorizado' });
    }
  });

  fastify.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const { nome, valor, data, tipo, metodoPagamento, categoriaId } = request.body as Omit<CriarMovimentacaoDTO, 'userId'>;
    const user = request.user as { sub: string };

    if (!nome || !valor || !data || !tipo || !metodoPagamento || !categoriaId) {
      return reply.status(400).send({ message: 'Todos os campos são obrigatórios' });
    }

    if (valor <= 0) {
      return reply.status(400).send({ message: 'O valor deve ser maior que zero' });
    }

    try {
      const movimentacao = await criarMovimentacao({
        nome,
        valor,
        data,
        tipo,
        metodoPagamento,
        categoriaId,
        userId: user.sub // userId extraído do JWT Token
      });

      return reply.status(201).send(movimentacao);
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ message: 'Erro ao criar movimentação' });
    }
  });
}
