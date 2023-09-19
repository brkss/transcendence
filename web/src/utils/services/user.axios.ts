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

export const addFriend = async (username: string) => {
	const response = await api.post(`${API_URL}/user/friends/add`, {
		username: username
	});
	console.log("add friend response : ", response);
	return response.data;
}

export const acceptFriend = async (username: string) => {
	const response = await api.post(`${API_URL}/user/friends/accept`, {
		username: username
	});
	console.log("accept friend response : ", response);
	return response.data;
}

export const getRequests = async () => {
	const response = await api.get(`${API_URL}/user/friends/requests`);
	console.log("get requests response : ", response);
	return response.data;
}

export const getFriends = async () => {
	const response = await api.get(`${API_URL}/user/friends/all`);
	console.log("get friends response : ", response);
	return (response.data);
}

export const getRelationship = async (username: string) => {
	const response = await api.get(`${API_URL}/user/friends/relationship/${username}`)
	console.log("user's relationship : ", response);
	return response.data;
} 
