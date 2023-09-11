
import axios from 'axios';
import { URL } from '../constants';


export const instance = axios.create({
	baseURL: URL,
	timeout: 5000
});
