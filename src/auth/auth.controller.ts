import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AllowAnonymous } from './decorators/allow-anonymous.decorator';

@Controller('auth')
export class AuthController {
    constructor(

        private readonly authService: AuthService,
    ) {}

    @AllowAnonymous()
    @Post()
    login(@Body() user: {email: string, password: string}) {
        return this.authService.login(user.email, user.password);
    }

    @Post('signup')
    public async signUp(@Body() createUserDto: any) {
        return await this.authService.signUp(createUserDto);
    }
}
