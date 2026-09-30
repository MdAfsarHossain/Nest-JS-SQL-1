import { CanActivate, ExecutionContext, Inject, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { Observable } from "rxjs";
import authConfig from "../config/auth.config";
import type { ConfigType } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { REQUEST_USER_KEY } from "src/constants/constants";


export class AuthorizeGuard implements CanActivate {

    constructor(
        private readonly jwtService: JwtService,

        @Inject(authConfig.KEY)
        private readonly authConfiguration: ConfigType<typeof authConfig>,

        private readonly reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // throw new Error("Method not implemented.");

        // READ isPublic MetaData
        const isPublic = this.reflector.getAllAndOverride('isPublic', [
            context.getHandler(), // login, signup
            context.getClass(), // Controller Class [AuthController]
        ])

        if(isPublic) {
            return true
        }

        // 1. Extract request from execution context
        const request: Request = context.switchToHttp().getRequest();

        // 2. Extract token from the request header
        // Bearer actual-json-web-token = ['Bearer', 'actual-json-web-token']
        const token = request.headers.authorization?.split(' ')[1]
        console.log(token);
        

        // 3. Validate token and provide / deny access
        if(!token) {
            throw new UnauthorizedException();
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, this.authConfiguration)

            // request['user'] = payload;
            request[REQUEST_USER_KEY] = payload;

            // console.log(payload);
            
        } catch(error) {
            throw new UnauthorizedException();
        }

        return true
    }
}