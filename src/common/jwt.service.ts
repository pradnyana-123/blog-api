import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt"; 

export interface JwtPayload {
    sub: string;
    email: string;
    role: string;
}

@Injectable()
export class JwtAuthService {
    constructor(private jwt: JwtService){}

    async sign(payload: JwtPayload){
        return this.jwt.signAsync(payload)
    }

    async verify(token: string) {
        return await this.jwt.verifyAsync(token)
    }
}