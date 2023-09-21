import {IsAscii,
        IsByteLength,
        IsIn,
        IsNotEmpty,
        IsString,
        ValidateIf
} from 'class-validator' 

export class createRoomDTO {
    @IsString()
    @IsNotEmpty()
    roomName: string

    @IsIn(["PUBLIC", "PRIVATE", "PROTECTED"])
    roomType: String

    @ValidateIf(object => object.roomType === 'PROTECTED')
    @IsAscii()
    @IsByteLength(8, 32)
    password?: string
}