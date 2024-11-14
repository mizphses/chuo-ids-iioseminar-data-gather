import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { PrismaClient } from '@prisma/client';
import { PrismaD1 } from '@prisma/adapter-d1';

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.use('/*', cors());

app.get('/', async (c) => {
  const adapter = new PrismaD1(c.env.DB);
  const prisma = new PrismaClient({ adapter });

  const messageBoard = await prisma.messageBoard.findMany();

  return c.json({ data: messageBoard });
});

type messageBoard = {
  email: string;
  name: string;
  message: string;
};

app.post('/post', async (c) => {
  const adapter = new PrismaD1(c.env.DB);
  const prisma = new PrismaClient({ adapter });

  const content = await c.req.json<messageBoard>();

  const messageBoard = await prisma.messageBoard.create({
    data: {
      email: content.email,
      name: content.name,
      message: content.message,
    },
  });

  return c.json({ data: messageBoard });
});

export default app;
