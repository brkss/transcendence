import { CanActivate, Headers, ExecutionContext, UnauthorizedException, Req, Injectable } from "@nestjs/common";
import { JwtService} from "@nestjs/jwt"
import { ConfigService } from "@nestjs/config";
import { Request} from 'express'

@Injectable()
export class JwtAuth implements CanActivate {
    constructor(
        private jwtService: JwtService,
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
            request.user = payload
        }
        catch {
            throw new UnauthorizedException()
        }
        return (true)
    }

    getTokenFromCookie(@Req() req: Request) {
        const token = req.cookies.access_token
        if (!token)
            return undefined
        return (req.cookies.access_token)

    }
}