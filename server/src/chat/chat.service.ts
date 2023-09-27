import  {createRoomDTO,
        JoinRoomDTO,
        LeaveRoomDTO,
        chatMessageDTO,
        updateRoomDTO,
        kickDTO,
        BanDTO,
        setAdminDTO,
        RoomDTO} from "./dtos/chat.dto"

import { Socket } from "socket.io";
import { Injectable } from "@nestjs/common";
import { RoomService } from "./room/room.service";
import { GatewayService } from "./gateway/chat/gateway.service";

@Injectable()
export class ChatService {
    constructor(private roomService: RoomService,
        private gatewayService: GatewayService) {

    }
    /*
    */
    async CreateNewChatRoom(socket: Socket, payload: createRoomDTO) {
        const newRoom = await this.roomService.createChatRoom(socket.data.user, payload);
        if (!newRoom) {
            this.gatewayService.emitError(socket, "Room With Same Name Already exits")
            return undefined;
        }
        socket.emit("RoomCreated", newRoom)
        socket.join(newRoom.name)
    }
    /*
        deletes room
        PS: relies on prisma to verify that room exitss
        TODO: change use roomid instead of room name
    */
    async DeleteChatRoom(socket:Socket, payload: RoomDTO) {
        try {
            const user =  socket.data.user
            const room  = await this.roomService.getRoomByName(payload.roomName)
            const user_is_admin = await this.roomService.IsRoomAdmin(user.id, room.id)
            if (!user_is_admin) {
                this.gatewayService.emitError(socket, "Unauthorized")
                return
            }
            const deleted_room =  await this.roomService.deleteRoom(payload.roomName);
            socket.emit("Success", "Room Deleted")
        }
        catch( error) {
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
            this.gatewayService.emitError(socket, "Only Room Owner can update")
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
    async joinChatRoom(socket: Socket, payload: JoinRoomDTO) {
        const user = socket.data.user
        const roomName = payload.roomName
        const verify = await this.roomService.UserRoomExists(user, roomName);
        if (verify) {
            this.gatewayService.emitError(socket, verify.Error)
            return (undefined)
        }
        /*
            Adding user to room users,
            Sending back current users,
            Join Client socket to Socketroom
        */
        const roomMembers = await this.roomService.joinUserToRoom(user, roomName)
        socket.emit("message", "Welcome to Ch4t!")
        socket.emit("users", roomMembers)
        socket.to(roomName).emit("message", `${user.username} Joined Ch4t!`)
        socket.join(payload.roomName)
    }
    /*
    */
    async leaveChatRoom(socket: Socket, payload: LeaveRoomDTO) {
        const user = socket.data.user;
        const roomName = payload.roomName // payload Guarded by DTO
        const room = await this.roomService.getRoomByName(payload.roomName)

        // Delete user from member table
        await this.roomService.removeUserFromRoom(user.id, room.id)
        socket.to(roomName).emit("message", `${user.username} left Ch4t!`)
        socket.emit("success", { status: 1})
        socket.leave(roomName)
    }
    /*
    */

    async SendChatMessage(socket: Socket, payload: chatMessageDTO) {
        const roomName: string = payload.roomName;
        const user = socket.data.user;
        // check user is in room 
        const userIsMember = await this.roomService.selectUserRoom(user.id, roomName)
        if (userIsMember) {
            const message = {
                user: user.username,
                message: payload.message,
                time: Date()
            }
            socket.to(roomName).emit("message", message)
        }
        else {
            this.gatewayService.emitError(socket, "Error for Now")
        }

    }
    /*
        gets all rooms of a user 
        mainlly called after socket connection
        !! NO payload requred for the moment
    */

    async getAllRooms(socket: Socket) {
        const user =  socket.data.user
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
            const user_is_admin = await this.roomService.IsRoomAdmin(user.id, room.id)
            if (!user_is_admin) {
                this.gatewayService.emitError(socket, "Unauthorized")
                return
            }
            const member_is_admin = await this.roomService.IsRoomAdmin(payload.userId, room.id)
            if (!member_is_admin){
                await this.roomService.removeUserFromRoom(payload.userId, room.id)
                socket.to(payload.roomName).emit("message", `${payload.user} kicked from room`)
            }else {
                this.gatewayService.emitError(socket, "Unauthorized")
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
            const user_is_admin = await this.roomService.IsRoomAdmin(user.id, room.id)
            if (!user_is_admin) {
                this.gatewayService.emitError(socket, "Unauthorized")
                return
            }
            const member_is_admin = await this.roomService.IsRoomAdmin(payload.userId, room.id)
            if (!member_is_admin){
                await this.roomService.banUserFromRoom(payload.userId, room.id)
                socket.to(payload.roomName).emit("message", `${payload.user} kicked from room`)
            } else {
                this.gatewayService.emitError(socket, "Unauthorized")
            }
        }
        catch (error) {
            console.log(error)
            socket.emit("Error", "Error")
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
            const user_is_admin = await this.roomService.IsRoomAdmin(user.id, room.id)
            if (!user_is_admin) {
                this.gatewayService.emitError(socket, "Unauthorized")
                return
            }
            const already_admin = await this.roomService.IsRoomAdmin(payload.userId, room.id)
            if (already_admin) {
                socket.emit("Error", "User already admin")
                return 
            }
            await this.roomService.addRoomAdmin(payload.userId, room.id)
            socket.emit("Success", "Admin set")
            console.log("sucess adding admin")
        }
        catch (error) {
            console.log(error)
            socket.emit("Error", "Error")
        }
    }
}