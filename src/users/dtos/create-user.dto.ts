/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateProfileDto } from 'src/profile/dtos/create-profile.dto';

/* eslint-disable prettier/prettier */
export class CreateUserDto {

    // @IsString({message: "First Name should be a string value."})
    // @IsNotEmpty()
    // @MinLength(3, {message: "First Name should have a minimum of 3 character."})
    // @MaxLength(100)
    // firstName: string;

    // @IsString({message: "Last Name should be a string value."})
    // @IsNotEmpty()
    // @MinLength(3, {message: "Last Name should have a minimum of 3 character."})
    // @MaxLength(100)
    // lastName: string;

    // @IsString()
    // @IsOptional()
    // @MaxLength(10)
    // gender?: string;
    
    @IsEmail()
    @IsNotEmpty()
    @MaxLength(100)
    email: string;

    @IsNotEmpty()
    @MaxLength(24)
    username: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8, {message: "Password must be 8 characters."})
    @MaxLength(100)
    password: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => CreateProfileDto)
    profile?: CreateProfileDto;
}
