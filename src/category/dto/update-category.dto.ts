import { Transform } from "class-transformer";
import { IsOptional, IsString, Length } from "class-validator";

export class UpdateCategoryDto {

    @IsString()
    @Length(1, 100)
    @IsOptional()
    @Transform(({ value }) => {
        if(typeof value !== 'string' || value.length === 0) {
            return value
        }
        return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
    })
    categoryName?: string;

    @IsString()
    @IsOptional() 
    description?: string;
}