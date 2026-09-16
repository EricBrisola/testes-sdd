import { OAuth2Client } from 'google-auth-library';
import { PrismaClient } from '@prisma/client';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const prisma = new PrismaClient();

export async function verifyGoogleTokenAndGetUser(token: string) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  if (!payload || !payload.email) throw new Error('Invalid Google Token');

  let user = await prisma.user.findUnique({
    where: { google_id: payload.sub }
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: payload.email,
        nome: payload.name || 'User',
        google_id: payload.sub
      }
    });
  }

  return user;
}
