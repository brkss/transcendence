import { io } from 'socket.io-client';
import { API_URL } from '../constants'
import { getAccessToken } from '../token';

export const socket = io(API_URL, {
	extraHeaders: {
		Authorization: getAccessToken()
	}
});

