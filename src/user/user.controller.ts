import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Response } from 'express';
import { Public } from 'src/decorator/public.decorator';

@Controller('api/users')
export class UserController {
  constructor(private userService: UserService){}

  @Public()
  @Post()
  @HttpCode(201)
  async register(@Body() data: RegisterUserDto) {
    const result = await this.userService.registerUser(data)
    return {
      data: result
    }
  }

  @Public()
  @Post('/login')
  @HttpCode(200)
  async login(@Body() data: LoginUserDto, @Res() res: Response) {
    const result = await this.userService.loginUser(data)

    res.cookie('access_token', result, {
      maxAge: 7 * 60 * 60 * 1000, 
      httpOnly: true,
      sameSite: 'lax'
    })

    return res.status(200).json({ data: result }) 
  }
}
