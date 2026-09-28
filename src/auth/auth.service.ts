import { forwardRef, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import authConfig from './config/auth.config';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { HashingProvider } from './provider/hashing.provider';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(
        @Inject(forwardRef(() => UsersService)) // Use forwardRef to resolve circular dependency
        // @Inject()
        private readonly userService: UsersService,

        @Inject(authConfig.KEY)
        private readonly authConfiguration: ConfigType<typeof authConfig>,

        private readonly hashingProvider: HashingProvider,
        private readonly jwtService: JwtService,
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
        // GENERATE JWT & SEND IT IN THE RESPONSE 
        const token = await this.jwtService.signAsync({
            sub: user.id,
            email: user.email
        }, {
            secret: this.authConfiguration.secret,
            expiresIn: this.authConfiguration.expiresIn,
            audience: this.authConfiguration.audience,
            issuer: this.authConfiguration.issuer
        })

        return { 
            success: true,
            message: `User ${email} logged in successfully`,
            // data: user 
            token: token
        };
        
    }

    public async signUp(createUserDto: CreateUserDto) {
        return this.userService.createUser(createUserDto);
    }

}
