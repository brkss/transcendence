import { Injectable } from "@nestjs/common";
import { JwtModule, JwtModuleOptions, JwtService } from "@nestjs/jwt"
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
    constructor(
            private jwtService: JwtService, 
            private configService: ConfigService
        ) {
            const jwtConfig : JwtModuleOptions = {
            secret: this.configService.get("JWT_SECRET"),
            signOptions: { expiresIn: '60s' },
        }
        JwtModule.register(jwtConfig)
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