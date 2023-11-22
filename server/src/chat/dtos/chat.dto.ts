import {
    IsAscii,
    IsByteLength,
    IsIn,
    IsNotEmpty,
    IsNumber,
    IsString,
    ValidateIf,
} from 'class-validator'
import { Transform, Type } from 'class-transformer';

export class AdministrateDTO {
    //@Transform(value => Number.isNaN(+value) ? 0 : +value)
    
    @IsNumber()
    userId: number

    @Transform(value => Number.isNaN(+value) ? 0 : +value)
    @IsNumber()
    roomId: number

    @Transform(value => Number.isNaN(+value) ? 0 : +value)
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

    @Transform(value => Number.isNaN(+value) ? 0 : +value)
    @IsNumber()
    user_id: number
}

export class MuteUserDTO extends RoomDTO {
    // @IsAscii()
    // @IsNotEmpty()
    // user: string // not necessary! 

    @Transform(value => Number.isNaN(+value) ? 0 : +value)
    @IsNumber()
    user_id: number

    // mute duration in seconds 
    @Transform(value => Number.isNaN(+value) ? 0 : +value)
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
    @Transform(value => Number.isNaN(+value) ? 0 : +value)
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
