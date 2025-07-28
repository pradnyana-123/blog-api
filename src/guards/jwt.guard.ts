import { CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { JwtAuthService, JwtPayload } from "src/common/jwt.service";

export class JwtGuard implements CanActivate {
    constructor(private reflector: Reflector, private jwt: JwtAuthService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
       const isPublic = this.reflector.getAllAndOverride<boolean>('public', [
        context.getHandler(),
        context.getClass()
       ]);
       
       if(isPublic) {
        return true
       }

      const req = context.switchToHttp().getRequest<Request>() 

      const token = req.cookies.access_token
      if(!token) {
        throw new UnauthorizedException("No token provided")
      }

      try {
        const payload: JwtPayload = await this.jwt.verify(token)
        req.user  = payload
        return true
      } catch (e) {
        throw new UnauthorizedException("Invalid token")
      }


    }
}