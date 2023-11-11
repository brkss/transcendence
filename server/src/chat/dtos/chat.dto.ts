import {
    IsAscii,
    IsByteLength,
    IsIn,
    IsNotEmpty,
    IsNumber,
    IsString,
    ValidateIf,
    isNumber,

} from 'class-validator'

export class RoomDTO {
    @IsNumber()
    room_id: number

}

export class createRoomDTO {
    @IsString()
    @IsNotEmpty()
    roomName: string

    @IsIn(["PUBLIC", "PRIVATE", "PROTECTED"])
    roomType: string

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
    userId: number

    // mute duration in seconds 
    @IsNumber()
    muteDuration: number

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
    password?: string
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
