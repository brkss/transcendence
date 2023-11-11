import {
    createRoomDTO,
    JoinRoomDTO,
    LeaveRoomDTO,
    chatMessageDTO,
    updateRoomDTO,
    kickDTO,
    BanDTO,
    setAdminDTO,
    RoomDTO,
    MuteUserDTO,
    PrivateMessageDTO
} from "./dtos/chat.dto"

import { Socket } from "socket.io";
import { Injectable } from "@nestjs/common";
import { RoomService } from "./room/room.service";
import { GatewayService } from "./gateway/chat/gateway.service";
import { PrismaService } from "src/prisma/prisma.service";
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
    */
    async CreateNewChatRoom(socket: Socket, payload: createRoomDTO) {
        const duplicate_name = await this.roomService.getRoomByName(payload.roomName)
        if (duplicate_name) {
            this.gatewayService.emitError(socket, "Room With Same Name Already exits")
            return 
        }
        const newRoom = await this.roomService.createChatRoom(socket.data.user, payload);
        socket.emit("RoomCreated", newRoom)
        socket.join(newRoom.name)
    }
    /*
        deletes room
        PS: relies on prisma to verify that room exitss
        TODO: change use roomid instead of room name
    */
    async DeleteChatRoom(socket: Socket, payload: RoomDTO) {
        try {
            const user = socket.data.user
            const room = await this.roomService.getRoomByName(payload.roomName)
            if (room.owner != user.id) {
                this.gatewayService.emitError(socket, "Unauthorized")
                return
            }
            const deleted_room = await this.roomService.deleteRoom(payload.roomName);
            socket.emit("success", "Room Deleted")
        }
        catch (error) {
            console.log(error)
            socket.emit("Error", "Error Deleting room")
        }
    }
    /*
    */
    async UpdateChatRoom(socket: Socket, payload: updateRoomDTO) {
        const room = await this.roomService.getRoomByName(payload.roomName)
        const user = socket.data.user
        if (room === undefined) {
            this.gatewayService.emitError(socket, "Ch4t Room Not Found!")
            return
        }
        /* 
        only room owner can update it
        */
        if (room.owner != user.id) {
            this.gatewayService.emitError(socket, "Unauthorized")
            return
        }
        const data = {
            roomType: payload.roomType,
            password: (payload.roomType === "PROTECTED") ? payload.password : null
        }
        const updatedRoom = await this.roomService.updateRoom(room.id, data)
        socket.emit("message", "Room Updated")
        console.log("updated room", updatedRoom)
        console.log("userpalyoad", payload)
    }
    /*
        Join user to chat room
    */
    private verifyAccess(room: any, payload: JoinRoomDTO): boolean {
        // cant join a private room
        // allowed users are selected on creation
        if (room.roomType === "PRIVATE")
            return (false)
        if (room.roomType == "PROTECTED") {
            if (room.password != payload.password) {
                return (false)
            }
        }
        //either password correct or room is public
        return (true)
    }

    /*
        Adding user to room users,
        Sending back current users,
        Join Client socket to Socketroom
        check authorization
        returns  error if user already a member in room
    */
    async joinChatRoom(socket: Socket, payload: JoinRoomDTO) {
        const user = socket.data.user
        const roomName = payload.roomName
        try {
            const room = await this.roomService.getRoomByName(roomName)
            if (room == undefined) {
                this.gatewayService.emitError(socket, "Error Cant't join Room")
                return 
            }
            const authorized = this.verifyAccess(room, payload)
            const is_banned = await this.roomService.isBannedFromRoom(user.id, room.id)
            if (!authorized || is_banned) {
                this.gatewayService.emitError(socket, "Unauthorized")
                return
            }
            // adding user to RoomMember table
            const roomId = await this.roomService.addMemberTORoom(user.id, room.id, false)
            if (roomId == null) {
                this.gatewayService.emitError(socket, "Already Joined !!")
                return
            }
            socket.emit("message", "Welcome to Room!")
            // join chat 
            this.connectToChat(socket, payload)
            // getting all room members
        }
        catch (error) {
            console.log(error)
            this.gatewayService.emitError(socket, "Error Cant't join Room")
        }
    }
    /*
        this is different from leaving the room 
        leave room deletes the user entry in roomMember table
    */
    async leaveChat(socket: Socket, payload: JoinRoomDTO) {
        const roomName = payload.roomName
        const room = await this.roomService.getRoomByName(roomName); 
        if (room == undefined) {
            this.gatewayService.emitError(socket, "Error Room not found!")
            return
        }
        // leave socket room
        // get no more messages
        socket.leave(roomName)
    }

    async connectToChat(socket: Socket, payload: JoinRoomDTO) {
        const user = socket.data.user
        const roomName = payload.roomName
        try { 
            const room = await this.roomService.getRoomByName(roomName)
            const is_banned = await this.roomService.isBannedFromRoom(user.id, room.id)
            if (is_banned) {
                this.gatewayService.emitError(socket, "Unauthorized")
                return
            }
            socket.emit("message", "Welcome to Ch4t!")
            const roomMembers = await this.roomService.getRoomMembers(room)
            socket.emit("users", roomMembers)
            socket.to(roomName).emit("message", `${user.username} Joined Ch4t!`)
            // load chat messages
            const chat_messages = await this.roomService.fetch_room_messages(room.id)
            socket.emit("history", chat_messages)
            socket.join(roomName)
        }
        catch (error) {
            console.log(error)
            this.gatewayService.emitError(socket, "Error Cant't join Room")
        }
    }
    /*
    */
    async leaveChatRoom(socket: Socket, payload: LeaveRoomDTO) {
        const user = socket.data.user;
        const roomName = payload.roomName // payload Guarded by DTO
        const room = await this.roomService.getRoomByName(payload.roomName)

        // Delete user from member table
        try  {
            await this.roomService.removeUserFromRoom(user.id, room.id)
            socket.to(roomName).emit("message", `${user.username} left Ch4t!`)
            socket.emit("success", "Success")
            socket.leave(roomName)
        }
        catch (error) {
            console.log(error)
            this.gatewayService.emitError(socket, "Error")
        }
    }
    /*
    */

    async SendChatMessage(socket: Socket, payload: chatMessageDTO) {
        const roomName: string = payload.roomName;
        const user = socket.data.user;
        // check user is in room 
        const userIsMember = await this.roomService.selectUserRoom(user.id, roomName)
        if (!userIsMember) {
            socket.emit("Error", "Room Not found")
            return;
        }

        const room = await this.roomService.getRoomByName(roomName)
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
            socket.to(roomName).emit("message", message)
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
            socket.to(String(recepient_id)).emit("PrivateMessage", message)
            const  data =  {
                userId : user.id,
                roomId: null,
                recepient_id: recepient_id,
                message: payload.message
            }
            this.roomService.saveMessageInDB(data) // this should be in chat.service.ts
        }else {
            socket.emit("Error", "User Not found")
        }


    }
    /*
        gets all rooms of a user 
        mainlly called after socket connection
        !! NO payload requred for the moment
    */

    async getAllRooms(socket: Socket) {
        const user = socket.data.user;
        const all_rooms = await this.roomService.getRoomsOfUser(user.id)
        socket.emit("rooms", all_rooms)
    }

    /*
        kick user from chat room
        checks if user is admin and banned user is not
        removes user from room
        (will manly be used in private rooms)
        Yelds Error otherwise 
    */
    async kickUserFromRoom(socket: Socket, payload: kickDTO) {

        const room = await this.roomService.getRoomByName(payload.roomName)
        const user = socket.data.user
        try {
            const payload_administer = { 
                userId: user.id,
                roomId: room.id,
                memberId: payload.userId
            }
            if (await this.canAdminstrate(socket, payload_administer)) {
                await this.roomService.removeUserFromRoom(payload.userId, room.id)
                socket.to(payload.roomName).emit("message", `${payload.user} kicked from room`)
            }
        }
        catch (error) {
            console.log(error)
            socket.emit("Error", "Error")
        }
    }

    async banUserFromRoom(socket: Socket, payload: BanDTO) {

        const room = await this.roomService.getRoomByName(payload.roomName)
        const user = socket.data.user
        try {
            const administrate_payload = { 
                userId: user.id,
                roomId: room.id,
                memberId: payload.userId 
            }
            if (await this.canAdminstrate(socket, administrate_payload)) {
                await this.roomService.banUserFromRoom(payload.userId, room.id)
                socket.to(payload.roomName).emit("success", `${payload.user} banned from room`)
            }
        }
        catch (error) {
            console.log(error)
            socket.emit("Error", "Error Baning User")
        }
    }

    async UnbanUserFromRoom(socket: Socket, payload: BanDTO) {
        const room = await this.roomService.getRoomByName(payload.roomName)
        const user = socket.data.user
        try {
            const administrate_payload = { 
                userId: user.id,
                roomId: room.id,
                memberId: payload.userId 
            }
            if (await this.canAdminstrate(socket, administrate_payload)) {
                await this.roomService.UnbanUserFromRoom(payload.userId, room.id)
                socket.emit("success", `${payload.user} Unbanned from room`)
            }
        }
        catch (error) {
            console.log(error)
            socket.emit("Error", "Error Unbaning User")
        }

    }

    /* 
        checks authorization(user is admin) then:
        updates is_admin on db
        user has to be a member on room
    */
    async setAdmin(socket: Socket, payload: setAdminDTO) {
        const room = await this.roomService.getRoomByName(payload.roomName)
        const user = socket.data.user
        try {
            const administrate_payload = { 
                userId: user.id,
                roomId: room.id,
                memberId: payload.userId 
            }
            if (await this.canAdminstrate(socket, administrate_payload)) {
                await this.roomService.addRoomAdmin(payload.userId, room.id)
                socket.emit("success", "Admin set")
                console.log("sucess adding admin")
            }
        }
        catch (error) {
            console.log(error)
            socket.emit("Error", "Error")
        }
    }
    /*
        Get all banned users of a room
        only admin can get  banned users
    */

    async getBannedUsers(socket: Socket, payload: RoomDTO) {
        try {
            const room = await this.roomService.getRoomByName(payload.roomName)
            const user = socket.data.user
            const user_is_admin = await this.roomService.IsRoomAdmin(user.id, room.id)
            console.log("user is admin", user_is_admin)
            if (!user_is_admin) {
                this.gatewayService.emitError(socket, "Unauthorized")
                return
            }
            const banned_users  = await this.roomService.getAllBannedUsers(room.id)
            socket.emit("bannedUsers", banned_users)
        }
        catch(error) {
            console.log(error)
            this.gatewayService.emitError(socket, "Error")
        }
    }
    /*
        Mute user for a  limited time

    */
    async muteUser(socket:Socket, payload: MuteUserDTO) {
        try {
            const user = socket.data.user;
            const room = await this.roomService.getRoomByName(payload.roomName)
            const operation_data = {
                userId: user.id,
                roomId: room.id,
                memberId: payload.userId
            }
            if (await this.canAdminstrate(socket, operation_data)) {
                await this.roomService.muteUserFor(payload.userId, room.id, payload.muteDuration)
                socket.emit("success", "User Muted")
            }
        }catch (error) {
            console.log(error)
            this.gatewayService.emitError(socket, "Error Muting User")
        }
    }
    async UnmuteUser(socket: Socket, payload: MuteUserDTO) {
        try {
            const user = socket.data.user;
            const room = await this.roomService.getRoomByName(payload.roomName)
            const operation_data = {
                userId: user.id,
                roomId: room.id,
                memberId: payload.userId
            }
            if (await this.canAdminstrate(socket, operation_data)) {
                await this.roomService.UnmuteUser(payload.userId, room.id)
                socket.emit("success", "User Unmuted")
            }
        }catch (error) {
            console.log(error)
            this.gatewayService.emitError(socket, "Error UnMuting User")
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

}