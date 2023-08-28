import { UseGuards, Controller, Get, Query, Req, Res } from '@nestjs/common'
import { AuthService } from './auth.service';
import { auth42Guard } from './guards/auth.guard';
import { JwtAuth } from './guards/jwtauth.guard';
import { Response } from 'express';


@Controller('auth')
export class authController {
    constructor(private auth_service: AuthService) {
    }

    @Get('sync')
    @UseGuards(auth42Guard)
    userLogin(@Req() req: any, @Res({passthrough: true}) resp: Response) {
        console.log("in user 42 route")
        const access_token = this.auth_service.login(req)
        resp.cookie('access_token', access_token)
        resp.redirect("http://localhost:3000") //planing to change it later
    }

    @Get('profile')
    @UseGuards(JwtAuth)
    getProfile(@Req() req: any, @Res({passthrough: true}) resp: Response) {
        return (this.auth_service.getProfile(req))
    }
}