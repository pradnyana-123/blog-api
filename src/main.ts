import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { JwtGuard } from './guards/jwt.guard';
import { JwtAuthService } from './common/jwt.service';
import * as cookieParser from 'cookie-parser';
import { RolesGuard } from './guards/roles.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const reflector = app.get(Reflector)
  const jwtService = app.get(JwtAuthService)

  app.useGlobalGuards(new JwtGuard(reflector, jwtService), new RolesGuard(reflector))

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true
  }))

  app.use(cookieParser())

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
