import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { GameService } from './game.service';
import { GatewayService } from './engine/gateway.service';
import { AuthModule } from 'src/auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { RoomService } from 'src/chat/room/room.service';

@Module({
imports: [UserModule, UserModule],
providers: [PrismaService, UserService, GameService, GatewayService, JwtService, RoomService]
})
export class GameModule {}
