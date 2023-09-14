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

    async login(req: any): Promise<string> {
        // retunrs (user === req.user) if user exits
        const user = await this.userService.createUser(req.user)
        console.log(user)
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
    async auth2faActive(user_login: string) {
        return (await this.userService.is2faActivated(user_login))
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
    loginpage() {
        const htm: string  = '<a href="http://localhost:8000/auth/sync"> Login with 42 </a>'
        return htm
    }


	/*
	*	GET USER'S ID 
	*/

	async getUserID(req: any): Promise<number> {
        // retunrs (user === req.user) if user exits
        const user = await this.userService.createUser(req.user)
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
			userID: user.id,
			username: user.username,
			is2faToken: user.auth2faOn
        }
		console.log("user: ", user);
		const access_token = this.jwtService.sign(access_token_payload);
		return {
			status: true,
			access_token,
			refresh_token: generateRefreshToken(user.id)
		}
	}


}
