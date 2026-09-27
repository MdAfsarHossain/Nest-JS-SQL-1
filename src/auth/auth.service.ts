import { forwardRef, Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import authConfig from './config/auth.config';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';

@Injectable()
export class AuthService {

    constructor(
        @Inject(forwardRef(() => UsersService)) // Use forwardRef to resolve circular dependency
        // @Inject()
        private readonly userService: UsersService,

        @Inject(authConfig.KEY)
        private readonly authConfiguration: ConfigType<typeof authConfig>,

    ) {}


    public async login(email: string, password: string) {
        console.log(this.authConfiguration.sharedSecret); // Access the shared secret from the configuration
        return { 
            message: `User ${email} logged in successfully` 
        };
        
    }

    public async signUp(createUserDto: CreateUserDto) {
        return this.userService.createUser(createUserDto);
    }

}
