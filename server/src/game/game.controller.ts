import { Get, Param, Post, Body } from '@nestjs/common';
import { GameService } from 'src/game/game.service';
import { CreateGameDTO, AddPlayerScoreDTO } from './game.dto';

export class GameController {
	constructor(private readonly gameService: GameService) { };

	@Get()
	async getAllGames(): Promise<any> {
		return this.gameService.getAllGames();
	}

	@Get(':id')
	async getGame(@Param('id') id: number): Promise<any> {
		return this.gameService.getGame(id);
	}

	@Post()
	async CreateGame(@Body() createGameDTO: CreateGameDTO): Promise<any> {
		return this.gameService.createGame(createGameDTO);
	}

	@Post(':id')
	async addPlayerScores(@Param('id') id: number, @Body() firstPlayer_score: AddPlayerScoreDTO, secondPlayer_score: AddPlayerScoreDTO): Promise<any> {
		const firstScore = this.gameService.addScore(id, firstPlayer_score);
		const secondScore = this.gameService.addScore(id, secondPlayer_score);
		return [firstScore , secondScore];
	}
}

