import { IsEmail, IsNotEmpty, IsString, Length, } from 'class-validator'

export class RegisterUserDto {

  @IsString()
  @IsNotEmpty() 
  @Length(1, 100)
  username: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  @IsEmail() 
  email: string

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  password: string;
}
