import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as qrcode from 'qrcode'
import { authenticator } from "otplib";


@Injectable()
export class TwofactorauthService {
    constructor(private userService: UserService) {

    }
  
    validate2fatoken(token: string, secret: string) {
        try {
            const isValid = authenticator.check(token, secret)
            return (isValid)
        }
        catch (err){
            console.log(err)
        }
    }
    async generate2fa(current_user: string) {
        const isActivated: boolean = await this.userService.is2faActivated(current_user)
        if (isActivated) {
            return "<h3> 2fa is already activated</h3>"
        }
        
        const secret = authenticator.generateSecret();
        const query = {
            where: { login: current_user },   
            data: { auth2faSercret: secret }   // should be sanitized? 🤔
        }
        await this.userService.updateField(query)

        const optauth_url = authenticator.keyuri(current_user, "42 ft_PongGame", secret)
        const qr_code = await qrcode.toDataURL(optauth_url)
        //console.log(qr_code)
        return (qr_code) // idk you! render it 
    }

    async activate2fa(current_user: string, token: string) {
        const isActivated: boolean = await this.userService.is2faActivated(current_user)
        if (isActivated) {
            return "<h3> 2fa is already activated</h3>"
        }
        const  secret = await this.userService.get2faSecret(current_user)
        const isValid = this.validate2fatoken(token, secret)

        if (isValid) {
            await this.userService.updateField({
                where: {login: current_user},
                data: {auth2faOn : true}
            })
            return  "<h3> 2FA activated successfully!!</h3>"
        }
        else {
            return "<h3> Time Based One Time Password invalid!!</h3>"
        }
    }
}
