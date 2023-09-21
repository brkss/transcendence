import {IsString} from 'class-validator' 

export class OnetimePasswordDTO {
    @IsString()
    token: string
}