/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';

@Module({
  imports: [UsersModule, TypeOrmModule.forRootAsync({
    imports: [],
    inject: [],
    useFactory: () => ({
      type: 'postgres',
      entities: [User],
      synchronize: true,
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'afsar',
      database: 'nestjs'
    })
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
