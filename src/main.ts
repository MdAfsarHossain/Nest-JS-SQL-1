/* eslint-disable prettier/prettier */
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
      transformOptions: {
        enableImplicitConversion: true, // allow implicit type conversion (e.g., string to number)
      }
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

// FOR MAC
// "start:dev": "NODE_ENV=development nest start --watch",
// "start:test": "NODE_ENV=test nest start --watch",

// FOR WINDOWS
// "start:dev": "SET NODE_ENV=development && nest start --watch",
// "start:test": "SET NODE_ENV=test&& nest start --watch",

// Supabase Row Level Security Enable
// ALTER TABLE public."user"        ENABLE ROW LEVEL SECURITY;
// ALTER TABLE public.profile       ENABLE ROW LEVEL SECURITY;
// ALTER TABLE public.tweet         ENABLE ROW LEVEL SECURITY;
// ALTER TABLE public.hashtag       ENABLE ROW LEVEL SECURITY;
// ALTER TABLE public.tweet_hashtags_hashtag ENABLE ROW LEVEL SECURITY;
