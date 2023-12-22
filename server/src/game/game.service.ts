import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGameDTO, CreateScoreDTO, AddPlayerScoreDTO } from 'src/game/game.dto';

@Injectable()
export class GameService {
	constructor(private prismaService: PrismaService) { }

	async getAllGames(): Promise<any> {
		return await this.prismaService.game.findMany({
			include:
				{
				scores: true,
			},
		});
	}

	async getGame(game_id: number): Promise<any> {
		return await this.prismaService.game.findUnique({
			where: { id: game_id, },
			include: {
				scores: true,
				players: true,
			},
		});
	}

	async createGame(game: CreateGameDTO): Promise<number>
	{
		 const result=  await this.prismaService.game.create({
		 	data: {
		 		players: {
		 			connect: [{ id: game.firstPlayer_id }, { id: game.secondPlayer_id }],
		 		},
		 		startedAt: new Date(),
				mode: game.mode,
		 	},
		 	include: {
				scores: true,

		 	},
		 });
		 return result.id;
	}

	async deleteGame(game_id: number): Promise<any> {
		try {
			const gameExist = await this.prismaService.game.findUnique({ where: { id: game_id } });
			if (!gameExist)
				throw new NotFoundException(`Can\'t delete game with ID: ${game_id}`);

			return await this.prismaService.game.delete({ where: { id: game_id } });
		}
		catch (error) {
			console.error(error);
		}

	}

	async getAllScores(game_id: number): Promise<any> {
		try {
			const gameExist = await this.prismaService.game.findUnique({ where: { id: game_id, } });

			if (!gameExist)
				throw new NotFoundException(`Can\'t find game with ID: ${game_id}`);

			const result = await this.prismaService.game.findUnique({
				where: {
					id: game_id,
				},
				select: {
					scores: true,
				},
			});
			if (!result)
				throw new NotFoundException(`Can\'t find scores of game with ID: ${game_id}`);
			return result.scores;
		}
		catch (error) {
			console.error(error);
		}

	}

	async getPlayerScore(game_id: number, player_id: number): Promise<number> {
		try {
			const gameExist = await this.prismaService.game.findUnique({ where: { id: game_id, } });
			const userExist = await this.prismaService.user.findUnique({where:{ id : player_id,}});

			if (!gameExist)
				throw new NotFoundException(`Can\'t find game with ID: ${game_id}`);
			if (!userExist)
				throw new NotFoundException(`Can\'t find user with ID: ${player_id}`);

			const result = await this.prismaService.score.findFirst({
				where: {
					game_id: game_id,
					player_id : player_id,
				},
						select: {
							score: true,
						},
			});
			if (!result)
				throw new NotFoundException(`Something went wrong: score Indefined for game: ${game_id} player: ${player_id}!`);
			return result.score;
		}
		catch (error) {
			console.error(error);
		}
	}
	
	async addScore(game_id: number, score: AddPlayerScoreDTO): Promise<any>
	{
		try {
			const gameExist = await this.prismaService.game.findUnique({ where: { id: game_id, } });

			const allUsers = await this.prismaService.user.findMany({
				include:
					{
					games: true,
				},
			});
			if (!gameExist)
				throw new NotFoundException(`Game with ID: ${game_id} not found!`);

			const scoreRecord = await this.prismaService.score.findFirst({ where: { game_id: game_id, player_id: score.player_id } });
			if(scoreRecord){
				return await this.prismaService.score.update({
					where: {
							id: scoreRecord.id,
							game_id,
							player_id: score.player_id 
					},
					data: {
						player_id: score.player_id,
						score: score.player_score,
					},
				});
			}else {
				return await this.prismaService.score.create({
					data: {
						game_id: game_id,
						player_id: score.player_id,
						score: score.player_score,
					},
				});	
			}
		}
		catch (error) {
			console.error('Error: Can\'t add the player\'s score', error);
		}
	}

	async GetOpponentId(game_id: number, player_id: number) : Promise<number>
	{
		try
		{
			const gameExist = await this.prismaService.game.findUnique({where: {id : game_id,}});
			if (!gameExist)
				throw new NotFoundException(`Game with ID: ${game_id} not found!`);
			
			const result =  await this.prismaService.score.findFirst({
				where: {
					game_id: game_id,
					player_id : {not : player_id},
				},
				select:{
					player_id : true,
				},	

		});
			if (!result)
				throw new NotFoundException(`Can\'t get opponent id for game: ${game_id}!`);
			return result.player_id;
		}catch(error)
		{
			console.error(error);
		}
	}

	async getStatus(game_id: number, player_id: number) : Promise<string>
	{
		const opponent_id: number = await this.GetOpponentId(game_id, player_id);
		const opponent_score : number = await this.getPlayerScore(game_id, opponent_id);
		const player_score: number = await this.getPlayerScore(game_id, player_id);

		if (player_score > opponent_score)
			return "won";
		
			return "lost";
	}

async deleteAllGames() : Promise<any>{
	const score = await this.prismaService.score.findMany();
	if (!score)
	console.error("WTF");
	return await this.prismaService.game.deleteMany();
}
}