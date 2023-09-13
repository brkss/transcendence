import { UseGuards, Controller, Get,Req, Res, Post } from '@nestjs/common'
import { AuthService } from './auth.service';
import { auth42Guard } from './guards/auth.guard';
import { Response, Request } from 'express';
import { generateRefreshToken } from './token';

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
            resp.cookie('refresh_token', access_token, {maxAge: 7 * 24 * 3600 * 1000, httpOnly: true});
            resp.redirect("http://localhost:3000")
        }
        
    }

	@Post("refresh-token")
	async refreshToken(@Req() req: Request, @Res() res: Response) {

		const refresh_token = req.cookies["refresh_token"];
		console.log("refresh token : ", refresh_token);
		res.json({status: false, access_token: ""});
		//console.log("refresh token : ", );
		//const refresh_token = req.cookies["refresh_token"]
		//console.log("refresh_token : ", refresh_token)
	}

}
