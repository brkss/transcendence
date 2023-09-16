import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket } from 'socket.io'
import { RoomService } from 'src/chat/room/room.service';
import { ConnectionService } from './connnection.service';
import e from 'express';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection , OnGatewayDisconnect{
  @WebSocketServer()
  private server;

  constructor(private jwtService: JwtService, 
              private roomService: RoomService,
              private connectionService: ConnectionService) {

  }

  private UnauthorizedDisconnect(socket: Socket) {
    socket.emit("Error", new UnauthorizedException())
    socket.disconnect()
  }

  private connectionSuccess(socket: Socket) {
    socket.emit("message", {Connection: "success"})
  }

  // private async emitAllUserRooms(socket: Socket, userID: number) {
  //   const user_rooms = await this.roomService.getUserRooms(userID); 
  //   socket.emit("message", user_rooms)
  // }

  // private async addConnection(socket: Socket, userID: number) {
  //   await this.connectionService.creatConnectionSocket(socket.id, userID)
  // }

  // private async deleteConnection(socket: Socket) {
  //   await this.connectionService.deleteConnectionSocket(socket.id)
  // }

  handleConnection(socket: Socket) {
    const access_token = socket.request.headers.authorization
    try {
      const payload = this.jwtService.verify(access_token) // use canactivate with
      socket.data.user = payload;
      this.connectionSuccess(socket)

    }catch (error) {
      console.log(error)
      this.UnauthorizedDisconnect(socket)
    }
  }

  private async leaveAllRoomsOnDisconnect(socket: Socket, user: any){
    const all_rooms = await this.roomService.getUserJoinedRooms(user.id)
    console.log(all_rooms)
    await this.roomService.deleteMemberFromRooms(user.id)
    // log to all prev rooms 
    for (let chat_room of all_rooms ) {
      let name = chat_room.room.name
      socket.to(name).emit("message", `${user.username} left Ch4t!`)
      socket.leave(name)
    }
  }

  async handleDisconnect(socket: Socket) {
    const user = socket.data.user
    await this.leaveAllRoomsOnDisconnect(socket, user)
  }
  
  @SubscribeMessage('newRoom')
  async handleRoomCreate(socket: Socket, payload: any): Promise<any> { 
    // create and add owner to room
    const newRoom = await this.roomService.createChatRoom(socket.data.user, payload);
    if (!newRoom)
    {
      const error = {Error: "Room With Same Name Already exits"}
      socket.emit("Error", error)
      return undefined;
    }
    socket.emit("RoomCreated", newRoom)
    socket.join(newRoom.name)
    return (newRoom)
  }

   @SubscribeMessage('joinRoom')
   async joinRoom(socket: Socket, payload: any) {
     const user = socket.data.user
     const roomName = payload.roomName
     const verify = await this.roomService.UserRoomExists(user, roomName);
     if (verify) {
      socket.emit("Error", verify.Error)
      return (undefined)
     }
     const roomMembers = await this.roomService.joinUserToRoom(user, roomName)
     // join socket  chanel
     socket.join(payload.roomName)
     socket.emit("message", "Welcome to Ch4t!")
     socket.to(roomName).emit("message", `${user.username} Joined Ch4t!`)
     socket.emit("users", roomMembers)
   }

   @SubscribeMessage('leaveRoom')
   async leaveRoom(socket: Socket, payload: any) {
    const user = socket.data.user;
    const roomName = payload.roomName
    await this.roomService.removeUserFromRoom(user.id, roomName)
    socket.broadcast.to(roomName).emit("message", `${user.username} left Ch4t!`)
    socket.leave(roomName)
   }
}