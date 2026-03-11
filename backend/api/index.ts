import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';

let cachedServer: any;

export default async function bootstrap(req: any, res: any) {
  try {
    if (!cachedServer) {
      console.log('Initializing NestJS serverless instance...');
      const app = await NestFactory.create(AppModule);
      
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
      cachedServer = app.getHttpAdapter().getInstance();
      console.log('NestJS serverless initialized successfully.');
    }
    return cachedServer(req, res);
  } catch (error) {
    console.error('NestJS Serverless Error:', error);
    res.status(500).json({ 
      error: 'FUNCTION_INVOCATION_FAILED', 
      message: error instanceof Error ? error.message : 'Unknown error',
      details: String(error)
    });
  }
}
