import { UseGuards, Controller, Get,Req, Res, Post } from '@nestjs/common'
import { AuthService } from './auth.service';
import { auth42Guard } from './guards/auth.guard';
import { Response, Request } from 'express';
import { generateRefreshToken } from './token';

@Controller('auth')
export class authController {
    constructor(private auth_service: AuthService) {
        
    }

    @Get('sync')
    @UseGuards(auth42Guard)
    async userLogin(@Req() req: any, @Res({passthrough: true}) resp: Response) {
        try {
             // add user to database or get his id 
            const userID = await this.auth_service.getUserID(req.user);
            const refresh_token = generateRefreshToken(userID);
            const auth2fa_active = await this.auth_service.auth2faActive(userID)
            if (auth2fa_active){
                const auth2fa_token = await this.auth_service.login2fa(req)
                resp.cookie('auth2fa_token', auth2fa_token)
                resp.redirect("/2fa/otp")
                // TODO: redirect user to 2fa page!!
                // POST opt code to /2fa/opt 
            }
            else {
                resp.cookie('refresh_token', refresh_token, {maxAge: 7 * 24 * 3600 * 1000, httpOnly: true});
                resp.redirect("http://localhost:8000/")
            }
        } catch (error) {
            console.log('ERROR: ', error)
        }
       
    }

	@Post("refresh-token")
	async refreshToken(@Req() req: Request, @Res() res: Response) {
		const refresh_token = req.cookies["refresh_token"];
		const response = await this.auth_service.refreshToken(refresh_token);
		res.send({status: response.status, access_token: response.access_token});
	}

	@Post("get-test-token")
	async getTestToken(@Req() req: Request, @Res() res: Response){
		const { userID } = req.body;
		const refresh_token = generateRefreshToken(Number(userID));
		if(!userID)
			return res.send({status: false});
		return res.send({ rt: refresh_token });
	}

}
