import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt"
import { ConfigService } from "@nestjs/config";
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
        console.log(user)
        const payload = {
            id: user.id,
            email: user.email,
            login: user.login,
            username: user.login, // login by default
            is2faToken: false
        }
        const jwToken = this.jwtService.sign(payload)
        return (jwToken)
    }
    async auth2faActive(user_login: string) {
        return (await this.userService.is2faActivated(user_login))
    }

    async login2fa(req_user: any): Promise<string> {
        const user = await this.userService.createUser(req_user.user)
        const payload = {
            sub: user.id,
            email: user.email,
            login: user.login,
            is2faToken: true
        }
        const jwt2fa_token = this.jwtService.sign(payload)
        return (jwt2fa_token)
    }
    loginpage() {
        const htm: string  = '<a href="http://localhost:3000/auth/sync"> Login with 42 </a>'
        return htm
    }

}