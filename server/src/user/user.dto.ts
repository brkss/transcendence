import {IsInt, IsNotEmpty, IsString} from 'class-validator' 

export class addFriendDTO {
    @IsNotEmpty()
    @IsString()
    username: string
}

export class blockUserDTO {
    @IsNotEmpty()
    @IsInt()
    user_id: number
}

export class unblockUserDTO extends blockUserDTO{

}