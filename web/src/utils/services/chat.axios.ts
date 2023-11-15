import { API_URL } from '../constants';
import { api } from './axios.config';
import { CreateRoomInput, UpdateRoomInput, JoinRoomInput } from '../types';

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
	console.log("input : ", JSON.stringify(input));
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
	const response = await api.post(`${API_URL}/room/join`, {...input}, {
		headers: { 'Content-Type': 'application/json' }
	});
	return response.data;
}

// leave room 
export const leaveRoomService = async (roomID: number) => {
	const response = await api.post(`${API_URL}/room/${roomID}/leave`)
	return response.data;
}
