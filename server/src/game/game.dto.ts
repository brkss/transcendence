import {IsNumber, IsDate} from 'class-validator';

export class CreateGameDTO
{
	@IsNumber()
	firstPlayer_id : number;

	@Isnumer()
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
