import { IsNotEmpty,  IsOptional,  IsString, Length } from "class-validator";

export class UpdatePostDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  @IsOptional()
  title?: string

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  content?: string

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  excerpt?: string;

}



