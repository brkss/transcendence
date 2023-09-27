import {
    IsAscii,
    IsByteLength,
    IsIn,
    IsNotEmpty,
    IsNumber,
    IsString,
    ValidateIf

} from 'class-validator'

export class RoomDTO {
     @IsString()
    @IsNotEmpty()
    roomName: string
}

export class createRoomDTO  extends RoomDTO {
    @IsIn(["PUBLIC", "PRIVATE", "PROTECTED"])
    roomType: String

    @ValidateIf(object => object.roomType === 'PROTECTED')
    @IsAscii()
    @IsByteLength(8, 32)
    password?: string
}

export class kickDTO extends RoomDTO{ 
    @IsAscii()
    @IsNotEmpty()
    user: string

    @IsNumber()
    userId: number
}
export class BanDTO extends kickDTO {

}
export class setAdminDTO extends kickDTO {

}
export class chatMessageDTO extends RoomDTO{
    @IsNotEmpty()
    message: string
}


export class JoinRoomDTO  extends RoomDTO {
    @IsIn(["PUBLIC", "PRIVATE", "PROTECTED"])
    roomType: String

    @ValidateIf(object => object.roomType === 'PROTECTED')
    password?: string
}

export class LeaveRoomDTO extends RoomDTO {
    /* 
        Properties may be added later
    */
}
export class updateRoomDTO extends createRoomDTO {

}