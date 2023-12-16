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

export const getUserChats = async () => {
	const response = await api.get(`${API_URL}/user/chats`);
	return response.data;
}

export const getUserInfo = async (uid: number) => {
	const response = await api.get(`${API_URL}/user/profile/${uid}`);
	return response.data;
}

export const blockUser = async (uid: number) => {
	const response = await api.post(`${API_URL}/user/block`, {
		user_id: uid
	},{
		headers: {
			'Content-Type': 'application/json'
		}
	});

	return response.data;
}

export const unblockUser = async (uid: number) => {
	const response = await api.post(`${API_URL}/user/unblock`, {
		user_id: uid,
	},{
		headers: {
			'Content-Type': 'application/json'
		}
	});
	return response.data;
}

export const userChatHistory = async (uid: number) => {
	const response = await api.get(`${API_URL}/user/${uid}/chathistory`);
	return response.data;
}

export const uploadAvatar = async (data: FormData) => {
	const response = await api.post(`${API_URL}/user/upload`, data, {
		headers: {
			'Content-Type': 'multipart/form-data'
		}
	});
	return response.data;
}

export const updateUserProfile = async (name: string, username: string) => {
	const response = await api.post(`${API_URL}/user/updatename`, {
		fullname: name,
		username: username
	}, {
		headers: {
			'Content-Type': 'application/json'
		}
	});
	console.log("update user data response : ", response);
	return response.data;
}
/*
export const userLeaderBoard = async () => {
	const response = await api.get('${API_URL}/user/leaderbord');
	return response.date;
}

export const userStatus = async () => {
	const response = await api.get('${API_URL}/user/status');
	return response.data;
}
*/