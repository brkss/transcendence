import { API_URL } from '../constants';
import { api } from './axios.config';
import { CreateGameInput, AddPlayerScoreInput } from '../types';


export const createGame = async (input: CreateGameInput) => {
    const response = await api.post(`${API_URL}/game/create`, input, {
        headers: { 'Content-Type': 'application/json' }
    });
}

export const addscore = async (firstPlayer_score: AddPlayerScoreInput, secondPlayer_score: AddPlayerScoreInput) => {
    const response = await api.post(`${API_URL}/game/addscore`, {firstPlayer_score, secondPlayer_score}, {
        headers: { 'Content-Type': 'application/json' }
    });
}
