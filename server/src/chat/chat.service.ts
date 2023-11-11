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

    /*
        Checks if User has admin access
        before administrating chanel
    */
    private async canAdminstrate(socket: Socket, payload: any): Promise<boolean> {
        const userId = payload.userId
        const roomId = payload.roomId
        const memberId = payload.memberId
        const user_is_admin = await this.roomService.IsRoomAdmin(userId, roomId)
        if (!user_is_admin) {
            this.gatewayService.emitError(socket, "Unauthorized")
            return false
        }
        const member_is_admin = await this.roomService.IsRoomAdmin(memberId, roomId)
        if (!member_is_admin) {
            return (true)
        } else {
            this.gatewayService.emitError(socket, "Unauthorized")
            console.log("member is admin", member_is_admin)
            return (false)
        }
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
        // leave socket room
        socket.leave(room.name)
    }

    async connectToChat(socket: Socket, payload: JoinRoomDTO) {
        const user = socket.data.user
        const room_id = payload.room_id
        try { 
            const room = await this.roomService.getRoomById(room_id)
            const is_banned = await this.roomService.isBannedFromRoom(user.id, room.id)
            if (is_banned) {
                this.gatewayService.emitError(socket, "Unauthorized")
                return
            }
            socket.emit("message", "Welcome to Ch4t!")
            const roomMembers = await this.roomService.getRoomMembers(room)
            socket.emit("users", roomMembers)
            socket.to(room.name).emit("message", `${user.username} Joined Ch4t!`)
            // load chat messages
            const chat_messages = await this.roomService.fetch_room_messages(room.id)
            socket.emit("history", chat_messages)
            socket.join(room.name)
        }
        catch (error) {
            console.log(error)
            this.gatewayService.emitError(socket, "Error Cant't join Room")
        }
    }

    async SendChatMessage(socket: Socket, payload: chatMessageDTO) {
        const room_id: number = payload.room_id;
        const user = socket.data.user;
        // check user is in room 
        const userIsMember = await this.roomService.isRoomMember(room_id, user.id)
        if (!userIsMember) {
            socket.emit("Error", "Room Not found")
            return;
        }

        const room = await this.roomService.getRoomById(room_id)
        // check if user is muted in chanel
        const is_muted = await this.IsUserMuted(user.id, room.id)
        if (is_muted) {
            socket.emit("Error", "Muted :C")
            return 
        }
        if (userIsMember) {
            const message = {
                user: user.username,
                message: payload.message,
                time: Date()
            }
            socket.to(room.name).emit("message", message)
            const  data =  {
                userId : user.id, // this no longer needed!
                sender_username: user.username,
                roomId: room.id,
                recepient_id: null,
                message: payload.message
            }
            this.roomService.saveMessageInDB(data)
        }
        else {
            this.gatewayService.emitError(socket, "Error for Now")
        }
    }

    async SendPrivateChatMessage(socket: Socket, payload: PrivateMessageDTO) {
        const recepient_id = payload.userId
        const recepient  = await this.userService.getUserByID(payload.userId)
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
            const  data =  {
                userId : user.id,
                roomId: null,
                recepient_id: recepient_id,
                message: payload.message
            }
            this.roomService.saveMessageInDB(data) 
            // this saves user in chat history
            this.roomService.saveUserInChats(user.id, recepient_id)
        }else {
            socket.emit("Error", "User Not found")
        }
    }

    async IsUserMuted(userId: number, roomId: number) :Promise<boolean> { 
        const mute_entry = await this.roomService.getMuteEntry(userId, roomId)
        if (mute_entry) { // an entry exists on table
            const mute_time = mute_entry.mutedUntile
            if (mute_time > Date.now())
                return (true)
            await this.roomService.UnmuteUser(userId, roomId)
            console.log(mute_entry)
            return (false)
        }
        return (false)
    }

    async getMyChats(socket: Socket) {
        const user = socket.data.user
        const all_chats = await this.roomService.getAllUserChats(user.id)
    }
}