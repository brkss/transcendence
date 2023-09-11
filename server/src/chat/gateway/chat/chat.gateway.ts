import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket } from 'socket.io'
import { RoomService } from 'src/chat/room/room.service';


//@WebSocketGateway({cors: {origin: "https://hoppscotch.io"}})
@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection , OnGatewayDisconnect{
  @WebSocketServer()
  private server;

  constructor(private jwtService: JwtService, private roomService: RoomService) {

  }

  private UnauthorizedDisconnect(socket: Socket) {
    socket.emit("Error", new UnauthorizedException())
    socket.disconnect()
  }
  private connectionSuccess(socket: Socket) {
    socket.emit("message", {Connection: "success"})
  }
  private async emitAllUserRooms(socket: Socket, userID: number) {
    const user_rooms = await this.roomService.getUserRooms(userID); 
    socket.emit("message", user_rooms)
    console.log(user_rooms)
  }

  handleConnection(socket: Socket) {
    const access_token = socket.request.headers.authorization
    try {
      const payload = this.jwtService.verify(access_token) // use canactivate with
      // add user to socket on succcess 
      socket.data.user = payload;
      this.emitAllUserRooms(socket, payload.id)
      
    }catch (error) {
      console.log(error)
      this.UnauthorizedDisconnect(socket)
    }
    this.connectionSuccess(socket)
  }

  handleDisconnect(client: any) {
    console.log("Log on disconnect") 
    this.server.emit("message", "test is a test on close")
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    console.log(payload)
    this.server.emit("message", "test is a test")
    return 'Hello world!';
  }

  @SubscribeMessage('newRoom')
  async handleRoomCreate(client: any, payload: any): Promise<any> { 
    const newRoom = await this.roomService.createChatRoom(client.data.user, payload);
    if (!newRoom)
    {
      const error = {Error: "Room With Same Name Already exits"}
      client.emit("Error", error)
      return undefined;
    }
    console.log(newRoom)
    client.emit("RoomCreated", newRoom)
    return (newRoom)
  }
}
