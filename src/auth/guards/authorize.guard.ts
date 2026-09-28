import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Request } from "express";
import { Observable } from "rxjs";


export class AuthorizeGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        // throw new Error("Method not implemented.");

        // 1. Extract request from execution context
        const request: Request = context.switchToHttp().getRequest();

        // 2. Extract token from the request header
        // Bearer actual-json-web-token = ['Bearer', 'actual-json-web-token']
        const token = request.headers.authorization?.split(' ')[1]
        console.log(token);
        

        // 3. Validate token and provide / deny access

        return true
    }
}