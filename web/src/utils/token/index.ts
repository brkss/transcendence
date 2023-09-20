
let access_token : string = "";


export const getAccessToken = () => {
	return access_token;
}

export const setAccessToken = (_token: string) => {
	access_token = _token;
}
