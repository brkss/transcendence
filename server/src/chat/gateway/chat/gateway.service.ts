import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Socket } from "socket.io"
import { RoomService } from "src/chat/room/room.service";

@Injectable()
export class GatewayService {
    constructor(private jwtService: JwtService,
        private roomService: RoomService) {

    }

    UnauthorizedDisconnect(socket: Socket) {
        socket.emit("Error", new UnauthorizedException())
        socket.disconnect()
    }

    connectionSuccess(socket: Socket) {
        socket.emit("message", { Connection: "success" })
    }

    emitError(socket: Socket, error: string) {
        const response = {
            Error: error,
        }
        socket.emit("Error", response)
    }

    private async joinPrevRooms(socket: Socket, userId:number) {
        const all_rooms = await this.roomService.getUserJoinedRooms(userId)   
        for (let chat_room of all_rooms) {
            let name = chat_room.room.name
            socket.join(name)
        }
    }

    async socketConnection(socket: Socket) {
        const access_token = socket.request.headers.authorization
        try {
            const payload = this.jwtService.verify(access_token)
            socket.data.user = payload;
            this.connectionSuccess(socket)
            await this.joinPrevRooms(socket, payload.id)

        } catch (error) {
            console.log(error)
            this.UnauthorizedDisconnect(socket)
            return 
        }
    }

    async leavAllSocketRooms(socket: Socket, user: any) {
        const all_rooms = await this.roomService.getUserJoinedRooms(user.id)
        await this.roomService.deleteMemberFromRooms(user.id)
        // Brodcas user left room
        for (let chat_room of all_rooms) {
            let name = chat_room.room.name
            socket.to(name).emit("message", `${user.username} left Ch4t!`)
            socket.leave(name)
        }
    }
}