/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
// import { AuthorizeGuard } from 'src/auth/guards/authorize.guard';

@Controller('users')
// @UseGuards(AuthorizeGuard)
export class UsersController {
    constructor(private usersService: UsersService) {
        
    }

    // @UseGuards(AuthorizeGuard)
    @Get()
    getAllUsers(
        @Query() paginationQueryDto: PaginationQueryDto
    ) {
        return this.usersService.getAllUsers(paginationQueryDto);
    }

    // @UseGuards(AuthorizeGuard)
    @Get(':userId')
    getUserById(@Param('userId') userId: number) {
        return this.usersService.getUserById(userId)
    }

    @Post()
    createUser(@Body() user: CreateUserDto) {
        return this.usersService.createUser(user);
    }

    @Delete(":id")
    public deleteUser(@Param("id", ParseIntPipe) id: number) {
        return this.usersService.deleteUser(id);
    }
}
