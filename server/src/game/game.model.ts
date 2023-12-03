import { Prisma } from '@prisma/client';

export class Game implements Prisma.GameCreateInput
{
    id : number;
    firstPlayer_id: number;
    secondPlayer_id: number;
    firstPlayer_score: number;
    secondPlayer_score: number;
    startedAt: string | Date;
}

export class Score implements Prisma.ScoreCreateInput
{
	id : number;
	game_id: number;
	player_id: number;
	score : number;
	game: Game;
}
