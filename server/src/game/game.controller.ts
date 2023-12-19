import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { GameService } from 'src/game/game.service';
import { CreateGameDTO, AddPlayerScoreDTO } from './game.dto';

@Controller('game')
export class GameController {
	constructor(private readonly gameService: GameService) { };


	@Get()
	async getAllGames(): Promise<any> {
		return await this.gameService.getAllGames();
	}

	@Get(':id')
	async getGame(@Param('id') id: number): Promise<any> {
		return await this.gameService.getGame(id);
	}

	@Post("create")
	async CreateGame(@Body() createGameDTO: CreateGameDTO): Promise<any> {
		return await this.gameService.createGame(createGameDTO);
	}

	@Post("addscore")
	async addPlayerScores(@Body() firstPlayer_score: AddPlayerScoreDTO, secondPlayer_score: AddPlayerScoreDTO): Promise<any> {
		const firstScore = await this.gameService.addScore(firstPlayer_score.game_id, firstPlayer_score);
		const secondScore = await this.gameService.addScore(secondPlayer_score.game_id, secondPlayer_score);
		return [firstScore , secondScore];
	}
}

