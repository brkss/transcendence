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

	async createGame(game: CreateGameDTO): Promise<any>
	{
		 return await this.prismaService.game.create({
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
	}

	async deleteGame(game_id: number): Promise<any> {
		try {
			const gameExist = await this.prismaService.game.findUnique({ where: { id: game_id } });
			if (!gameExist)
				throw new NotFoundException('Can\'t delete game with ID: ${game_id}');

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
				throw new NotFoundException('Can\'t find game with ID: ${game_id}');

			return await this.prismaService.game.findUnique({

				where: {
					id: game_id,
				},
				select: {
					scores: true,
				},
			});
		}
		catch (error) {
			console.error(error);
		}

	}

	async getPlayerScore(game_id: number, player_id: number): Promise<number> {
		try {
			const gameExist = await this.prismaService.game.findUnique({ where: { id: game_id, } });

			if (!gameExist)
				throw new NotFoundException('Can\'t find game with ID: ${game_id}');

			const result = await this.prismaService.game.findFirst({
				where: {
					id: game_id,
					scores:{
						some: {
							player_id : player_id,
						},
					},
				},
				include: {
					scores: {
						where: {
							player_id: player_id,
						},
						select: {
							score: true,
						},
					}
				},
			});

			const player_score = result.scores[0].score;
			return player_score;
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
				throw new NotFoundException('Game with ID: ${game_id} not found!');

			return await this.prismaService.score.create({
				data: {
					game: { connect: { id: game_id, } },
					player_id: score.player_id,
					score: score.player_score,
				},
			});
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
				throw new NotFoundException('Game with ID: ${game_id} not found!');
			const id =  await this.prismaService.game.findFirst({
				where: {
					id: game_id,
					players:
						{
						some: {
							id : {not: player_id},
						},
					},
				},
				select:{
					players:
						{
						where: {
							id: {not: player_id},
						},
						select:{
							id: true,
						},
					}
				},	

		});

			const opponent_id: number = id.players[0].id;
			return opponent_id;

		}catch(error)
		{
			console.error(error);
		}
	}

	async getStatus(game_id: number, player_id: number) : Promise<string>
	{
		const opponent_id = this.GetOpponentId(game_id, player_id);
		const opponent_score = this.getPlayerScore(game_id, player_id);
		const player_score = this.getPlayerScore(game_id, player_id);

		if (player_score > opponent_score)
			return "won";
		else
			return "lost";
	}
}
