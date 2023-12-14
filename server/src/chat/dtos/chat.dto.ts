import {
    IsAlpha,
    IsAlphanumeric,
    IsArray,
    IsAscii,
    IsByteLength,
    IsIn,
    IsNotEmpty,
    IsNumber,
    IsString,
    Matches,
    ValidateIf,
} from 'class-validator'
import { isInt16Array } from 'util/types'

export class AdministrateDTO {
    @IsNumber()
    userId: number
    @IsNumber()
    roomId: number
    @IsNumber()
    memberId: number 
}

export class RoomDTO {
    @IsNumber()
    room_id: number
}
export class findRoomDTO {
    @IsString()
    @IsNotEmpty()
    room_name: string
}
export class updateNameDTO {
    @IsString()
    @IsAlpha()
    fullname: string

    @IsString()
    @IsAlphanumeric()
    username: string
}

export class createRoomDTO {

    @IsNotEmpty()
    @Matches(/^[^\s].*[^\s]$/, {
        message: 'No trailing or leading white spaces are allowed',
      })
    roomName: string

    @IsIn(["PUBLIC", "PRIVATE", "PROTECTED"])
    roomType: string

    @ValidateIf(object => object.roomType === 'PRIVATE')
    @IsNumber({}, {each: true})
    mebers_id: number[] 

    @ValidateIf(object => object.roomType === 'PROTECTED')
    @IsAscii()
    @IsByteLength(8, 32)
    password?: string
}

export class kickDTO extends RoomDTO{ 

    @IsNumber()
    user_id: number
}

export class MuteUserDTO extends RoomDTO {
    // @IsAscii()
    // @IsNotEmpty()
    // user: string // not necessary! 

   
    @IsNumber()
    user_id: number

    // mute duration in seconds 
   
    @IsNumber()
    muteDuration: number

}

export class UnMuteUserDTO extends RoomDTO {
   
    @IsNumber()
    user_id: number

}


export class BanDTO extends kickDTO {

}
export class setAdminDTO extends kickDTO {

}
export class chatMessageDTO extends RoomDTO{
    @IsNotEmpty()
    message: string
}

export class PrivateMessageDTO {
   
    @IsNumber()
    userId: number

    @IsAscii()
    message: string
}


export class JoinRoomDTO  extends RoomDTO {
    @IsIn(["PUBLIC", "PRIVATE", "PROTECTED"])
    roomType: string

    @ValidateIf(object => object.roomType === 'PROTECTED')
    @IsNotEmpty()
    @IsAscii()
    password: string
}

export class LeaveRoomDTO extends RoomDTO {
    /* 
        Properties may be added later
    */
}
/*
    you can only update room type and password
*/
export class updateRoomDTO extends RoomDTO {
    @IsIn(["PUBLIC", "PRIVATE", "PROTECTED"])
    roomType: string
    @ValidateIf(object => object.roomType === 'PROTECTED')
    @IsAscii()
    @IsByteLength(8, 32)
    password?: string
}
