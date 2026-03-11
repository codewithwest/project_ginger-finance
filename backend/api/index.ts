import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';

const server = express();

let isServerInitialized = false;

async function bootstrap() {
  if (!isServerInitialized) {
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(server),
    );
    
    app.enableCors({
      origin: [
        'http://localhost:3000',
        'https://dev-ginger-finance.vercel.app',
        process.env.APP_URL,
      ].filter(Boolean) as string[],
      credentials: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      allowedHeaders: 'Content-Type, Accept, Authorization',
    });
    
    await app.init();
    isServerInitialized = true;
  }
  return server;
}

export default async function (req: any, res: any) {
  const app = await bootstrap();
  app(req, res);
}
