import {OnGatewayConnection,
        OnGatewayDisconnect,
        SubscribeMessage,
        WebSocketGateway,
        } from '@nestjs/websockets';

import  {
        JoinRoomDTO,
        chatMessageDTO,
        PrivateMessageDTO } from "src/chat/dtos/chat.dto"
    
import { Socket } from 'socket.io'
import { ValidationExceptionFilter } from "src/chat/dtos/chatvalidation.filer";
import { GatewayService } from "./gateway.service";
import { ChatService } from "src/chat/chat.service";
import { UseFilters, UsePipes, ValidationPipe } from "@nestjs/common"

@WebSocketGateway({ cors: true })
@UseFilters(ValidationExceptionFilter)
@UsePipes(new ValidationPipe({
  //disableErrorMessages: true,
  whitelist: true,
  forbidNonWhitelisted: true
}))
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

  constructor(
    private gatewayService: GatewayService,
    private chatService: ChatService) {

  }

  handleConnection(socket: Socket) {
    this.gatewayService.socketConnection(socket)
  }

  private async leaveAllRoomsOnDisconnect(socket: Socket, user: any) {
    /*
      Deleting all member entrys should be at leaveRoom
    */
    //this.gatewayService.leavAllSocketRooms(socket, user)
  }

  async handleDisconnect(socket: Socket) {
    const user = socket.data.user
    socket.leave(String(user.id))
    await this.leaveAllRoomsOnDisconnect(socket, user)
  }

  @SubscribeMessage('joinChat')
  async joinChat(socket: Socket, payload: JoinRoomDTO) {
    await this.chatService.connectToChat(socket, payload)
  }

  @SubscribeMessage('leaveChat')
  async leavChat(socket: Socket, payload: JoinRoomDTO) {
    await this.chatService.leaveChat(socket, payload)
  }

  @SubscribeMessage('chatMessage')
  async handleChatMessage(socket: Socket, payload: chatMessageDTO) {
    await this.chatService.SendChatMessage(socket, payload)
  }

  @SubscribeMessage('PrivateMessage')
  async handlePrivateMessage(socket: Socket, payload: PrivateMessageDTO) {
    await this.chatService.SendPrivateChatMessage(socket, payload)
  }

  @SubscribeMessage('myChats')
  async getMychats(socket: Socket, payload) {
    await this.chatService.getMyChats(socket)
  }

}