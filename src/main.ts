import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Configurar CORS
  app.enableCors({
    origin: '*',
    credentials: true,
  });
  
  // Servir archivos estáticos
  app.useStaticAssets(join(__dirname, '..', 'public'));
  
  // Validación global
  app.useGlobalPipes(new ValidationPipe());
  
  await app.listen(process.env.PORT ?? 3000);
  console.log(`🚀 Servidor corriendo en http://localhost:${process.env.PORT ?? 3000}`);
  console.log(`🌐 Cliente web disponible en http://localhost:${process.env.PORT ?? 3000}/chat-client.html`);
}
bootstrap();
