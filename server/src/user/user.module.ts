import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoomService } from 'src/chat/room/room.service';
import { GameService } from 'src/game/game.service';

@Module({
  providers: [UserService, PrismaService, RoomService, GameService],
  exports: [UserService]
})
export class UserModule {}
