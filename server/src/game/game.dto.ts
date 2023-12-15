import {IsNumber, IsDate, IsString} from 'class-validator';

export class CreateGameDTO
{
	@IsNumber()
	firstPlayer_id : number;

	@IsNumber()
	secondPlayer_id: number;

	@IsString()
	mode: string;
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
