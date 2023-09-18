import { Module } from '@nestjs/common';
import { ChatGateway } from './gateway/chat/chat.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoomService } from './room/room.service';
import { ConnectedSocket } from '@nestjs/websockets';
import { ConnectionService } from './gateway/chat/connnection.service';

@Module({
  imports: [AuthModule, UserModule],
  providers: [ChatGateway, PrismaService, RoomService, ConnectionService]
})
export class ChatModule {}
