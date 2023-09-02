import { Body, Controller, Get, HttpCode, Post, Redirect, Req, Res, UseGuards, UsePipes } from "@nestjs/common";
import { TwofactorauthService } from "./twofactorauth.service";
import { JwtAuth } from "../guards/jwtauth.guard";
import { UserService } from "src/user/user.service";
import { Jwt2faAuth } from "../guards/jwt2fauth.guard";
import { AuthService } from "../auth.service";
import { OnetimePasswordDTO } from "../dtos/otp.dto";

@Controller('2fa')
export class TwofactorauController {
    constructor(private twofaservice: TwofactorauthService,
                private userService: UserService,
                private authService: AuthService) {
        
    }
    @UseGuards(JwtAuth)
    @Get('generate')
    async generate2fa(@Req() req: any) {
        const current_user: string  = req.user.login // should be read from jwt token
        return (await this.twofaservice.generate2fa(current_user))
    }

    @UseGuards(JwtAuth)
    @Post('activate')
    @UsePipes(OnetimePasswordDTO)
    async activate2fa(@Body() body: OnetimePasswordDTO, @Req() req: any) {
        const token  = req.body.token
        const current_user = req.user.login
        return (await this.twofaservice.activate2fa(current_user, token))        
    }

    @UseGuards(Jwt2faAuth)
    @Get('otp')
    otp_page() {
        return (this.twofaservice.getOptPage())
    }

    @UseGuards(Jwt2faAuth)
    @UsePipes(OnetimePasswordDTO)
    @Post('otp')
    async verify_OTP(@Req() req: any,
                    @Body() body: OnetimePasswordDTO,
                    @Res({passthrough: true}) resp: any) {

        const token: string = req.body.token
        const isValidCode = await this.twofaservice.isValidOTP(token, req.user.login)
        if (isValidCode) {
            const access_token = await this.authService.login(req)             
            resp.cookie('access_token', access_token)
            resp.cookie('auth2fa_token', '') // clear temp token
            resp.redirect("/") 
        }
        else {
            resp.redirect("/2fa/otp") 
        }
    }
}