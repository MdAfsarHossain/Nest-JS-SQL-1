/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { Profile } from 'src/profile/profile.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    
        @InjectRepository(Profile)
        private profileRepository: Repository<Profile>
    )
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

    // public async createUser(userDto: CreateUserDto) {

    //     // validate if a user exist with the given email
    //     const user = await this.userRepository.findOne({
    //         where: {email: userDto.email}
    //     })

    //     // Handle the error / exception
    //     if(user) {
    //         return 'The user with the given email already exists!'
    //     }

    //     // Create that user 
    //     // let newUser = this.userRepository.create(userDto);
    //     // newUser = await this.userRepository.save(newUser);
    //     // return newUser;

    // const newUser = this.userRepository.create({
    //     email: userDto.email,
    //     username: userDto.username,
    //     password: userDto.password,
    // });

    // const savedUser = await this.userRepository.save(newUser);

    // return savedUser;
    // }

    // Create User
    
    
    // public async createUser(userDto: CreateUserDto){

    //     console.log(userDto);

    //     // Keep the profile out of the user payload, it is saved separately below
    //     const { profile: profileDto, ...userData } = userDto;

    //     // Create A profile & save
    //     const profile = this.profileRepository.create(profileDto ?? {});
    //     await this.profileRepository.save(profile)

    //     // Create User Object 
    //     const user = this.userRepository.create(userData);

    //     // Set the profile
    //     user.profile = profile; 

    //     // Save the user object
    //     return await this.userRepository.save(user);
    // }




    // Create User
    public async createUser(userDto: CreateUserDto) {
        // Create a profile & Save
        userDto.profile = userDto.profile ?? {};

        // Create User Object
        let user = this.userRepository.create(userDto);

        // Save the user object
        return await this.userRepository.save(user);
    }
}
