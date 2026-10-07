/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prefer-const */
import { Injectable } from '@nestjs/common';
import { HashingProvider } from './hashing.provider';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptProvider implements HashingProvider {
    public async hashPassword(password: string | Buffer): Promise<string> {
        // GENERATE SALT
        let salt = await bcrypt.genSalt();

        // HASH PASSWORD WITH SALT
        let hashedPassword = await bcrypt.hash(password.toString(), salt);

        // RETURN HASHED PASSWORD
        return hashedPassword;
    }

    public async comparePassword(plainPassword: string | Buffer, hashedPassword: string | Buffer): Promise<boolean> {
        // COMPARE PASSWORDS
        let isMatch = await bcrypt.compare(plainPassword.toString(), hashedPassword.toString());
        return isMatch;
    }
}
