import { Controller, Get, Redirect, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuth } from './auth/guards/jwtauth.guard';

@Controller()
@UseGuards(JwtAuth)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {

    return this.appService.getHello();
  }
}
