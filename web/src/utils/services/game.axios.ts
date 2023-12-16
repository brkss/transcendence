import { API_URL } from '../constants';
import { api } from './axios.config';
import { CreateGameInput, AddPlayerScoreInput } from '../types';


export const createGame = async () => {
const response = await api.post('${API_URL}/game/create');
}
