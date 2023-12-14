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
import { UserController } from './user/UserController';
import { ChatModule } from './chat/chat.module';
import { RoomController } from './chat/room/room.controller';
import { RoomService } from './chat/room/room.service';
import { ServeStaticModule } from '@nestjs/serve-static/dist/serve-static.module';
import path = require('path')
import { GameService } from 'src/game/game.service'
import { GameModule } from 'src/game/game.module'
import { GameController } from 'src/game/game.controller'

export const app_root: string = process.cwd()

@Module({
  imports: [AuthModule, PrismaModule, UserModule, GameModule,
    ConfigModule.forRoot({
            isGlobal:true
  }),
    ServeStaticModule.forRoot({
        rootPath: path.join(app_root, '/uploads/images'),
        serveRoot: '/user/avatar/'
    }),
    ChatModule],
  controllers: [TwofactorauController, UserController, RoomController, GameController],
  providers: [AuthService, TwofactorauthService, RoomService, GameService]
})

export class AppModule {

}
