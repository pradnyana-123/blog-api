import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService){}

  async createPost() {
     
  }
}
