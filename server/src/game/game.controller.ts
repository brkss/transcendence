import { Get, Param } from '@nestjs/common';
import { GameService } from 'src/game/game.service';
import { Game } from 'src/game/game.model';

export class GameController {
	constructor(private readonly gameService: GameService) { };

	@Get()
	async getAllGames() : Promise<Game[]>
	{
		return this.gameService.getAllGames();
	}

	@Get(':id')
	async getGame(@Param('id') id : number) : Promise<Game>
	{
		return this.gameService.getGame(id);
	}

	@Post()
	async CreateGame(@Body() createGameDTO: CreateGameDTO) : Promise<Game>
	{
		const game: Game = {
			firstPlayer_id : createGameDTO.firstPlayer_id,
			secondPlayer_id : createGameDTO.secondPlayer_id,
			startedAt : Date(),
		}
		return this.gameService.createGame(game);
	}

	@Post(':id')
	async addPlayersScores(@Param('id') id: number, @Body() addPlayersScoreDTO: AddPlayersScoreDTO) : Promise<Game>{
	}
}

