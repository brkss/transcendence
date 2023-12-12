import { sign } from 'jsonwebtoken';
import { ConfigService } from "@nestjs/config";


export const generateAccessToken = (userID: string) => {


}

//export const generateRefreshToken = (userID: number) => {
export function generateRefreshToken(userID: number) {
	const config = new ConfigService();
	// user id can be 0-> N
	//if(!userID) return;

	const payload = {
		userID: userID,
		version: 1,
	}
	const _token = sign(
		payload,
		config.get("JWT_REFRESH_SECRET"),
		{
			expiresIn: "7d",
		}
	);
	return _token;
}
