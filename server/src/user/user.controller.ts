import { auth42Guard } from "src/auth/guards/auth.guard";
import { UserService } from "./user.service";
import {Controller, Get, Param, Req, UseGuards} from "@nestjs/common"
import { JwtAuth } from "src/auth/guards/jwtauth.guard";

@Controller('user/friends')
@UseGuards(JwtAuth)
export class UserController {
    constructor(private userService: UserService){

    }
    @Get('add/:username')
    async addFriend(@Req() req: any, @Param("username") username: string) {
        const current_username: string = req.user.username;
        const res = await this.userService.addFriend(current_username, username)
        console.log(res)
        return `username :${username}`
    }
    @Get('accept/:username')
    async acceptFriend(@Req() req: any, @Param("username") username: string) {
        const current_username: string = req.user.username;
        return (await this.userService.acceptFriend(current_username, username))
    }
    @Get('all')
    async getAllFriends(@Req() req: any) {
        const current_username: string = req.user.username;
        return (await this.userService.getAllFriends(current_username))
    }

}