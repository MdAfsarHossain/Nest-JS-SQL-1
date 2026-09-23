/* eslint-disable prettier/prettier */
import { IsDate, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { Type } from "class-transformer";

export class CreateProfileDto {
    @IsString({message: "First Name should be a string value."})
    @IsOptional()
    @MinLength(3, {message: "First Name should have a minimum of 3 characters."})
    @MaxLength(100)
    firstName?: string;

    @IsString({message: "Last Name should be a string value."})
    @IsOptional()
    @MinLength(3, {message: "Last Name should have a minimum of 3 characters."})
    @MaxLength(100)
    lastName?: string;

    @IsString()
    @IsOptional()
    @MaxLength(10)
    gender?: string;

    @IsOptional()
    @Type(() => Date)
    @IsDate({message: "Date of Birth must be a valid date (e.g. 2025-02-12)."})
    dateOfBirth?: Date;

    @IsString()
    @IsOptional()
    bio?: string;

    @IsString()
    @IsOptional()
    profileImage?: string;
}