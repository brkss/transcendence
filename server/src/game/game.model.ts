import { Prisma } from '@prisma/client';

export class Game implements Prisma.GameCreateInput
{
    id : number;
    opponent_id: number;
    user_score: number;
    opponent_score: number;
    startedAt: string | Date;
}