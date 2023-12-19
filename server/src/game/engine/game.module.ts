import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { GatewayService } from 'src/chat/gateway/chat/gateway.service';
import { ChatModule } from 'src/chat/chat.module';
import { GameService } from './game.service';

@Module({
  imports: [
    ChatModule,
  ],
  exports: [
    GameGateway,
    GameService
  ],
  providers: [
    GameGateway,
    GameService
  ],
})
export class GameModule {}
