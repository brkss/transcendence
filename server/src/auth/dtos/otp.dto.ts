import {IsString} from 'class-validator' 

export class OnetimePasswordDTO {
    @IsString()
    code_2fa: string
}