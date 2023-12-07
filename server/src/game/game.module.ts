import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { GameService } from './game.service';

@Module({
imports: [UserModule],
providers: [PrismaService, UserService, GameService]
})
export class GameModule {}