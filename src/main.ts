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

// this enables RLS on everything in public:
// DO $$
// DECLARE r record;
// BEGIN
//   FOR r IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
//     EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', r.tablename);
//   END LOOP;
// END $$;

// To check it worked:
// SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';

