export interface CreateRoomInput {
	roomName: string;
	roomType: string;
	password?: string;
}

export interface UpdateRoomInput {
	roomType: 	string;
	password?:	string; 
}

export interface JoinRoomInput {
	roomType: 	string;
	password?:	string;
}