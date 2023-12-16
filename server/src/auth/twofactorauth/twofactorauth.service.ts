import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as qrcode from 'qrcode'
import { authenticator } from "otplib";


@Injectable()
export class TwofactorauthService {
    constructor(private userService: UserService) {

    }
    private validate2fatoken(token: string, secret: string) {
        try {
            const isValid = authenticator.check(token, secret)
            return (isValid)
        }
        catch (err){
            return (false)
        }
    }
    private setResponse(response_status: boolean, message: string) {
        const response = {
            success: response_status,
            message: message
        }
        return (response)
    }
    private async generateQR(user_name:string, secret:string): Promise<any> {
        const optauth_url = authenticator.keyuri(user_name, "42 ft_PongGame", secret)
        const qr_code = await qrcode.toDataURL(optauth_url)
        return (qr_code)
    }
    async is2faActive(user_id: number) : Promise<any> {
      const isActivated: boolean = await this.userService.is2faActivated(user_id)
      const resp = {
        success: true,
        auth_2fa_active: isActivated
      }
     return (resp);
    }

    async generate2FaCode(current_user_id: number) {
        const isActivated: boolean = await this.userService.is2faActivated(current_user_id)
        if (isActivated) {
            return (this.setResponse(false, "2fa is already activated" ))
        }
        const secret = authenticator.generateSecret();
        const query = {
            where: { id: current_user_id },   
            data: { auth2faSercret: secret }, // should be sanitized? 🤔
            select: {fullName: true}
        }
        const user = await this.userService.updateField(query)
        const qr_code = await this.generateQR(user.fullName, secret);
        
        const payload = {
            success: true, 
            message: "QR code generated!",
            code: qr_code
        }
        // render qr code in front end
        return (payload)
    }

    async activate2fa(user_id: number, token: string) {
        const settings_2fa = await this.userService.get2fasettings(user_id);
        const is2faActivated = settings_2fa.auth2faOn ;
        if (is2faActivated) {
            //return (this.setResponse(false, "2fa Already Activated"))
            throw new BadRequestException("2fa Already Activated")
        }
        const isValid = this.validate2fatoken(token, settings_2fa.auth2faSercret)
        if (isValid === false) { 
            throw new BadRequestException("One Time Password invalid!")
            //return (this.setResponse(false, "One Time Password invalid!"))
        }
        await this.userService.updateField({
            where: {id: user_id},
            data: {auth2faOn : true} })
        return (this.setResponse(true, "2fa activated!") )
    }

    async disable2fa(user_id: number): Promise<any> {
        const settings_2fa = await this.userService.get2fasettings(user_id);
        const is2faActivated = settings_2fa.auth2faOn ;
        if ( ! is2faActivated) {
            throw new BadRequestException("Two factor auth not enabeled")
        }
        await this.userService.updateField({
            where: {id: user_id},
            data: {auth2faOn : false,
            auth2faSercret: null } })
        const resp = {
            success: true,
            status: "Two factor auth disabeled"
        }
        return (resp)
    }

    async is2faOn(user_id: number): Promise<boolean> {
        const settings_2fa = await this.userService.get2fasettings(user_id);
        return settings_2fa.auth2faOn ;
    }

    async isValidOTP(otp_code:string, user_id: number) {
        const  secret = await this.userService.get2faSecret(user_id)
        return (this.validate2fatoken(otp_code, secret))
    }
}