import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service'
import { Game } from 'src/game/game.model';

@Injectable()
export class GameService {
	constructor(private prismaService: PrismaService, private userService : UserService){}

	async getAllGames() : Promise<Game[]>
	{
		return await this.prismaService.game.findMany();
	}

	async getGame(game_id : number) : Promise<Game | null>
	{
		return await this.prismaService.game.findUnique({
			where : {id : game_id}
		});
	}

	async createGame(data : Game) : Promise<Game>
	{
		return await this.prismaService.game.create({
			data,
		});
	}

	async deleteGame(game_id: number)
	{
		return await this.prismaService.game.delete({where: {id : game_id}});
	}

	async addPlayersScore(game_id : number, firstPlayer_score: Score, secondPlayer_score : Score) : Promise<Game>
	{
		return await this.prismaService.game.update({
			where: {id : game_id},
			date: {
				firstPlayer_score: game.firstPlayer_score,
				secondPlayer_score: game.secondPlayer_score,

			}
		});
	}
}

