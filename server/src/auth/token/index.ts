import { sign } from 'jsonwebtoken';
import { ConfigService } from "@nestjs/config";


export const generateAccessToken = (userID: string) => {


}

export const generateRefreshToken = (userID: number) => {
	const config = new ConfigService();
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
