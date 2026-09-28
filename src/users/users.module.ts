/* eslint-disable prettier/prettier */
import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Profile } from 'src/profile/profile.entity';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import authConfig from 'src/auth/config/auth.config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
  imports: [
    PaginationModule,
    TypeOrmModule.forFeature([User, Profile]),
    forwardRef(() => AuthModule),
    ConfigModule.forFeature(authConfig), // For UseGurad()
    JwtModule.registerAsync(authConfig.asProvider()), // For UseGurad
  ]
})
export class UsersModule {}
