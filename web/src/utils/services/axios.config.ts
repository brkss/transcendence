import axios, { RawAxiosRequestConfig } from 'axios';
import { getAccessToken, setAccessToken } from '../token';
import jwtDecode from "jwt-decode";
import { API_URL } from '../constants';

export const api = axios.create();

const refreshTokenBackground = async () => {
	const res = await fetch(`${API_URL}/auth/refresh-token`, {
		method: 'POST',
		credentials: "include"
	});
	const data = await res.json();
	if(data && data.status === true){
		setAccessToken(data.access_token);
		console.log("refreshed token in the background : ", data.access_token);
	}
}

api.interceptors.request.use(
	async (config: any) => {

		const token = getAccessToken();
		
		config.headers = {
			'Authorization': `${token}`,
			'Accept': `application/json`,
		 	'Content-Type': 'application/json',
		}
		return config;
	},
	err => {
		console.log("err axios request interseptor : ", err);
		return Promise.reject(err)
	}
)


api.interceptors.response.use(
	(response) => { return response },
	async (err) => {
		const originalRequest = err.config;
		const token = getAccessToken();
		const { exp } = jwtDecode(token) as any;
		if(err.response.status === 401 || Date.now() >= exp * 1000){
			await refreshTokenBackground();
			return api(originalRequest);
		}
		return Promise.reject(err);
	}
)
