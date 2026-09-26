import { Type } from "class-transformer";
import { IsOptional, IsPositive } from "class-validator";


export class PaginationQueryDto {
    
    @IsOptional()
    @IsPositive()
    // @Type(() => Number)
    limit?: number= 10;

    @IsOptional()
    @IsPositive()
    // @Type(() => Number)
    page?: number = 1;
}

// NOTE: For Type Casting
// main.ts
/*
 transformOptions: {
        enableImplicitConversion: true, // allow implicit type conversion (e.g., string to number)
      }
*/
