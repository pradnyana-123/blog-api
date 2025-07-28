import { IsNotEmpty,  IsOptional,  IsString, Length } from "class-validator";

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  title: string

  @IsString()
  @IsNotEmpty()
  content: string

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  excerpt: string;


}


