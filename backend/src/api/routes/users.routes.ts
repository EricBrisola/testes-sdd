import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function usersRoutes(fastify: FastifyInstance) {
  fastify.get('/api/users/me', { preValidation: [fastify.authenticate] }, async (request, reply) => {
    const jwtUser = request.user as { id: string, email: string, nome: string };
    
    const user = await prisma.user.findUnique({
      where: { id: jwtUser.id }
    });

    if (!user) {
      return reply.status(404).send({ message: 'User not found' });
    }

    return user;
  });
}
