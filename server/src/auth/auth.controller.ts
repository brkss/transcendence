import { UseGuards, Controller, Get, Query, Req, Res } from '@nestjs/common'
import { authService } from './auth.service';
import { auth42Guard } from './guards/auth.guard';

@Controller('auth')
export class authController {
    constructor(private auth_service: authService) {
    }
    @Get('42')
    @UseGuards(auth42Guard)
    userLogin(@Req() req: any)  {
        return (this.auth_service.login(req))
    }
}