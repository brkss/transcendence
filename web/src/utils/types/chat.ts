export interface CreateRoomInput {
	roomName: string;
	roomType: string;
	password?: string;
	mebers_id: number[]
}

export interface UpdateRoomInput {
	room_id: number;
	roomType: 	string;
	password?:	string; 
}

export interface JoinRoomInput {
	room_id: 	number;
	roomType: 	string;
	password?:	string;
}
