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
        private  configService: ConfigService) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean>  {
        const request = context.switchToHttp().getRequest()        
        const jwtoken = this.getTokenFromHeader(request)
        if (!jwtoken)
            throw new UnauthorizedException()
        try {
            // need to verify expiration !
            const payload = await this.jwtService.verifyAsync(
                jwtoken as string, 
                {
                    secret: this.configService.get('JWT_REFRESH_SECRET') 
                }
            ) 
            if (payload.is2faToken === false) {
                // this can be done using web sockets sockets 
                request.user = payload
                await this.userService.updateLastLogin(payload.userID)
                return (true)
            }
            return (true)
        }
        catch (e) {
            throw new UnauthorizedException()
        }
    }

    getTokenFromHeader(@Req() req: Request) {
        const token = req.headers["authorization"] ?? req.cookies['refresh_token']
        if (!token)
            return undefined
        return (token)

    }
}
