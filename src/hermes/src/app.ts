import { PrismaClient } from '@prisma/client';
import express from 'express';

import config from './config';

import { createApolloServer } from './server/createServer';
import { seedUsers } from './database/seedUsers';
import { seedStaticExercises } from './database/seedStaticExercises';

const prisma = new PrismaClient();

const main = async () => {
  // main
  // express app
  const app = express();

  const server = createApolloServer({
    prisma,
  });

  // express middleware
  app.use(express.json({ limit: '500mb' }));

  // needed by apollo server
  await server.start();

  // await seedStaticExercises(prisma);

  server.applyMiddleware({ app });

  app.listen({ port: config.port }, () => {
    console.log(`🚀 Server ready at port http://localhost:${config.port}${server.graphqlPath}`);
  });
};

main().catch((e) => {
  console.error(e);
});
