import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();

// TODO: Config
// TODO: Faire les test par controller

// TODO: intéger la route de création de workflow dans le front avec gestion des erreurs
// TODO: integer la route de run workflow dans le front avec gestion des erreurs

// TODO: read me gloab et pas front et back
