import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class LoginUserDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @Length(1, 100)
  email: string

  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  password: string;
}
