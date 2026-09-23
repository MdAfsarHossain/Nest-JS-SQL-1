/* eslint-disable @typescript-eslint/no-floating-promises */
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // drop properties that have no decorator on the DTO
      forbidNonWhitelisted: true, // ...and reject the request when they are present
      transform: true, // turn the plain body into an actual DTO instance
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

// FOR MAC
// "start:test": "NODE_ENV=test nest start --watch",
