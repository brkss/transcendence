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


}

