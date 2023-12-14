import { API_URL } from '../constants';
import { api } from './axios.config';
import { CreateRoomInput, UpdateRoomInput, JoinRoomInput } from '../types';

// search rooms
export const searchRooms = async (query: string) => {
	const response = await api.post(`${API_URL}/room/search`, { room_name: query }, { headers: { 'Content-Type': 'application/json' }});
	return response.data;
}

// room members 
export const getRoomMembers = async (roomID: number) => {
	const response = await api.get(`${API_URL}/room/${roomID}/users`);
	return response.data;
}

// get rooms 
export const getUserRooms = async () => {
	const response = await api.get(`${API_URL}/user/rooms`);
	return response.data;
}

// handle create new room
export const createRoomService = async (input: CreateRoomInput) => {
	const response = await api.post(`${API_URL}/room/add`, input, { headers: { 'Content-Type': 'application/json' } });
	return response.data;
}

// delete room
export const deleteRoomService = async (roomID: number) => {
	const response = await api.delete(`${API_URL}/room/${roomID}`)
	return response.data;
}

// update room 
export const updateRoomService = async (input: UpdateRoomInput) => {
	const response = await api.post(`${API_URL}/room/update`, {...input}, {
		headers: { 'Content-Type': 'application/json', }
	})
	return response.data
}

// join room
export const joinRoomService = async (input: JoinRoomInput) => {
	const response = await api.post(`${API_URL}/room/join`, input, {
		headers: { 'Content-Type': 'application/json' }
	});
	return response.data;
}

// leave room 
export const leaveRoomService = async (roomID: number) => {
	const response = await api.post(`${API_URL}/room/${roomID}/leave`)
	return response.data;
}


// get banned users 
export const getBannedMembersService = async (roomID: number) => {
	const response = await api.post(`${API_URL}/room/users/banned`, { room_id: roomID },{
		headers: { 
			'Content-Type': 'application/json'
		}
	});
	return response.data;
}

// get Muted Members
export const getMutedMembersService = async (roomID: number) => {
	const response = await api.post(`${API_URL}/room/users/muted`, { room_id: roomID },{
		headers: { 
			'Content-Type': 'application/json'
		}
	});
	return response.data;
}

// ban user 
export const banMemberService = async (roomID: number, userID: number) => {
	const response = await api.post(`${API_URL}/room/users/ban`, {
		room_id: roomID,
		user_id: userID
	},{
		headers: {
			'Content-Type': 'application/json'
		}
	})
	return response.data;
}

// unban user
export const unBanMemberService = async (roomID: number, userID: number) => {
	const response = await api.post(`${API_URL}/room/users/unban`, {
		room_id: roomID,
		user_id: userID
	},{
		headers: {
			'Content-Type': 'application/json'
		}
	})
	return response.data;
}

// set member as room member 
export const setAdminService = async (roomID: number, userID: number) => {
	const response = await api.post(`${API_URL}/room/users/setadmin`, {
		room_id: roomID,
		user_id: userID
	},{
		headers: {
			'Content-Type': 'application/json'
		}
	});
	return response.data;
}

// mute a room member 
export const muteMemberService = async (roomID: number, userID: number, duration: number) => {
	const response = await api.post(`${API_URL}/room/users/mute`, {
		user_id: userID,
		room_id: roomID,
		muteDuration: duration
	},{
		headers: {
			'Content-Type': 'application/json'
		}
	});
	return response.data;
}

// unmute room member 
export const unMuteMemberService = async (roomID: number, userID: number) => {
	const response = await api.post(`${API_URL}/room/users/unmute`, {
		user_id: userID,
		room_id: roomID
	},{
		headers:{
			'Content-Type': 'application/json'
		}
	});
	return response.data;
}

// kick room members 
export const kickMemberService = async (roomID: number, userID: number) => {
	const response = await api.post(`${API_URL}/room/users/kick`, {
		room_id: roomID,
		user_id: userID
	}, {
		headers: {
			'Content-Type': 'application/json'
		}
	});
	return response.data;
}

export const getChatHistory = async (roomID: number) => {
	const response = await api.get(`${API_URL}/room/${roomID}/chathistory`);
	return response.data;
}