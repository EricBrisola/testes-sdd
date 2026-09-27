import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwtPlugin from '../plugins/jwt';
import authRoutes from './routes/auth.routes';
import usersRoutes from './routes/users.routes';

const server = Fastify({ logger: true });

server.register(cors, {
  origin: 'http://localhost:5173',
  credentials: true
});

server.register(jwtPlugin);
server.register(authRoutes);
server.register(usersRoutes);

server.get('/health', async (request, reply) => {
  return { status: 'ok', service: 'Controle de Gastos API' };
});

const start = async () => {
  try {
    await server.listen({ port: 3000, host: '0.0.0.0' });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};
start();
