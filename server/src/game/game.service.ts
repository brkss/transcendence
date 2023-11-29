import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GameService {
    constructor(private prismaService: PrismaService, private userService UserService){}

    async GameStartDate(game_id: number)
    {
        await this.prismaService.game.update({
            where: {
                id: game_id
            },
            data: {
                StartAt: Date()
            }
        })
    }

    async GameScore(game_id: number, user_score : number, opponent_score: number){
        await this.prismaService.game.update({
            where: {
                id : game_id
            },
            data: {
                userScore : user_score
                opponentScore : opponent_score
            }
        })
    }
}