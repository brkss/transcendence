import {IsNotEmpty, IsString} from 'class-validator' 

export class addFriendDTO {
    @IsNotEmpty()
    @IsString()
    username: string
}