import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthService } from 'src/common/jwt.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private jwt: JwtAuthService){}

  async registerUser(data: RegisterUserDto) {
    const hashedPassword = await bcrypt.hash(data.password, 10)

    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email }
    });

    if(existingUser) {
      throw new BadRequestException('User already exists')
    }

    const user = await this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword
      }
    });

    return user; 
  };

  async loginUser(data: LoginUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { 
        email: data.email, 
      }, 
    });

    if(!user) {
      throw new NotFoundException('User not found')
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password)
    if(!isPasswordValid) {
      throw new BadRequestException('Email or password is wrong')
    }

    const token = await this.jwt.sign({ sub: user.id, email: user.email, role: user.role })

    return token;

  }

} 
