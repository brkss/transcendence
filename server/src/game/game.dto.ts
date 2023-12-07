import {IsNumber, IsDate} from 'class-validator';

export class CreateGameDTO
{
	@IsNumber()
	firstPlayer_id : number;

	@IsNumber()
	secondPlayer_id: number;
}

export class AddPlayerScoreDTO
{
	@IsNumber()
	game_id: number;

	@IsNumber()
	player_id : number;

	@IsNumber()
	player_score: number;
}

export class CreateScoreDTO	
{
	@IsNumber()
	game_id: number;
}