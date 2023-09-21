import jwtDecode from 'jwt-decode';
import { getAccessToken } from '../token';



export const getPayload  = () => {
	const payload = jwtDecode(getAccessToken());
	return payload;
}






