/* eslint-disable prettier/prettier */
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AllowAnonymous } from './decorators/allow-anonymous.decorator';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
    constructor(

        private readonly authService: AuthService,
    ) {}

    @AllowAnonymous()
    @Post()
    @HttpCode(HttpStatus.OK)
    login(@Body() user: {email: string, password: string}) {
        return this.authService.login(user.email, user.password);
    }

    @AllowAnonymous()
    @Post('signup')
    public async signUp(@Body() createUserDto: any) {
        return await this.authService.signUp(createUserDto);
    }

    @AllowAnonymous()
    @Post('refresh-token')
    @HttpCode(HttpStatus.OK)
    public async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
       return  this.authService.refreshToken(refreshTokenDto.refreshToken);
    }
}
