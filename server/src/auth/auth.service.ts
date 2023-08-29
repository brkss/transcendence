import { Injectable } from "@nestjs/common";
import { JwtModule, JwtModuleOptions, JwtService } from "@nestjs/jwt"
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "src/prisma/prisma.service";
import { use } from "passport";

@Injectable()
export class AuthService {
    constructor(
            private jwtService: JwtService, 
            private configService: ConfigService,
            private prismaService: PrismaService
        ) {
            const jwtConfig : JwtModuleOptions = {
            secret: this.configService.get("JWT_SECRET"),
            signOptions: { expiresIn: '60s' },
        }
        JwtModule.register(jwtConfig)
    }

    async login(req: any): Promise<string> {
        let user: any
        const  userExists = await this.prismaService.user.findUnique({
            where: {login: req.user.login}
        })
        if (!userExists) {
            user = await this.prismaService.user.create({
            data: {
                email: req.user.email,
                fullName: req.user.usual_full_name,
                login: req.user.login,
             },
        })
        }else {
            user = userExists
        }
        const payload = {
            sub: user.id,
            email: user.email,
        }
        const jwToken = this.jwtService.sign(payload)
        return (jwToken)
    }
    loginpage() {
        const htm: string  = '<a href="http://localhost:3000/auth/sync"> Login with 42 </a>'
        return htm
    }

}