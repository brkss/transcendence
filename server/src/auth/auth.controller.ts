import { UseGuards, Controller, Get, Req, Res, Post, InternalServerErrorException } from '@nestjs/common'
import { AuthService } from './auth.service';
import { auth42Guard } from './guards/auth.guard';
import { Response, Request } from 'express';
import { generateRefreshToken } from './token';
import { PrismaClientInitializationError } from '@prisma/client/runtime/library';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class authController {
    constructor(private auth_service: AuthService,
        private userServce: UserService) {
    }
    @Post("refresh-token")
    async refreshToken(@Req() req: Request, @Res() res: Response) {
        const refresh_token = req.cookies["refresh_token"];
        const response = await this.auth_service.refreshToken(refresh_token);
        res.send({ status: response.status, access_token: response.access_token });
    }

    @Get('sync')
    @UseGuards(auth42Guard)
    async userLogin(@Req() req: any, @Res({ passthrough: true }) resp: Response) {
        const user = await this.userServce.createUser(req.user)
        const auth2fa_active = await this.auth_service.auth2faActive(user.id)
        if (auth2fa_active) {
            const auth2fa_token = await this.auth_service.login2fa(req)
            resp.cookie('auth2fa_token', auth2fa_token)
            resp.redirect("http://localhost:3000/2fa/otp")
            return 
        }
        const refresh_token = generateRefreshToken(user.id);
        resp.cookie('refresh_token', refresh_token, {
            maxAge: 7 * 24 * 3600 * 1000
            , httpOnly: true
        });
        resp.redirect("http://localhost:3000/")
    }
}
