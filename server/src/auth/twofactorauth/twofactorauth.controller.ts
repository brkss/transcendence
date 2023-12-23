import { BadRequestException,
	Body,
	Controller,
	Get,
	Post,
	Req,
	Res,
	UseGuards,
	UsePipes } 
from "@nestjs/common";
import { TwofactorauthService } from "./twofactorauth.service";
import { JwtAuth } from "../guards/jwtauth.guard";
import { UserService } from "src/user/user.service";
import { Jwt2faAuth } from "../guards/jwt2fauth.guard";
import { AuthService } from "../auth.service";
import { OnetimePasswordDTO } from "../dtos/otp.dto";
import { generateRefreshToken } from "../token";

@Controller('2fa')
export class TwofactorauController {
    constructor(private twofaservice: TwofactorauthService,
                private userService: UserService,
                private authService: AuthService) {} 
    @UseGuards(JwtAuth)
    @Get('isActive')
    async isActive(@Req() req: any) {
        const user_id: number  = req.user.userID 
        return (await this.twofaservice.is2faActive(user_id))
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
        const user = req.user
        const one_time_password = req.body.code_2fa
        const response = await this.twofaservice.activate2fa(user.userID, one_time_password);
        return (response)
    }

    @UseGuards(JwtAuth)
    @Post('disable')
    async deactivate2fa(@Req() req: any) {
        const user = req.user
        const response = await this.twofaservice.disable2fa(user.userID);
        return (response)
    }

    @UseGuards(Jwt2faAuth)
    @UsePipes(OnetimePasswordDTO)
    @Post('verify')
    async verify_OTP(@Req() req: any,
                    @Body() body: OnetimePasswordDTO,
                    @Res({passthrough: true}) resp: any) {
       
        const code_2fa: string = req.body.code_2fa
        const user = req.user
        const isValidCode = await this.twofaservice.isValidOTP(code_2fa, user.userID)
        if (isValidCode) {
            const refresh_token = generateRefreshToken(user.userID);
            resp.cookie('auth2fa_token', '') // clear temp token
            resp.cookie('refresh_token', refresh_token, {maxAge: 7 * 24 * 3600 * 1000, httpOnly: true});
            resp.redirect(`/`)
        }
        else {
            throw new BadRequestException("Invalid one time password")
        }
    }

}