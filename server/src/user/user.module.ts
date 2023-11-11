import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoomService } from 'src/chat/room/room.service';

@Module({
  providers: [UserService, PrismaService, RoomService],
  exports: [UserService]
})
export class UserModule {}
