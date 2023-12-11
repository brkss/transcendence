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
			include: { scores: true, },
		});
	}

	async createGame(game: CreateGameDTO): Promise<any> {
		return await this.prismaService.game.create({
			data: {
				firstPlayer_id: game.firstPlayer_id,
				secondPlayer_id: game.secondPlayer_id,
				startedAt: Date(),
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

	async getPlayerScore(game_id: number, player_id: number): Promise<any> {
		try {
			const gameExist = await this.prismaService.game.findUnique({ where: { id: game_id, } });

			if (!gameExist)
				throw new NotFoundException('Can\'t find game with ID: ${game_id}');

			return await this.prismaService.game.findUnique({
				where: {
					id: game_id,
				},
				select: {
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
		}
		catch (error) {
			console.error(error);
		}
	}

	async addScore(game_id: number, score: AddPlayerScoreDTO): Promise<any> {
		try {
			const gameExist = await this.prismaService.game.findUnique({ where: { id: game_id, } });

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

	  async addGameToPlayer(game_id: number, firstPlayer_id: number, secondPlayer_id: number)
        {
                try{
                        const game = this.getGame(game_id);
                        if (!game)
                                throw new NotFoundException('Game with ID: ${game_id} not found!');
                        return this.prismaService.user.create({
                                data: {
                                        firstPlayer : {connect: {id : firstPlayer_id,}},
                                        secondPlayer : {connect: {id : secondPlayer_id,}},
                                        game: game,
                                },
                        }
                                                             );
                }catch(error)
                {
                        console.error(error);
                }

        }

/*	async GetOpponentId(game_id: number, player_id: number)
	{
		try
		{
			const gameExist = await this.prismaService.game.findUnique({where: {id : game_id,}});
			if (!gameExist)
				throw new NotFoundException('Game with ID: ${game_id} not found!');
			const {firstPlayer_id, secondPlayer_id} =  await this.prismaService.game.findUnique({
				where: { id: game_id },
				select:{
					firstPlayer_id : true,
					secondPlayer_id : true,
				},	
			});

			if (player_id == firstPlayer_id) 
				return (secondPlayer_id);
			else
				return (firstPlayer_id);
		}catch(error)
		{
			console.error(error);
		}
	}*/
}
