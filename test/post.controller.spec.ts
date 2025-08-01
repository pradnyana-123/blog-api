import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication,  ValidationPipe } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { PrismaService } from 'src/common/prisma.service';
import { CommonModule } from 'src/common/common.module';
import { JwtGuard } from 'src/guards/jwt.guard';
import { Reflector } from '@nestjs/core';
import { JwtAuthService } from 'src/common/jwt.service';
import * as request from 'supertest';
import * as cookieParser from 'cookie-parser';
import { createManyPosts, createSinglePost, createSinglePostForUpdate } from './test.service';

describe('UserController', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let createdUserIds: string[] = [];
  let createdPostIds: string[] = []
  let cookie: string;
  let testUserId: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
        providers: [PrismaService],
          imports: [AppModule, CommonModule],
        }).compile();

        app = moduleFixture.createNestApplication();
    
        const reflector = app.get(Reflector)
        const jwtService = app.get(JwtAuthService)

        app.useGlobalGuards(new JwtGuard(reflector, jwtService))

        app.useGlobalPipes(new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true
        }));

        app.use(cookieParser())

        prisma = moduleFixture.get<PrismaService>(PrismaService);
        
        await app.init();
        
        await request(app.getHttpServer())
            .post('/api/users')
            .send({ username: 'Test user 3', email: 'test3@example.com', password: 'test123'})

        const token = await request(app.getHttpServer())
            .post('/api/users/login')
            .send({ email: 'test3@example.com', password: 'test123' })

        cookie = token.headers['set-cookie'][0];

        const user = await prisma.user.findFirst({
            where: { email: 'test3@example.com' }
        });

        if(user) {
            testUserId = user.id
            createdUserIds.push(user.id)
        } else {
            throw new Error('Test user could not be created or found')
        }
    });

    afterAll(async() => {
       if(createdPostIds.length > 0) {
        const deletePostPromises = createdPostIds.map(id => prisma.post.delete({ where: { id }}))
        await Promise.all(deletePostPromises)
       } 

       if(createdUserIds.length > 0) {
        const deleteUserPromises = createdUserIds.map(id => prisma.user.delete({ where: { id }}))
       }
       
       await app.close()
    });

    describe('POST /api/posts', () => { 
        it('should be rejected if data is invalid', async () => {
            const result = await request(app.getHttpServer())
            .post('/api/posts')
            .set('Cookie', cookie)
            .send({ title: '', content: 123 })
            
            expect(result.status).toBe(400)
            expect(result.body.message).toBeDefined()            
        });
        
        it('should be rejected if user id is invalid', async () => {
            const result = await request(app.getHttpServer())
            .post('/api/posts')
            .send({ title: 'Test title', content: 'Test Content', excerpt: 'Test Excerpt'})
            
            expect(result.status).toBe(401)
            expect(result.body).toBeDefined();
        })
        
        it('should create post successfully', async() => {
            const result = await request(app.getHttpServer())
                .post('/api/posts')
                .set('Cookie', cookie)
                .send({ title: 'Test title', content: 'Test content', excerpt: 'Test excerpt'})
               
                expect(result.status).toBe(201)
                expect(result.body.data.title).toBe('Test title')
                expect(result.body.data.content).toBe('Test content')
                expect(result.body.data.excerpt).toBe('Test excerpt')
                expect(result.body.data.slug).toBe('test-title')
                
                createdPostIds.push(result.body.data.id)
            });

       it('should create post with unique slug if title is duplicated', async () => {
        const post1 = await request(app.getHttpServer())
            .post('/api/posts')
            .set('Cookie', cookie)
            .send({ title: 'Duplicate title', content: 'Content 1', excerpt: 'Excerpt 1'})

        expect(post1.status).toBe(201)
        expect(post1.body.data.slug).toBe('duplicate-title')
        createdPostIds.push(post1.body.data.id);

        const post2 = await request(app.getHttpServer())    
            .post('/api/posts')
            .set('Cookie', cookie)
            .send({ title: 'Duplicate title', content: 'Content 2', excerpt: 'Excerpt 2'})

        expect(post2.status).toBe(201)
        expect(post2.body.data.slug).toBe('duplicate-title-1')
        createdPostIds.push(post2.body.data.id)
       }) 
    });

    describe('GET /api/posts', () => { 
        beforeEach(async() => {
           await prisma.post.deleteMany({}) 

           createdPostIds = []
        })

        it('should return an empty array if posts is empty', async () => {
            const result = await request(app.getHttpServer())
                .get('/api/posts')
                .set('Cookie', cookie)

            
            expect(result.status).toBe(200)
            expect(result.body).toEqual({ data: [] }) 
        });

        it('should return many posts', async () => {   
            const { count } = await createManyPosts(testUserId)
            console.log(`created ${count} post for GET Test`)

            const result = await request(app.getHttpServer())   
                .get('/api/posts')
                .set('Cookie', cookie)

            expect(result.status).toBe(200)
            expect(result.body.data).toBeDefined()
            expect(result.body.data.length).toBe(count)
        })
        
    afterAll(async() => {
        await prisma.post.deleteMany({})
    })
    });

    describe('GET /api/posts?startsWithSlug=test-title', () => {
        beforeAll(async() => {
            await prisma.post.deleteMany({})

            createdPostIds = []

            const posts = await createManyPosts(testUserId)
            console.log(`created ${posts.count} for GET slug test.`)
        }); 

        it('should return posts if userId is valid and post exist also with the slug', async() => {
            const result = await request(app.getHttpServer())
                .get('/api/posts?startsWithSlug=test-title')
                .set('Cookie', cookie)

            expect(result.status).toBe(200)
            expect(result.body).toBeDefined()
            expect(result.body.data.length).toBeGreaterThan(1)
        });

        it('should be failed if token in cookie is invalid', async () => {
            const result = await request(app.getHttpServer())
                .get('/api/posts?startsWithSlug=test-title')

            expect(result.status).toBe(401)
            expect(result.body.message).toBe('No token provided')
            expect(result.body.error).toBe('Unauthorized')
        });

        it('should return all posts if query param not set', async () => {
            const result = await request(app.getHttpServer())
                .get('/api/posts')
                .set('Cookie', cookie)

            expect(result.status).toBe(200)
            expect(result.body).toBeDefined()
            expect(result.body.data.length).toBeGreaterThan(1)
        })

        afterAll(async() => {
            await prisma.post.deleteMany({})
        })
    });

    describe('GET /api/posts/:slug', () => {
        beforeEach(async() => {
            await prisma.post.deleteMany({})

            createdPostIds = []

            const post = await createSinglePost(testUserId)

            console.log(`created ${post.title} for single GET test`)
        });

        it('should be failed if slug is invalid', async () => {
            const result = await request(app.getHttpServer())
                .get('/api/posts/kljasdfkljasfd')
                .set('Cookie', cookie)

            expect(result.status).toBe(404)
            expect(result.body).toBeDefined()
        })

        it('should be failed if token inside cookie is invalid', async () => {
            const result = await request(app.getHttpServer())
                .get('/api/posts/kljasdfkljasfd')

            expect(result.status).toBe(401)
            expect(result.body).toBeDefined()                        
        })

        it('should return a post successfully', async () => {
            const slug = 'test-title-for-single-slug-test'
            const result = await request(app.getHttpServer())
                .get(`/api/posts/${slug}`)
                .set('Cookie', cookie)

            expect(result.status).toBe(200)
            expect(result.body).toBeDefined()               
        })

        afterAll(async() => {
            await prisma.post.deleteMany({})
        })
    });

    describe('PATCH /api/posts/:postId/:authorId', () => {
       let postIdForUpdate: string;

       beforeEach(async() => {
            await prisma.post.deleteMany({})

            createdPostIds = []

            const post = await createSinglePostForUpdate(testUserId)

            console.log(`created ${post.title} for PATCH test`)

            postIdForUpdate = post.id
        });
        
        it('should be failed if data is invalid', async() => {
            const result = await request(app.getHttpServer())
                .patch(`/api/posts/${postIdForUpdate}/${testUserId}`)
                .set('Cookie', cookie)
                .send({ title: '', content: 123, excerpt: true})

            expect(result.status).toBe(400)
            expect(result.body).toBeDefined()
        })

        it('should be failed if user id is invalid', async() => {
            const wrongUserId = 'lksdfjiopuqweoiwer';
            const result = await request(app.getHttpServer())
                .patch(`/api/posts/${postIdForUpdate}/${wrongUserId}`)
                .set('Cookie', cookie)
                .send({ title: 'Title after update', content: 'Content after update', excerpt: 'Excerpt after update' })
 
            expect(result.status).toBe(403)
            expect(result.body).toBeDefined()
        })

        it('should be failed also if post id is invalid', async() => {
            const wrongPostId = 'kljasdfio1q2jkhsdfj';
            const result = await request(app.getHttpServer())
                .patch(`/api/posts/${wrongPostId}/${testUserId}`)
                .set('Cookie', cookie)
                .send({ title: 'Title after update', content: 'Content after update', excerpt: 'Excerpt after update' })

            expect(result.status).toBe(404)
            expect(result.body).toBeDefined()
        })

        it('should update post successfully', async() => {
            const result = await request(app.getHttpServer()) 
                .patch(`/api/posts/${postIdForUpdate}/${testUserId}`)
                .set('Cookie', cookie)
                .send({ title: 'Title after update', content: 'Content after update', excerpt: 'Excerpt after update' })

            expect(result.status).toBe(200)
            expect(result.body.data).toBeDefined()
            expect(result.body.data.title).toBe('Title after update')
            expect(result.body.data.content).toBe('Content after update')
            expect(result.body.data.excerpt).toBe('Excerpt after update')
            expect(result.body.data.slug).toBe('title-after-update')
        });

        afterAll(async() => {
            await prisma.post.deleteMany({})
        })
    });

    describe('DELETE /api/posts/:postId', () => {
        let postIdForDelete: string;

        beforeEach(async() => {
            await prisma.post.deleteMany({})

            createdPostIds = []

            const post = await createSinglePostForUpdate(testUserId)

            console.log(`created ${post.title} for PATCH test`)

            postIdForDelete = post.id
        });        

        it('should be rejected if postId is invalid',  async() => {
           const wrongPostId = 'q2weiopfklsdjasdfa;jkl';
           const result = await request(app.getHttpServer()) 
            .delete(`/api/posts/$${wrongPostId}`)
            .set('Cookie', cookie)

            console.log(result.body)
            expect(result.status).toBe(404)
            expect(result.body).toBeDefined()
        });

        it('should be rejected also if token in cookie is invalid',  async() => {
            const result = await request(app.getHttpServer())
                .delete(`/api/posts/${postIdForDelete}`)

            expect(result.status).toBe(401)
            expect(result.body).toBeDefined()
        })

        it('should delete post successfully',  async() => {
            const result = await request(app.getHttpServer())
               .delete(`/api/posts/${postIdForDelete}`)
               .set('Cookie', cookie)
            
            console.log(result.body)
            expect(result.status).toBe(200)
            expect(result.body).toBeDefined()
        })
    })
    
})