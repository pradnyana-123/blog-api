import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { PrismaService } from 'src/common/prisma.service';
import { CommonModule } from 'src/common/common.module';
import { JwtGuard } from 'src/guards/jwt.guard';
import { Reflector } from '@nestjs/core';
import { JwtAuthService } from 'src/common/jwt.service';
import * as request from 'supertest';

describe('UserController', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let createdUserIds: string[] = [];

  beforeEach(async () => {
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

    prisma = moduleFixture.get<PrismaService>(PrismaService);

    await app.init();
  });

  afterAll(async() => { 
    if(createdUserIds.length > 0) {
        for (const id of createdUserIds) {
            await prisma.user.delete({ where: { id }})
        }
    }
    await app.close()
  });

  describe('POST /api/users', () => {
    it('should be rejected if data is invalid', async () => {
        const result = await request(app.getHttpServer())
           .post('/api/users')
           .send({ username: '', email: 'testingexapme.com', password: '' }) 
        
        expect(result.status).toBe(400)
        expect(result.body.message).toBeDefined()
    })

    it('should be registered sucessfully', async () => {
        const result = await request(app.getHttpServer())
            .post('/api/users')
            .send({ username: 'Test', email: 'test@example.com', password: 'test123' })
        
        expect(result.status).toBe(201)
        expect(result.body).toBeDefined()

        createdUserIds.push(result.body.data.id)
    });
  })

  describe('POST /api/users/login', () => { 
    it('should be rejected if data is invalid', async () => {
        const result = await request(app.getHttpServer())
            .post('/api/users/login')
            .send({ email: '', password: ''})

        expect(result.status).toBe(400)
        expect(result.body.message).toBeDefined()
        expect(result.body.error).toBe('Bad Request')
    });

    it('should be login successfully', async() => {
        const user = await request(app.getHttpServer())
          .post('/api/users')
          .send({ username: 'Test user 2', email: 'test2@example.com', password: 'test1234'}) 

        const result = await request(app.getHttpServer())
          .post('/api/users/login')
          .send({ email: user.body.data.email, password: 'test1234'})

  
        expect(result.status).toBe(200)
        expect(result.body.data).toBeDefined()

        createdUserIds.push(user.body.data.id)
       
    })
  })

});

