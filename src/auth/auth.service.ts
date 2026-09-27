import { forwardRef, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import authConfig from './config/auth.config';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { HashingProvider } from './provider/hashing.provider';

@Injectable()
export class AuthService {

    constructor(
        @Inject(forwardRef(() => UsersService)) // Use forwardRef to resolve circular dependency
        // @Inject()
        private readonly userService: UsersService,

        @Inject(authConfig.KEY)
        private readonly authConfiguration: ConfigType<typeof authConfig>,

        private readonly hashingProvider: HashingProvider,
    ) {}


    public async login(email: string, password: string) {
        console.log(this.authConfiguration.sharedSecret); // Access the shared secret from the configuration
        
        // 1. Find the user with username
        let user = await this.userService.findUserByEmail(email)

        if(!user) {
            throw new NotFoundException('User not found')
        }

        // 2. If user is available, compare the password
        let isEqual: boolean = false;
        isEqual = await this.hashingProvider.comparePassword(password, user.password );

        if(!isEqual) {
            throw new UnauthorizedException('Incorrect Password')
        }

        // If the password match, login success - return access token


        return { 
            success: true,
            message: `User ${email} logged in successfully`,
            data: user 
        };
        
    }

    public async signUp(createUserDto: CreateUserDto) {
        return this.userService.createUser(createUserDto);
    }

}
