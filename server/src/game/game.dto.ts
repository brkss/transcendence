import {IsNumber, IsDate} from 'class-validator';

export class CreateGameDTO
{
	@IsNumber()
	firstPlayer_id : number;

	@Isnumer()
	secondPlayer_id: number;
}

export class AddPlayerScore
{
	@IsNumber()
	game_id: number;

	@IsNumber()
	player_id : number;


	@IsNumber()
	player_score: number;
}
