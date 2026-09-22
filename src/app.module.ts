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

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    UsersModule, 
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV ? '.env' : `.env.${ENV.trim()}` //  .env path
    }),
    TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      type: 'postgres',
      // entities: [User],
      autoLoadEntities: true, // it's auto load all entities
      synchronize: true,
      host: configService.get<string>('DB_HOST'),
      port: Number(configService.get<string>('DB_PORT')),
      username: configService.get<string>('DB_USERNAME'),
      password: configService.get<string>('DB_PASSWORD'),
      database: configService.get<string>('DB_NAME')
    })
  }), ProfileModule, TweetModule, HashtagModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
