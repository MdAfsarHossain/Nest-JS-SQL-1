/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { forwardRef, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import authConfig from './config/auth.config';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { HashingProvider } from './provider/hashing.provider';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.entity';
import { log } from 'console';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ActiveUserType } from './interfaces/active-user-type.interface';

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

        const refreshToken = await this.jwtService.signAsync({
            sub: user.id,
        }, {
            secret: this.authConfiguration.secret,
            expiresIn: this.authConfiguration.refreshTokenExpiresIn,
            audience: this.authConfiguration.audience,
            issuer: this.authConfiguration.issuer
        })

        return { 
            success: true,
            message: `User ${email} logged in successfully`,
            // data: user 
            token: token,
            refreshToken: refreshToken
        };
        
    }

    public async signUp(createUserDto: CreateUserDto) {
        return this.userService.createUser(createUserDto);
    }

    public async refreshToken(refreshTokenDto: string) {
        try {
            console.log('refreshTokenDto:', refreshTokenDto);
            // 1. Verify the refresh token
            const { sub } = await this.jwtService.verifyAsync(refreshTokenDto, {
                secret: this.authConfiguration.secret,
                audience: this.authConfiguration.audience,
                issuer: this.authConfiguration.issuer
            });

            console.log('sub:', sub);

            // 2. Find the user from db using user id
            const user = await this.userService.getUserById(sub);

            // 3. Generate new access token and refresh token
            const { token, refreshToken } = await this.generateToken(user);

            return {
                success: true,
                message: 'Token refreshed successfully',
                data: {
                    token,
                    refreshToken
                }
            };
        } catch (error) {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }

    private async signToken<T>(userId: number, expiresIn: number, payload?: T) {
        return await this.jwtService.signAsync({
            sub: userId,
            ...payload
        }, {
            secret: this.authConfiguration.secret,
            expiresIn: expiresIn,
            audience: this.authConfiguration.audience,
            issuer: this.authConfiguration.issuer
        })
    }

    private async generateToken(user: User) {
        // GENERATE ACCESS TOKEN
        const accessToken = await this.signToken<Partial<ActiveUserType>>(user.id, this.authConfiguration.expiresIn, {
            email: user.email
        });

        // GENERATE REFRESH TOKEN
        const refreshToken = await this.signToken(user.id, this.authConfiguration.refreshTokenExpiresIn);

        return {
            token: accessToken,
            refreshToken
        }
    }

}
