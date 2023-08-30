import { Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { TwofactorauthService } from "./twofactorauth.service";
import { JwtAuth } from "../guards/jwtauth.guard";
import { UserService } from "src/user/user.service";

@Controller('2fa')
@UseGuards(JwtAuth)
export class TwofactorauController {
    constructor(private twofaservice: TwofactorauthService,
                private userService: UserService) {
        
    }
    @Get('generate')
    async generate2fa(@Req() req: any) {
        const current_user: string  = req.user.login // should be read from jwt token
        return (await this.twofaservice.generate2fa(current_user))
    }

    @Post('activate')
    async activate2fa(@Req() req: any) {
        const token  = req.body.token // has to validated
        const current_user = req.user.login
        return (await this.twofaservice.activate2fa(current_user, token))        
    }
}