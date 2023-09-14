import { UseGuards, Controller, Get,Req, Res, Post } from '@nestjs/common'
import { AuthService } from './auth.service';
import { auth42Guard } from './guards/auth.guard';
import { Response, Request } from 'express';
import { generateAccessToken, generateRefreshToken } from './token';

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
		//const access_token = await this.auth_service.login(req)
        const userID = await this.auth_service.getUserID(req);
		const refresh_token = generateRefreshToken(userID);
		const auth2fa_active = await this.auth_service.auth2faActive(req.user.login)
        if (auth2fa_active){
            const auth2fa_token = await this.auth_service.login2fa(req)
            resp.cookie('auth2fa_token', auth2fa_token)
            resp.redirect("/2fa/otp")
        }
        else {
            resp.cookie('refresh_token', refresh_token, {maxAge: 7 * 24 * 3600 * 1000, httpOnly: true});
            resp.redirect("http://localhost:3000")
        }
        
    }

	@Post("refresh-token")
	async refreshToken(@Req() req: Request, @Res() res: Response) {
		const refresh_token = req.cookies["refresh_token"];
		console.log("refresh token : ", refresh_token);

		const response = await this.auth_service.refreshToken(refresh_token);

        res.cookie('refresh_token', response.refresh_token, {maxAge: 7 * 24 * 3600 * 1000, httpOnly: true});
		res.send({status: response.status, access_token: response.access_token});
	}

}
