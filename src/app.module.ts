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
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    UsersModule, 
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
    imports: [],
    inject: [],
    useFactory: () => ({
      type: 'postgres',
      // entities: [User],
      autoLoadEntities: true, // it's auto load all entities
      synchronize: true,
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'afsar',
      database: 'nestjs'
    })
  }), ProfileModule, TweetModule, HashtagModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
