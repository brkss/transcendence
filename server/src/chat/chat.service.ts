import {
    JoinRoomDTO,
    chatMessageDTO,
    PrivateMessageDTO,
    LeaveRoomDTO
} from "./dtos/chat.dto"

import { Socket } from "socket.io";
import { Injectable } from "@nestjs/common";
import { RoomService } from "./room/room.service";
import { GatewayService } from "./gateway/chat/gateway.service";
import { UserService } from "src/user/user.service";

@Injectable()
export class ChatService {
    constructor(private roomService: RoomService,
        private gatewayService: GatewayService,
        private userService: UserService) {
    }

    private async verify_payload(socket: Socket, room_id: number, user_id: number) {
        const room = await this.roomService.getRoomById(room_id)
        if (room == undefined) {
            socket.emit("Error", "Room Not found")
            return null
        }
        const userIsMember = await this.roomService.isRoomMember(room.id, user_id)
        if (!userIsMember) {
            socket.emit("Error", "Can't find room")
            return null
        }
        const is_muted = await this.IsUserMuted(user_id, room.id)
        if (is_muted) {
            socket.emit("Error", "Muted :C")
            return null
        }
        const is_inchat = await this.roomService.isUserInchat(user_id,  room_id);
        if (!is_inchat) {
            this.gatewayService.emitError(socket, "Error, Please rejoin")
            return null
        }
        return (room)
    }

    private async verify_connect_access(socket: Socket, room_id: number, user_id: number) {
        const room = await this.roomService.getRoomById(room_id)
        if (room == undefined) {
            socket.emit("Error", "room not found")
            return null
        }
        const is_room_member = await this.roomService.isRoomMember(room.id, user_id)
        if (!is_room_member) {
            socket.emit("Error", "Error")
            return null
        }
        const is_banned = await this.roomService.isBannedFromRoom(user_id, room.id)
        if (is_banned) {
            this.gatewayService.emitError(socket, "Banned")
            return null
        }
        const already_in_chat = await this.roomService.isUserInchat(user_id,  room_id);
        if (already_in_chat) {
            this.gatewayService.emitError(socket, "User already in Chat")
            return null
        }
        return (room)
    }

    /*
        this is different from leaving the room 
        leave room deletes the user entry in roomMember table
    */
    async leaveChat(socket: Socket, payload: LeaveRoomDTO) {
        const room_id = payload.room_id
        const user = socket.data.user
        const room = await this.roomService.getRoomById(room_id);
        if (room == undefined) {
            this.gatewayService.emitError(socket, "Error Room not found!")
            return
        }
        const user_inchat = await this.roomService.isUserInchat(user.id,  room_id);
        if (!user_inchat) {
            this.gatewayService.emitError(socket, "Error")
            return 
        }
        const message = {
            user: "PongBot",
            message: `${user.username} left the chat`,
            time: Date()
        }
        socket.to(room.name).emit("message", message)
        await this.roomService.setUserInChat(user.id , room.id,  false);
        const chat_users =  await this.roomService.getChatUsers(room.id)
        socket.to(room.name).emit("users", chat_users)
        socket.leave(room.name)
    }
    disconnect(socket: Socket) {
        console.log(socket.rooms)
    }

    async connectToChat(socket: Socket, payload: JoinRoomDTO) {
        const message = {
            user: "PongBot",
            message: "",
            time: Date()
        }
        const user = socket.data.user
        const room = await this.verify_connect_access(socket,
            payload.room_id,
            user.id
        )
        if (room != null) {
            message.message = "Welcome to Ch4t!"
            socket.emit("message", message)
            message.message = `${user.username} Joined Ch4t!`
            socket.join(room.name)
            console.log("socket rooms : ", socket.rooms)
            socket.to(room.name).emit("message", message)

            // create socket room and join it
            await this.roomService.setUserInChat(user.id, room.id, true);
            const chat_users =  await this.roomService.getChatUsers(room.id)
            socket.nsp.to(room.name).emit("users", chat_users)
        }
    }

    async SendChatMessage(socket: Socket, payload: chatMessageDTO) {
        const user = socket.data.user;
        const room = await this.verify_payload(socket, payload.room_id, user.id)
        if (room != null) {
            const message = {
                user: user.username,
                message: payload.message,
                time: Date()
            }
            const data = {
                userId: user.id,
                sender_username: user.username,
                roomId: room.id,
                recepient_id: null,
                message: payload.message
            }
            socket.to(room.name).emit("message", message)
            this.roomService.saveMessageInDB(data)
        }
    }

    async SendPrivateChatMessage(socket: Socket, payload: PrivateMessageDTO) {
        const recepient_id = payload.userId
        const recepient = await this.userService.getUserByID(payload.userId)
        const user = socket.data.user;

        if (recepient?.id == recepient_id) { // user exists 
            const message = {
                user: user.username,
                message: payload.message,
                time: Date()
            }
            socket.to("private-chat-socket-" + String(recepient_id))
                .emit("PrivateMessage", message)
            const data = {
                userId: user.id,
                roomId: null,
                recepient_id: recepient_id,
                message: payload.message
            }
            this.roomService.saveMessageInDB(data)
            // this saves user in chat history
            this.roomService.saveUserInChats(user.id, recepient_id)
        } else {
            socket.emit("Error", "User Not found")
        }
    }

    async IsUserMuted(userId: number, roomId: number): Promise<boolean> {
        const mute_entry = await this.roomService.getMuteEntry(userId, roomId)
        if (mute_entry) {
            const mute_time = mute_entry.mutedUntile
            if (mute_time > Date.now())
                return (true)
            await this.roomService.UnmuteUser(userId, roomId)
            return (false)
        }
        return (false)
    }

    async getConnectedRooms(user_id: number) {
        const room_names =  await this.roomService.getConnectedRooms(user_id)
        return (room_names)
    }
}