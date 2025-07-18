import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

// TODO: Config
// TODO: Faire les test par controller

// TODO: front : 1 une page sign up, sign in, admin page, user page
// TODO: front jwt token dans le local storage
// TODO: Front rendre visible les étapes du workflow, changer l'input pour recommancer un workflow
