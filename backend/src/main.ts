import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

const server = express();

export const bootstrap = async () => {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  app.enableCors({
    origin: [
      'http://localhost:3000',
      process.env.APP_URL, // In case it's set to something else
    ].filter(Boolean) as string[],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  await app.init(); // Important: init() instead of listen()
  return server;
};

// For Vercel's serverless environment
export default async (req: any, res: any) => {
  await bootstrap();
  server(req, res);
};
