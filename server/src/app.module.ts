import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
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

@Module({
  imports: [AuthModule, PrismaModule, UserModule,
    ConfigModule.forRoot({
            isGlobal:true
  }),
    ChatModule],
  controllers: [AppController, TwofactorauController, UserController, RoomController],
  providers: [AppService, AuthService, TwofactorauthService, RoomService],
})
export class AppModule {}
