import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { ChatModule } from 'src/chat/chat.module';
import { GameService } from './game.service';
import { GatewayService } from './gateway.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    ChatModule,
    AuthModule,
  ],
  exports: [
    GameGateway,
    GameService,
  ],
  providers: [
    GameGateway,
    GameService,
    GatewayService,
  ],
})
export class GameModule {}
