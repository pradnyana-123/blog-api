import { CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";

export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}
    canActivate(context: ExecutionContext): boolean {

        const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
            context.getHandler(),
            context.getClass()
        ]);

        if(!requiredRoles) {
            return true
        }

        const req = context.switchToHttp().getRequest<Request>()

        const role = req.user!.role
        
        if(!role || typeof role !== 'string') {
            throw new ForbiddenException("Roles is empty")
        }

        const hasRequiredRoles = requiredRoles.includes(role)
        if(!hasRequiredRoles) {
            throw new ForbiddenException("You are not allowed to access this endponit.") 
        }

        return true
        
    }
}