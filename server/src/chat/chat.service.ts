import {
    JoinRoomDTO,
    chatMessageDTO,
    PrivateMessageDTO
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
        return (room)
    }

    /*
        this is different from leaving the room 
        leave room deletes the user entry in roomMember table
    */
    async leaveChat(socket: Socket, payload: JoinRoomDTO) {
        const room_id = payload.room_id
        const room = await this.roomService.getRoomById(room_id);
        if (room == undefined) {
            this.gatewayService.emitError(socket, "Error Room not found!")
            return
        }
        socket.leave(room.name)
    }

    async connectToChat(socket: Socket, payload: JoinRoomDTO) {
        const user = socket.data.user
        const room = await this.verify_connect_access(socket, payload.room_id, user.id)

        if (room != null) {
            socket.to(room.name).emit("message", `${user.username} Joined Ch4t!`)
            socket.emit("message", "Welcome to Ch4t!")
            socket.join(room.name)
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
            socket.join(String(recepient_id))
            socket.to(String(recepient_id)).emit("PrivateMessage", message)
            socket.leave(String(recepient_id))
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

    async getMyChats(socket: Socket) {
        const user = socket.data.user
        const all_chats = await this.roomService.getAllUserChats(user.id)
    }
}