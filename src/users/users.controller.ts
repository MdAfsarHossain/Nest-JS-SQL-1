/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {
        
    }

    @Get()
    getAllUsers() {
        return this.usersService.getAllUsers();
    }

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
