import { UseGuards, Controller, Get, Query, Req, Res } from '@nestjs/common'
import { authService } from './auth.service';
import { auth42Guard } from './guards/auth.guard';
import { JwtAuth } from './guards/jwtauth.guard';
import { Response } from 'express';


@Controller('auth')
export class authController {
    constructor(private auth_service: authService) {
    }

    @Get('login')
    @UseGuards(auth42Guard)
    _() {

    }

    @Get('42')
    @UseGuards(auth42Guard)
    userLogin(@Req() req: any, @Res({passthrough: true}) resp: Response)  {
        console.log("in user login route")
        const access_token = this.auth_service.login(req)
        resp.cookie('access_token', access_token)
    }

    @UseGuards(JwtAuth)
    @Get('pofile')
    getProfile(@Req() req: any) {
        return (this.auth_service.getProfile(req))
    }
}