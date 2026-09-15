/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>)
    {}

    getAllUsers() {
        return this.userRepository.find();
    }

    public async getUserById(userId: number) {
        const user =  await this.userRepository.findOne({
            where: {id: userId}
        })

        if(!user) {
            return 'This user does not exist!'
        }

        return user;
    }

    public async createUser(userDto: CreateUserDto) {

        // validate if a user exist with the given email
        const user = await this.userRepository.findOne({
            where: {email: userDto.email}
        })

        // Handle the error / exception
        if(user) {
            return 'The user with the given email already exists!'
        }

        // Create that user 
        // let newUser = this.userRepository.create(userDto);
        // newUser = await this.userRepository.save(newUser);
        // return newUser;

    const newUser = this.userRepository.create({
        email: userDto.email,
        username: userDto.username,
        password: userDto.password,
    });

    const savedUser = await this.userRepository.save(newUser);

    return savedUser;
    }
}
