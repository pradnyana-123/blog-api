import { JwtPayload } from "src/common/jwt.service";

declare module "express" {
    interface Request {
        user: JwtPayload
    }
}