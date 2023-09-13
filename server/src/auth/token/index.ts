import { sign } from 'jsonwebtoken';
import { ConfigService } from "@nestjs/config";


export const generateAccessToken = (userID: string) => {


}

export const generateRefreshToken = (userID: string) => {
	const config = new ConfigService();
	console.log("conf : ", config)
	if(!userID) return;

	const _token = sign(
		{
			userID: userID,
			version: 1,
		},
		config.get("JWT_REFRESH_SECRET"),
		{
			expiresIn: "7d",
		}
	);

	return _token;
}
