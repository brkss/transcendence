import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket } from 'socket.io'


//@WebSocketGateway({cors: {origin: "https://hoppscotch.io"}})
@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection , OnGatewayDisconnect{
  @WebSocketServer()
  private server;

  constructor(private jwtService: JwtService) {

  }

  private UnauthorizedDisconnect(socket: Socket) {
    socket.emit("Error", new UnauthorizedException())
    socket.disconnect()
  }
  private connectionSuccess(socket: Socket) {
    socket.emit("message", {Connection: "success"})
  }

  handleConnection(socket: Socket) {
    const access_token = socket.request.headers.authorization
    try {
      const payload = this.jwtService.verify(access_token) // use canactivate with
      console.log(payload) // palyload verifitcation user exists
    }catch (error) {
      console.log(error)
      this.UnauthorizedDisconnect(socket)
    }
    this.connectionSuccess(socket)
  }

  handleDisconnect(client: any) {
    console.log("Log on disconnect") 
    this.server.emit("message", "test is a test on close")
    //console.log(client)
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    console.log(payload)
    this.server.emit("message", "test is a test")
    return 'Hello world!';
  }

}
