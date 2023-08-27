import { Injectable } from "@nestjs/common";
import { JwtService} from "@nestjs/jwt"
import { JwtAuth } from "./guards/jwtauth.guard";

@Injectable()
export class authService {
    constructor(private jwtService: JwtService) {
    }

    login(req: any): string {
        // db logic
        // user exists ? return jwt
        // else insert in db then return jwt
        const payload = {
            sub: req.user.login,
            email: req.user.email,
            full_name: req.user.usual_full_name
        }
        const jwToken = this.jwtService.sign(payload)
        return (jwToken)
    }
    getProfile(req: any): object {
        return (req.user)
    }
}