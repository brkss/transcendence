import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { ChatModule } from 'src/chat/chat.module';
import { GameService } from './game.service';
import { GameService as GameServicedb } from '../game.service';
import { GatewayService } from './gateway.service';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [
    ChatModule,
    AuthModule,
  ],
  exports: [
    GameGateway,
    GameService,
    GameServicedb,
    PrismaService
  ],
  providers: [
    GameGateway,
    GameService,
    GatewayService,
    GameServicedb,
    PrismaService
  ],
})
export class GameModule {}
