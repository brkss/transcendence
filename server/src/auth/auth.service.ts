import { Injectable } from "@nestjs/common";
import { JwtModule, JwtModuleOptions, JwtService } from "@nestjs/jwt"
import { ConfigService } from "@nestjs/config";
//import { PrismaService } from "src/prisma/prisma.service";
import { UserService } from "src/user/user.service";

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService, 
                private configService: ConfigService,
                private userService: UserService ) {
        }

    async login(req: any): Promise<string> {
        // retunrs (user === req.user) if user exits
        const user = await this.userService.createUser(req.user)
        const payload = {
            sub: user.id,
            email: user.email,
            login: user.login
        }
        const jwToken = this.jwtService.sign(payload)
        console.log(jwToken)
        return (jwToken)
    }
    loginpage() {
        const htm: string  = '<a href="http://localhost:3000/auth/sync"> Login with 42 </a>'
        return htm
    }

}