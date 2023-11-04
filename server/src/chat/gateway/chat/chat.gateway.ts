import {OnGatewayConnection,
        OnGatewayDisconnect,
        SubscribeMessage,
        WebSocketGateway,
        } from '@nestjs/websockets';

import  {createRoomDTO,
        JoinRoomDTO,
        LeaveRoomDTO,
        chatMessageDTO,
        updateRoomDTO,
        kickDTO,
        setAdminDTO,
        RoomDTO,
        MuteUserDTO,
        PrivateMessageDTO} from "src/chat/dtos/chat.dto"
    
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

  @SubscribeMessage('allRooms')
  async getAllUserRooms(socket: Socket) {
    await this.chatService.getAllRooms(socket)
  }

  @SubscribeMessage('newRoom')
  async handleRoomCreate(socket: Socket, payload: createRoomDTO): Promise<any> {
    await  this.chatService.CreateNewChatRoom(socket, payload)
  }

  @SubscribeMessage('updateRoom')
  async handleRoomUpdate(socket: Socket, payload: updateRoomDTO) {
    await this.chatService.UpdateChatRoom(socket, payload)
  }

  @SubscribeMessage('deleteRoom')
  async handleDeleteRoom(socket: Socket, payload: RoomDTO) {
    await this.chatService.DeleteChatRoom(socket, payload)
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(socket: Socket, payload: JoinRoomDTO) {
    await this.chatService.joinChatRoom(socket, payload)
  }

  @SubscribeMessage('leaveRoom')
  async leaveRoom(socket: Socket, payload: LeaveRoomDTO) {
    await this.chatService.leaveChatRoom(socket, payload)
  }

  @SubscribeMessage('chatMessage')
  async handleChatMessage(socket: Socket, payload: chatMessageDTO) {
    await this.chatService.SendChatMessage(socket, payload)
  }

  @SubscribeMessage('PrivateMessage')
  async handlePrivateMessage(socket: Socket, payload: PrivateMessageDTO) {
    await this.chatService.SendPrivateChatMessage(socket, payload)
  }

  @SubscribeMessage("kickUser")
  async kickUserFromRoom(socket: Socket, payload: kickDTO) {
    await this.chatService.kickUserFromRoom(socket, payload)
  }

  @SubscribeMessage("banUser")
  async banUserFromRoom(socket: Socket, payload: kickDTO) {
    await this.chatService.banUserFromRoom(socket, payload)
  }

  @SubscribeMessage("unbanUser")
  async UnbanUserFromRoom(socket: Socket, payload: kickDTO) {
    await this.chatService.UnbanUserFromRoom(socket, payload)
  }

  @SubscribeMessage("setAdmin")
  async setRoomAdmin(socket: Socket, payload: setAdminDTO) {
    await this.chatService.setAdmin(socket, payload)
  }

  @SubscribeMessage("bannedUsers")
  async getBannedUsers(socket: Socket, payload: RoomDTO) {
    await this.chatService.getBannedUsers(socket, payload)
  }

  @SubscribeMessage("muteUser")
  async muteUser(socket: Socket, payload: MuteUserDTO) {
    await this.chatService.muteUser(socket, payload)
  }

  @SubscribeMessage("unmuteUser")
  async UnmuteUser(socket: Socket, payload: MuteUserDTO) {
    await this.chatService.UnmuteUser(socket, payload)
  }
}
