import { io } from 'socket.io-client';
import { API_URL, API_URL_BASE } from '../constants'
import { getAccessToken } from '../token';

export const socket = io(API_URL_BASE, {
	extraHeaders: {
		Authorization: getAccessToken()
	}
});

