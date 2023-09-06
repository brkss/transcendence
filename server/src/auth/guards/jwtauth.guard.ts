import { CanActivate, ExecutionContext, UnauthorizedException, Req, Injectable } from "@nestjs/common";
import { JwtService} from "@nestjs/jwt"
import { ConfigService } from "@nestjs/config";
import { Request} from 'express'
import { UserService } from "src/user/user.service";

@Injectable()
export class JwtAuth implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private userService: UserService,
        private configService: ConfigService) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean>  {
        const request = context.switchToHttp().getRequest()        
        const jwtoken = this.getTokenFromCookie(request)

        if (!jwtoken)
            throw new UnauthorizedException()
        try {

            const payload = await this.jwtService.verifyAsync(
                jwtoken, 
                {
                    secret: this.configService.get('JWT_SECRET') 
                }
            ) 
            if (payload.is2faToken === false) {
                request.user = payload
                await this.userService.updateLastLogin(payload.username)
                return (true)
            }
            return (false)
        }
        catch {
            throw new UnauthorizedException()
        }
    }

    getTokenFromCookie(@Req() req: Request) {
        const token = req.cookies.access_token
        if (!token)
            return undefined
        return (token)

    }
}