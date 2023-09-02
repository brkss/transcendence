import {IsNumberString} from 'class-validator' 

export class OnetimePasswordDTO {
    @IsNumberString()
    token: string
}