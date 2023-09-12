import { Module } from '@nestjs/common';
//import { ChatGateway } from './gateway/chat/chat.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { PrismaService } from 'src/prisma/prisma.service';
//mport { RoomService } from './room/room.service';

@Module({
  imports: [AuthModule, UserModule],
  providers: [/*ChatGateway*/, PrismaService, /*RoomService*/]
})
export class ChatModule {}
