import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt"
import { ConfigService } from "@nestjs/config";
import { UserService } from "src/user/user.service";
import { IRefreshTokenResponse } from '../utils'
import { verify } from 'jsonwebtoken';
import { generateRefreshToken } from "./token";

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService, 
                private configService: ConfigService,
                private userService: UserService ) {
    }

    async login_2fa(user_data: any): Promise<string> {
        const user = await this.userService.createUser(user_data)
		const payload = {
            id: user.id,
            email: user.email,
            login: user.login,
            username: user.login, // login by default
            is2faToken: false
        }
        const jwToken = this.jwtService.sign(payload, { expiresIn: '15m' })
        return (jwToken)
    }
    async auth2faActive(user_id: number) {
        const auth2faSettings = await this.userService.get2fasettings(user_id)
        return (auth2faSettings.auth2faOn)
    }

    async login2fa(req_user: any): Promise<string> {
        const user = await this.userService.createUser(req_user.user)
        const payload = {
            sub: user.id,
            email: user.email,
            login: user.login,
            is2faToken: true
        }
        const jwt2fa_token = this.jwtService.sign(payload, { expiresIn: '15m' })
        return (jwt2fa_token)
    }

	/*
	*	GET USER'S ID 
	*/

	async getUserID(req_user: any): Promise<number> {
        const user = await this.userService.createUser(req_user)
       	if(user)
			return user.id;
		return null;
    }

	async refreshToken(token: string): Promise<IRefreshTokenResponse>{
		if(!token)
			return { status: false, access_token: "", refresh_token: "" }
		
		let payload: any = null;
		try {
			payload = verify(token, this.configService.get("JWT_REFRESH_SECRET"))
		}catch(e){
			return {
				status: false,
				access_token: "",
				refresh_token: ""
			}
		}
		const user = await this.userService.getUserByID(payload.userID);
		if(!user)
			return { status: false, access_token: "", refresh_token: "" }
		const access_token_payload = {
            id: user.id,
			userID: user.id,
            // TODO: sync token names
			username: user.username,
			is2faToken: user.auth2faOn
        }
		const access_token = this.jwtService.sign(access_token_payload);
		return {
			status: true,
			access_token,
			refresh_token: generateRefreshToken(user.id)
		}
	}


}
