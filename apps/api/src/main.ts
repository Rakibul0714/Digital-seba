import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const swaggerConfig = new DocumentBuilder()
    .setTitle('SmartSeba API')
    .setDescription('Union Parishad digital service API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, swaggerConfig));

  const http = app.getHttpAdapter();
  http.get('/', (_req: unknown, res: { json: (data: Record<string, unknown>) => void }) =>
    res.json({ ok: true, service: 'digital-seba-api', status: 'running', docs: '/docs', api: '/api/v1/health' })
  );
  http.get('/api', (_req: unknown, res: { json: (data: Record<string, unknown>) => void }) =>
    res.json({ ok: true, service: 'digital-seba-api', status: 'running', baseUrl: '/api/v1' })
  );

  await app.listen(process.env.PORT ?? 4000, '0.0.0.0');
  console.log(`API running on http://localhost:${process.env.PORT ?? 4000}`);
}
bootstrap();
