import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PostService } from './post.service';
import { Request } from 'express';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('api/posts')
export class PostController {
  constructor(private postService: PostService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() data: CreatePostDto, @Req() req: Request) {
    const authorId = req.user.sub;

    const result = await this.postService.createPost(data, authorId);

    return {
      data: result,
    };
  }

  @Get()
  @HttpCode(200)
  async get() {
    const result = await this.postService.getPosts();

    return {
      data: result,
    };
  }

  @Get()
  @HttpCode(200)
  async getBySlugs(
    @Query('startsWithSlug') startsWithSlug?: string,
  ) {
    let posts;

    if(startsWithSlug) {
      posts = await this.postService.getPostsBySlug(startsWithSlug)
    } else {
      posts = await this.postService.getPosts()
    }

    return {
      data: posts
    }
  }


  @Get(':slug')
  @HttpCode(200)
  async getSingleBySlug(
    @Param('slug') slug: string
  ) {
    const result = await this.postService.getSinglePostBySlug(slug)

    return {
      data: result
    }
  }

  @Patch(':postId/:authorId')
  @HttpCode(200)
  async update(
    @Param('postId') postId: string,
    @Param('authorId') authorId: string,
    @Body() data: UpdatePostDto
  ) {
    const result = await this.postService.updatePost(postId, authorId, data)

    return {
      data: result
    }
  }

}
