import { sign } from 'jsonwebtoken';

const generateRefreshToken = (userID: number) => {
	const privateKey = "";
	
	if(!userID) return;

	const _token = sign(
		{
			userID: userID,
			version: 1,
		},
		privateKey,
		{
			expiresIn: "30d",
		}
	);

	return _token;
}

(() => {
    const token = generateRefreshToken(1);
    console.log("token : ", token)
})();