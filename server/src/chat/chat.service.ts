import  {createRoomDTO,
        JoinRoomDTO,
        LeaveRoomDTO,
        chatMessageDTO,
        updateRoomDTO,
        kickDTO} from "./dtos/chat.dto"

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

        // Delete user from member table
        await this.roomService.removeUserFromRoom(user.id, roomName)
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
        removes user from room 
        (will manly be used in private rooms)
    */
    async kickUserFromRoom(socket: Socket, payload: kickDTO) {
        const room = await this.roomService.getRoomByName(payload.roomName)
        const user = socket.data.user
        console.log(room)
        if (room === undefined) {
            this.gatewayService.emitError(socket, "Ch4t Room Not Found!")
            return
        }
        const is_admin = await this.roomService.IsRoomAdmin(user.id, room.id)
        console.log("id_admin", is_admin)
        if (!is_admin) {
            if (is_admin === undefined)
                this.gatewayService.emitError(socket, "User Not in room")
            else
                this.gatewayService.emitError(socket, "Unauthorized")
            return
        }
        await this.roomService.removeUserFromRoom(payload.userId, payload.roomName)
        socket.to(payload.roomName).emit("message", `${payload.user} kicked from room`)
    }
}