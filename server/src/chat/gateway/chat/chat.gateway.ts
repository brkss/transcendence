import {OnGatewayConnection,
        OnGatewayDisconnect,
        SubscribeMessage,
        WebSocketGateway,
        } from '@nestjs/websockets';

import  {
        JoinRoomDTO,
        chatMessageDTO,
        PrivateMessageDTO, 
        LeaveRoomDTO} from "src/chat/dtos/chat.dto"
    
import { Socket } from 'socket.io'
import { ValidationExceptionFilter } from "src/chat/dtos/chatvalidation.filer";
import { GatewayService } from "./gateway.service";
import { ChatService } from "src/chat/chat.service";
import { UseFilters, UsePipes, ValidationPipe } from "@nestjs/common"

@WebSocketGateway({ cors: true })
@UseFilters(ValidationExceptionFilter)
@UsePipes(new ValidationPipe({
  disableErrorMessages: false,
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
    const connected_rooms = await this.chatService.getConnectedRooms(user.id)

    for (const room of connected_rooms) {
      const payload = {
        room_id: room.roomId
      }
      await this.chatService.leaveChat(socket, payload)
    }
  }

  @SubscribeMessage('joinChat')
  async joinChat(socket: Socket, payload: JoinRoomDTO) {
    await this.chatService.connectToChat(socket, payload)
  }

  @SubscribeMessage('leaveChat')
  async leavChat(socket: Socket, payload: LeaveRoomDTO) {
    await this.chatService.leaveChat(socket, payload)
  }

  @SubscribeMessage('chatMessage')
  async handleChatMessage(socket: Socket, payload: chatMessageDTO) {
    await this.chatService.SendChatMessage(socket, payload)
  }

  @SubscribeMessage('privateMessage')
  async handlePrivateMessage(socket: Socket, payload: PrivateMessageDTO) {
    await this.chatService.SendPrivateChatMessage(socket, payload)
  }

  // @SubscribeMessage('myChats')
  // async getMychats(socket: Socket, payload) {
  //   await this.chatService.getMyChats(socket)
  // }
}