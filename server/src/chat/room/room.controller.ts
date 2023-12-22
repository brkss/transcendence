import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Req, UseGuards } from "@nestjs/common";
import { RoomService } from "./room.service";
import { JwtAuth } from "src/auth/guards/jwtauth.guard";
import { BanDTO, JoinRoomDTO, MuteUserDTO, RoomDTO, createRoomDTO, findRoomDTO, kickDTO, setAdminDTO, updateRoomDTO, UnMuteUserDTO } from "../dtos/chat.dto";
import { all } from "axios";

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
      const user = request.user
      const all_rooms = await this.roomService.findRoomByName(body);
      const user_banned_rooms = await this.roomService.getUserBannedRooms(user.id)
      //console.log("user banned : ", user_banned_rooms)
      const rooms  = all_rooms.map((room) => {
        if(user_banned_rooms.findIndex(x => x.room_id === room.id) === -1)
          return room;
      }).filter((room) => room !== undefined);
      //console.log("rooms : ", rooms);
      // all_rooms.filter((room) => (
      //   user_banned_rooms.indexOf({room_id :room.id}) > -1
      // ))
      return (rooms);
      //return (await this.roomService.findRoomByName(body))
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
    async UnmuteUser(@Req() request: any, @Body() body: UnMuteUserDTO) {
      await this.roomService.Un_muteUser(request.user, body)
    }

    @Post("users/banned")
    async getBannedUsers(@Req() request: any, @Body() body: RoomDTO) {
      return (await this.roomService.getBannedUsers(request.user, body))
    }

    @Post("users/muted")
    async getMutedUsers(@Req() request: any, @Body() body: RoomDTO) {
      return (await this.roomService.getMutedUsers(request.user, body))
    }
    
    @Get("/:room_id/users")
    async getRoomUsers(@Req() request: any , @Param('room_id', ParseIntPipe) room_id : number) {
      return (await this.roomService.getAllRoomUsers(request.user, room_id))
    }

    @Get("/:room_id/chathistory")
    async getRoomChatHistory(@Req() request: any , @Param('room_id', ParseIntPipe) room_id : number) {
      return (await this.roomService.getRoomMessagess(request.user.id, room_id))
    }
}
