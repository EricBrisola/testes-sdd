import fp from 'fastify-plugin';
import fastifyJwt from '@fastify/jwt';
import fastifyCookie from '@fastify/cookie';
import { FastifyInstance } from 'fastify';

export default fp(async (fastify: FastifyInstance) => {
  fastify.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || 'fallback-secret',
    cookie: {
      cookieName: 'token',
      signed: false
    }
  });

  fastify.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET || 'cookie-secret',
    parseOptions: {}
  });

  fastify.decorate('authenticate', async function (request: any, reply: any) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.status(401).send({ message: 'Unauthorized' });
    }
  });
});

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: any;
  }
}
