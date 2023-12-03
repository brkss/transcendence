import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service'
import { Game , Score } from 'src/game/game.model';

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
			where : {id : game_id,}
		});
	}

	async createGame(game : Game) : Promise<Game>
	{
		return await this.prismaService.game.create({
			game,
		});
	}

	async deleteGame(game_id: number)
	{
		return await this.prismaService.game.delete({where: {id : game_id}});
	}

	async createScore() : Promise<Score>
	{
		return await this.prismaService.score.create({
			score,
		});
	}

	async getAllScores(game_id: number) : Promise<Score>
	{
		return await this.prismaService.game.findUnique({

			where: {
				id: game_id,
			},
			select: {
				scores: true,
			},
		});
	}

	async getPlayerScore(game_id: number, player_id: number)
	{
		return 	this.prismaService.game.findUnique({

			where: {
				id: game_id,
			},
			select: {
				scores:{
					where:{
						player_id: player_id,
					},
					select: {
						score: true,
					},
				}	
			},
		});

	}

	//addScore
}

