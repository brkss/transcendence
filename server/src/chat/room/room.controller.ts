import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Req, UseGuards } from "@nestjs/common";
import { RoomService } from "./room.service";
import { JwtAuth } from "src/auth/guards/jwtauth.guard";
import { BanDTO, JoinRoomDTO, MuteUserDTO, RoomDTO, createRoomDTO, findRoomDTO, kickDTO, setAdminDTO, updateRoomDTO } from "../dtos/chat.dto";

@Controller('room')
@UseGuards(JwtAuth)
export class RoomController {
    constructor(private roomService: RoomService){

    }

    @Delete('/:room_id')
    async handleDeleteRoom(@Req() request: any, @Param('room_id', ParseIntPipe) room_id : number) {
        return (await this.roomService.DeleteChatRoom(request.user, room_id))
    }
    @Post("search")
    async hadleSearchRoom(@Req() request: any, @Body() body: findRoomDTO) {
      return (await this.roomService.findRoomByName(body))
    }
    @Post("add")
    async handleRoomCreate(@Req() request: any, @Body() body: createRoomDTO): Promise<any> {
        return (await  this.roomService.CreateNewChatRoom(request.user, body))
    }
    @Post("update")
    async handleRoomUpdate(@Req() request: any, @Body() body: updateRoomDTO) {
        return (await this.roomService.UpdateChatRoom(request.user, body))
    }
    @Post('join')
    async joinRoom(@Req() request: any, @Body() body:  JoinRoomDTO) {
      console.log("join body : ", body);
        return (await this.roomService.joinChatRoom(request.user, body))
    }
    @Post('/:id/leave')
    async leaveRoom(@Req() request: any, @Param('id', ParseIntPipe) room_id : number) {
      return (await this.roomService.leaveChatRoom(request.user, room_id))
    }
    @Post("users/kick")
    async kickUserFromRoom(@Req() request: any, @Body() body: kickDTO) {
      return (await this.roomService.kickUserFromRoom(request.user, body))
    }
  
    @Post("users/ban")
    async banUserFromRoom(@Req() request: any, @Body() body: BanDTO) {
      return (await this.roomService.banRoomUser(request.user, body))
    }
  
    @Post("users/unban")
    async UnbanUserFromRoom(@Req() request: any, @Body() body: kickDTO) {
      return (await this.roomService.UnbanUser(request.user, body))
    }
  
    @Post("users/setadmin")
    async setRoomAdmin(@Req() request: any, @Body() body: setAdminDTO) {
      return (await this.roomService.setAdmin(request.user, body))
    }

    @Post("/users/mute")
    async muteUser(@Req() request: any, @Body() body: MuteUserDTO) {
      return (await this.roomService.muteUser(request.user, body))
    }
  
    @Post("users/unmute")
    async UnmuteUser(@Req() request: any, @Body() body: MuteUserDTO) {
      await this.roomService.Un_muteUser(request.user, body)
    }

    @Get("users/banned")
    async getBannedUsers(@Req() request: any, @Body() body: RoomDTO) {
      return (await this.roomService.getBannedUsers(request.user, body))
    }
    @Get("users/muted")
    async getMutedUsers(@Req() request: any, @Body() body: RoomDTO) {
      return (await this.roomService.getMutedUsers(request.user, body))
    }
    @Get("/:room_id/users")
    async getRoomUsers(@Req() request: any , @Param('room_id', ParseIntPipe) room_id : number) {
      return (await this.roomService.getAllRoomUsers(request.user, room_id))
    }
}
