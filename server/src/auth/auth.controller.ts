import { UseGuards, Controller, Get,Req, Res, Post } from '@nestjs/common'
import { AuthService } from './auth.service';
import { auth42Guard } from './guards/auth.guard';
import { Response } from 'express';

@Controller('auth')
export class authController {
    constructor(private auth_service: AuthService) {
        
    }

    @Get('login')
    loginpage() {
        console.log(typeof(Date.now()))
        return this.auth_service.loginpage()
    }

    @Get('sync')
    @UseGuards(auth42Guard)
    async userLogin(@Req() req: any, @Res({passthrough: true}) resp: Response) {
		const access_token = await this.auth_service.login(req)
        const auth2fa_active = await this.auth_service.auth2faActive(req.user.login)
        if (auth2fa_active){
            const auth2fa_token = await this.auth_service.login2fa(req)
            resp.cookie('auth2fa_token', auth2fa_token)
            resp.redirect("/2fa/otp")
        }
        else {
            resp.cookie('access_token', access_token)
            resp.redirect("http://localhost:3000")
        }
        
    }

}
