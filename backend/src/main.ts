import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

const server = express();
let isAppInitialized = false; // Cache flag

export const bootstrap = async () => {
  if (isAppInitialized) return server; // Don't re-run if already up

  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  app.enableCors({
    origin: [
      'http://localhost:3000',
      process.env.APP_URL,
    ].filter(Boolean) as string[],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  await app.init();
  isAppInitialized = true;
  return server;
};

export default async (req: any, res: any) => {
  await bootstrap();
  server(req, res);
};
