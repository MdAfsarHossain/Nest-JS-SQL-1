import { HttpException } from "@nestjs/common";


export class UserAlreadyExistsException extends HttpException {
    constructor(fieldName: string, fieldValue: string) {
        super({
            status: 400,
            error: `A user with the given ${fieldName} '${fieldValue}' already exists!`,
            table: 'users'
        }, 400, {
            description: 'User already exists in the database',
        });
    }
}
