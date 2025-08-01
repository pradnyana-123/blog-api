import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import slugify from 'slugify';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostStatus } from '../../generated/prisma';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService){}

  async createPost(data: CreatePostDto, authorId: string) {
    const baseSlug = slugify(data.title, { lower: true, strict: true })

    const potentialSlugs: string[] = [baseSlug]
    for(let i = 1; i <= 10; i++) {
      potentialSlugs.push(`${baseSlug}-${i}`)
    }

    const existingSlugs = new Set(
      (await this.prisma.post.findMany({
        where: { slug: { in: potentialSlugs }},
        select: { slug: true }
      })).map((p) => p.slug )
    );

    let finalSlug = baseSlug;
    let counter = 0

    while(existingSlugs.has(finalSlug)) {
      counter++
      finalSlug = `${baseSlug}-${counter}`

      if(counter > 100) {
        throw new BadRequestException('Cannot make unique slug after many attempts. Please try another title')
      }
    }

    const post = await this.prisma.post.create({
      data: {
        ...data,
        slug: finalSlug,
        authorId,
        status: PostStatus.DRAFT 
      }
    });

    return post; 
  }

  async getPosts() {
    return this.prisma.post.findMany()
  }

  async getPostsBySlug(slug: string) {
    return this.prisma.post.findMany({
      where: { 
        slug: { startsWith: slug }
      }
    });
  }

  async getSinglePostBySlug(slug: string) {
    const post = await this.prisma.post.findUnique({
      where: { slug }
    });

    if(!post) {
      throw new NotFoundException('Post not found')
    }

    return post;
  } 

  async updatePost(postId: string, authorId: string, data: UpdatePostDto ) {
    const existingPost = await this.prisma.post.findUnique({
      where: { id: postId }
    });

    if(!existingPost) {
      throw new NotFoundException('Post not found')
    }

    if(existingPost.authorId !== authorId) {
      throw new ForbiddenException('You are not authorized to update this post.')
    }

    let newSlug: string | undefined

    if(data.title !== undefined) {
      const baseSlug = slugify(data.title, { lower: true, strict: true })

      const existingPostWithSameNewTitle = await this.prisma.post.findFirst({
        where: {
          AND: [
            { title: data.title },
            { id: { not: postId }}
          ]
        }
      });

      if(existingPostWithSameNewTitle) {
        throw new BadRequestException('Another post with the same title already exists.');
      }

      let finalSlug = baseSlug;

      const existingSlugsInDB = new Set(
        (await this.prisma.post.findMany({
          where: {
           AND: [
            { slug: { startsWith: `${baseSlug}`}},
            { id: { not: postId }}
           ] 
          }
        })).map((p) => p.slug )
      )

      let counter = 0;

      while(existingSlugsInDB.has(finalSlug)) {
        counter++;
        if(counter > 100) {
          throw new BadRequestException('Cannot make unique slug after many attempts. Please use another title.')
        }

        finalSlug = `${baseSlug}-${counter}`
      }

      newSlug = finalSlug
    } else {
      newSlug = existingPost.slug
    }

    const post = await this.prisma.post.update({
      where: { id: postId },
      data: {
        ...data,
        slug: newSlug        
      } 
    })

    return post;

  }

  async deletePost(postId: string, authorId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId }
    });

    if(!post) {
      throw new NotFoundException('Post not found')
    }

    if(post.authorId !== authorId) {
      throw new ForbiddenException('You are not allowed to delete this post.')
    } 

    return await this.prisma.post.delete({
      where: { id: postId }
    });

  }
}
