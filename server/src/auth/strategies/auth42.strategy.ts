import { PassportStrategy } from "@nestjs/passport"
import { Strategy, VerifyCallback } from 'passport-oauth2'
import { ConfigService } from "@nestjs/config"
import { Injectable } from "@nestjs/common"
import axios from 'axios'

@Injectable()
export class auth42Strategy extends PassportStrategy(Strategy, '42-auth2') {
    constructor(private configService: ConfigService) {
        super({
            authorizationURL: configService.get('AUTHORIZATION_URL'),
            tokenURL: configService.get('TOKEN_URL'),
            clientID: configService.get('CLIENT_ID'),
            clientSecret: configService.get('CLIENT_SECRET'),
            callbackURL: configService.get('CALLBACK_URL'),
        })
    }
    async userProfile(accessToken: string, done: VerifyCallback): Promise<void> {
        try {
            const response = await axios.get(this.configService.get('USER_INFO_URL'), {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            done(null, response.data)
        }
        catch (error) {
            done(error, false)
        }
    }
    async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
        const user = {
            email: profile.email, 
            login: profile.login,
            first_name: profile.first_name,
            last_name: profile.last_name,
            usual_full_name: profile.usual_full_name,
            image: profile.image.versions.small
        }
        console.log(user)
        done(null, user);
    }
}
