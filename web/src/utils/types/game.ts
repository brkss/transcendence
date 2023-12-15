export interface CreateGameInput {
        firstPlayer_id:         number;
        secondPlayer_id:        number;
        mode:                   string;
}

export interface AddPlayerScoreInput {
        game_id:        number;
        player_id:      number;
        player_score:   number;
}
