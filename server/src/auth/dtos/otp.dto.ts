import {IsNumberString, IsString} from 'class-validator' 

export class OnetimePasswordDTO {
    @IsNumberString()
    code_2fa: string
}