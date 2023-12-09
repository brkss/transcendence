import { Body, Controller, Get, Post, Req, Res, UseGuards, UsePipes } from "@nestjs/common";
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
        const user_id: number  = req.user.userID 
        return (await this.twofaservice.generate2FaCode(user_id))
    }

    @UseGuards(JwtAuth)
    @Post('activate')
    @UsePipes(OnetimePasswordDTO)
    async activate2fa(@Body() body: OnetimePasswordDTO, @Req() req: any) {
        const req_body = req.body
        const response = await this.twofaservice.activate2fa(req.user.userID, req.body.code_2fa);
        return (response)
    }

    @UseGuards(Jwt2faAuth)
    @UsePipes(OnetimePasswordDTO)
    @Post('verify')
    async verify_OTP(@Req() req: any,
                    @Body() body: OnetimePasswordDTO,
                    @Res({passthrough: true}) resp: any) {
        const token: string = req.body.token
        const user = req.user
        const isValidCode = await this.twofaservice.isValidOTP(token, user.userID)
        if (isValidCode) {
            const access_token = await this.authService.login_2fa(user.userID)             
            resp.cookie('access_token', access_token)
            resp.cookie('auth2fa_token', '') // clear temp token
            resp.redirect("/") 
        }
        else {
            resp.redirect("/2fa/verify") 
        }
    }
}