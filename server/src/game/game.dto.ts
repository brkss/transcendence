import {IsNumber, IsDate} from 'class-validator';

export class CreateGameDTO
{
	@IsNumber()
	firstPlayer_id : number;

	@Isnumer()
	secondPlayer_id: number;

	@IsDate()
	startedAt: Date;
}

export class AddPlayerScore
{
	@IsNumber()
	player_id: number;

	@IsNumber()
	score: number;
}
