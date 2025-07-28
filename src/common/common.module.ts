import { Global, Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { JwtModule } from "@nestjs/jwt";
import { JwtAuthService } from "./jwt.service";

@Global()
@Module({
    imports: [JwtModule.register({
        secret: process.env.JWT_SECRET,
        signOptions: {
            expiresIn: "7h"
        }
    })],
    controllers: [],
    providers: [PrismaService, JwtAuthService],
    exports: [PrismaService, JwtAuthService]
})
export class CommonModule {}
