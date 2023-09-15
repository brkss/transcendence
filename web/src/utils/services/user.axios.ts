import { API_URL } from '../constants';
import { api } from './axios.config';



export const search = async (query: string) => {
	const response = await api.post(`${API_URL}/user/search`, { query: query });
	return response.data
}
