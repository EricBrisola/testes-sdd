import { FastifyInstance } from 'fastify';
import { verifyGoogleTokenAndGetUser } from '../../services/auth.service';

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/api/auth/google', async (request, reply) => {
    const { token } = request.body as { token: string };
    if (!token) {
      return reply.status(400).send({ message: 'Token is required' });
    }

    try {
      const user = await verifyGoogleTokenAndGetUser(token);
      
      const jwtToken = fastify.jwt.sign({ 
        id: user.id, 
        email: user.email, 
        nome: user.nome 
      });

      reply
        .setCookie('token', jwtToken, {
          domain: 'localhost',
          path: '/',
          secure: false,
          httpOnly: true,
          sameSite: 'lax'
        })
        .send({ message: 'Authenticated successfully', user });
    } catch (error) {
      request.log.error(error);
      reply.status(401).send({ message: 'Authentication failed' });
    }
  });

  fastify.post('/api/auth/logout', async (request, reply) => {
    reply
      .clearCookie('token', { path: '/' })
      .send({ message: 'Logged out successfully' });
  });
}
