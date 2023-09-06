import { UserService } from "./user.service";
import {Controller, Get, Param, Req, UseGuards} from "@nestjs/common"
import { JwtAuth } from "src/auth/guards/jwtauth.guard";

@Controller('user')
@UseGuards(JwtAuth)
export class UserController {
    constructor(private userService: UserService){

    }
    @Get('friends/add/:username')
    async addFriend(@Req() req: any, @Param("username") username: string) {
        const current_username: string = req.user.username;
        const status = await this.userService.addFriend(current_username, username)
        return status
    }

    @Get('friends/accept/:username')
    async acceptFriend(@Req() req: any, @Param("username") username: string) {
        const current_username: string = req.user.username;
        return (await this.userService.acceptFriend(current_username, username))
    }
    @Get('friends/all')
    async getAllFriends(@Req() req: any) {
        const current_username: string = req.user.username;
        return (await this.userService.getAllFriends(current_username))
    }
    @Get('profile/:username')
    async getUserprofile(@Param("username") username: string) {
        const profile = await this.userService.getUserProfile(username);
        return (profile)
    }

}