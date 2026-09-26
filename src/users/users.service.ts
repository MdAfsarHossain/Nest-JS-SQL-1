/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable prettier/prettier */
import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { Profile } from 'src/profile/profile.entity';
import { ConfigService } from '@nestjs/config';
import { table } from 'console';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    
        @InjectRepository(Profile)
        private profileRepository: Repository<Profile>,

        private readonly configService: ConfigService
    )
    {}

    public async getAllUsers() {
        const environment = this.configService.get('NODE_ENV');
        // const environment = process.env.NODE_ENV;
        console.log(environment);
        
        // Eager Loading
        // return await this.userRepository.find({
        //     relations: {
        //         profile: true
        //     }
        // });

        // return this.userRepository.find();

        // NOTE: 
        // DB Connection Error Handling
        try {
            return await this.userRepository.find({
                relations: {
                    profile: true
                }
            });
        }
        catch (error: any) {
            console.error('Error connecting to the database:', error);
            
            if(error.code === 'ECONNREFUSED') {
                throw new RequestTimeoutException('Database connection refused. Please check your database server.', {
                    description: 'Database connection error',
                });
            }
            throw new RequestTimeoutException('An error occurred while connecting to the database. Please try again later.', {
                description: 'Database connection error',
            });
        }
    }

    public async getUserById(userId: number) {
        const user =  await this.userRepository.findOne({
            where: {id: userId}
        })

        if(!user) {
            // throw new NotFoundException('This user does not exist!')

            throw new HttpException({
                status: HttpStatus.NOT_FOUND,
                error: `The user with the given id ${userId} does not exist!`,
                table: 'users'
            }, HttpStatus.NOT_FOUND, {
                description: 'User not found in the database',
            })
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
        try {
            // Create a profile & Save
            userDto.profile = userDto.profile ?? {};

            // Check if user with same username / email already exists
            const existingUser = await this.userRepository.findOne({
                where: [
                    { email: userDto.email },
                    { username: userDto.username }
                ]
            });

            if (existingUser) {
                throw new BadRequestException('A user with the given email or username already exists.');
            }

            // Create User Object
            let user = this.userRepository.create(userDto);

            // Save the user object
            return await this.userRepository.save(user);
        } catch (error: any) {
            console.error('Error connecting to the database:', error);
            // throw new Error('Database connection error');
            // throw new RequestTimeoutException('An error occurred while connecting to the database. Please try again later.', {
            //     description: 'Database connection error',
            // });
            
            if(error.code === 'ECONNREFUSED') {
                throw new RequestTimeoutException('Database connection refused. Please check your database server.', {
                    description: 'Database connection error',
                });
            }
            // if(error.code === '23505') {
            //     throw new BadRequestException('A user with the given email or username already exists.'
            //     );
            // }

            throw error; // Re-throw the error to be handled by the global exception filter
        }
    }

    // Delete User
    public async deleteUser(id: number) {
        // First find the user
        let user = await this.userRepository.findOne({
            where: { id },
            relations: { profile: true },
        })

        if(!user) {
            return {message: "User not found!"};
        }

        // Then delete the user
        await this.userRepository.delete(id);

        // Then delete the profile (if the user has one)
        if (user.profile) {
            await this.profileRepository.delete(user.profile.id)
        }

        return {deleted: true}
    }
}
