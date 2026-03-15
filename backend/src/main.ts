import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

const server = express();
let isAppInitialized = false; // Cache flag

export const bootstrap = async () => {
  if (isAppInitialized) return server; // Don't re-run if already up

  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  let allowedOrigins: string[] | string | undefined =
    process.env.ALLOWED_ORIGINS;

  if (typeof allowedOrigins === 'string') {
    allowedOrigins = allowedOrigins.split(',');
    console.log(allowedOrigins);
  }

  app.enableCors({
    origin: [...(allowedOrigins ?? [])].filter(Boolean),
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  await app.init();
  isAppInitialized = true;
  console.log('server', server);
  return server;
};

export default async (req: any, res: any) => {
  await bootstrap();
  server(req, res);
};
