import { Module } from '@nestjs/common';
import { ChatGateway } from './gateway/chat/chat.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoomService } from './room/room.service';
import { ChatService } from './chat.service';
import { GatewayService } from './gateway/chat/gateway.service';

@Module({
  imports: [
    AuthModule,
    UserModule,
  ],
  providers: [
    ChatGateway,
    PrismaService,
    RoomService,
    ChatService,
    GatewayService,
  ],
  exports: [
    GatewayService,
    ChatService,
  ],
})
export class ChatModule {}
