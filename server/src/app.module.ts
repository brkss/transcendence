import { Module, UseGuards } from '@nestjs/common';
//import { AppController } from './app.controller';
//import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TwofactorauthService } from './auth/twofactorauth/twofactorauth.service'
import { TwofactorauController } from './auth/twofactorauth/twofactorauth.controller'
import { AuthService } from './auth/auth.service';
import { UserController } from './user/user.controller';
import { ChatModule } from './chat/chat.module';
import { RoomController } from './chat/room/room.controller';
import { RoomService } from './chat/room/room.service';
import { ServeStaticModule } from '@nestjs/serve-static/dist/serve-static.module';
import path = require('path')
import { JwtAuth } from './auth/guards/jwtauth.guard';
export const app_root: string = process.cwd()

@Module({
  imports: [AuthModule, PrismaModule, UserModule,
    ConfigModule.forRoot({
            isGlobal:true
  }),
    ServeStaticModule.forRoot({
        rootPath: path.join(app_root, '/uploads/images'),
        serveRoot: '/user/avatar/'
    }),
    ChatModule],
  controllers: [TwofactorauController, UserController, RoomController],
  providers: [AuthService, TwofactorauthService, RoomService],
})

export class AppModule {

}
