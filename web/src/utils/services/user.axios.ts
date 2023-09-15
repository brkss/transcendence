import { API_URL } from '../constants';
import { api } from './axios.config';

export const search = async (query: string) => {
	const response = await api.post(`${API_URL}/user/search`, { query: query });
	return response.data
}

export const profile = async (username: string) => {
	const response = await api.get(`${API_URL}/user/profile/${username}`)
	console.log("profile : ", response)
	return response.data
}
