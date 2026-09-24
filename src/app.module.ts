/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { User } from './users/user.entity';
import { ProfileModule } from './profile/profile.module';
import { TweetModule } from './tweet/tweet.module';
import { HashtagModule } from './hashtag/hashtag.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
// import { appConfig } from './config/app.config';
import { AuthModule } from './auth/auth.module';
import  envValidator  from './config/env.validation';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV ? '.env' : `.env.${ENV.trim()}`, //  .env path
      load: [appConfig, databaseConfig], // load custom config file
      validate: (config: Record<string, any>) => {
        const { error, value } = envValidator.validate(config, {
          allowUnknown: true,
          abortEarly: false,
        });
        if (error) {
          throw new Error(`Config validation error: ${error.message}`);
        }
        return value;
      }, // validate env variables with Joi
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        // entities: [User],
        // autoLoadEntities: true, // it's auto load all entities
        // synchronize: true,
        // host: configService.get<string>('DB_HOST'),
        // port: Number(configService.get<string>('DB_PORT')),
        // username: configService.get<string>('DB_USERNAME'),
        // password: configService.get<string>('DB_PASSWORD'),
        // database: configService.get<string>('DB_NAME'),

        autoLoadEntities: configService.get<boolean>('database.autoLoadEntities'),
        synchronize: configService.get<boolean>('database.synchronize'),
        host: configService.get<string>('database.host'),
        port: Number(configService.get<string>('database.port')),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.name'),
      }),
    }),

    //   TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],

    //   useFactory: (configService: ConfigService) => {
    //     console.log('========== DATABASE CONFIG ==========');
    //     console.log('NODE_ENV:', process.env.NODE_ENV);
    //     console.log('DB_NAME:', configService.get<string>('DB_NAME'));
    //     console.log('DB_HOST:', configService.get<string>('DB_HOST'));
    //     console.log('DB_USERNAME:', configService.get<string>('DB_USERNAME'));
    //     console.log('=====================================');

    //     return {
    //       type: 'postgres',
    //       autoLoadEntities: true,
    //       synchronize: true,

    //       host: configService.get<string>('DB_HOST'),
    //       port: Number(configService.get<string>('DB_PORT')),
    //       username: configService.get<string>('DB_USERNAME'),
    //       password: configService.get<string>('DB_PASSWORD'),
    //       database: configService.get<string>('DB_NAME'),
    //     };
    //   },
    // }),
    ProfileModule,
    TweetModule,
    HashtagModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
